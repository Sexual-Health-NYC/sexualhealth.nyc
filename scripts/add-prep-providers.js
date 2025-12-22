#!/usr/bin/env node

/**
 * Add missing PrEP providers from NYS AIDS Institute directory to Airtable.
 * Cross-references with existing clinics to avoid duplicates.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

// Load tokens from .env
const envPath = path.join(rootDir, ".env");
const envContent = fs.readFileSync(envPath, "utf-8");
const envVars = {};
envContent.split("\n").forEach((line) => {
  const idx = line.indexOf("=");
  if (idx > 0) {
    envVars[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
});

const TOKEN = envVars.AIRTABLE_TOKEN;
const BASE_ID = "app2GMlVxnjw6ifzz";
const CLINICS_TABLE = "tblx7sVpDo17Hkmmr";

// NYC counties
const NYC_COUNTIES = ["NEW YORK", "KINGS", "QUEENS", "BRONX", "RICHMOND"];

// County to borough mapping
const COUNTY_TO_BOROUGH = {
  "NEW YORK": "Manhattan",
  KINGS: "Brooklyn",
  QUEENS: "Queens",
  BRONX: "Bronx",
  RICHMOND: "Staten Island",
};

async function fetchAllRecords() {
  const records = [];
  let offset = null;

  do {
    const url = new URL(
      `https://api.airtable.com/v0/${BASE_ID}/${CLINICS_TABLE}`,
    );
    url.searchParams.set("pageSize", "100");
    if (offset) url.searchParams.set("offset", offset);

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });

    if (!res.ok) {
      throw new Error(`Airtable API error: ${res.status} ${await res.text()}`);
    }

    const data = await res.json();
    records.push(...data.records);
    offset = data.offset;
  } while (offset);

  return records;
}

async function createRecord(fields) {
  const url = `https://api.airtable.com/v0/${BASE_ID}/${CLINICS_TABLE}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Airtable API error: ${res.status} ${error}`);
  }

  return await res.json();
}

// Normalize for matching
function normalizeAddress(addr) {
  if (!addr) return "";
  return addr
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/,/g, "")
    .replace(/\s+/g, " ")
    .replace(/street/g, "st")
    .replace(/avenue/g, "ave")
    .replace(/boulevard/g, "blvd")
    .replace(/drive/g, "dr")
    .replace(/place/g, "pl")
    .replace(/road/g, "rd")
    .replace(/\bfl\b\s*\d*/g, "")
    .replace(/\bfloor\b\s*\d*/g, "")
    .replace(/\bste\b\s*\d*/g, "")
    .replace(/\bsuite\b\s*\d*/g, "")
    .replace(/\s*#\s*\d+/g, "")
    .trim();
}

function normalizeName(name) {
  if (!name) return "";
  return name
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Check if provider already exists
function findExistingClinic(provider, existingClinics) {
  const provAddr = normalizeAddress(provider.address1);
  const provName = normalizeName(provider.site);

  for (const clinic of existingClinics) {
    const clinicAddr = normalizeAddress(clinic.fields.Address || "");
    const clinicName = normalizeName(clinic.fields["Clinic Name"] || "");

    // Match by street number + name similarity
    const provStreetNum = provAddr.match(/^\d+/)?.[0];
    const clinicStreetNum = clinicAddr.match(/^\d+/)?.[0];

    if (provStreetNum && clinicStreetNum && provStreetNum === clinicStreetNum) {
      // Same street number, check if names are similar
      if (
        provName.includes(clinicName.split(" ")[0]) ||
        clinicName.includes(provName.split(" ")[0])
      ) {
        return clinic;
      }
    }

    // Direct name match
    if (provName && clinicName) {
      if (provName.includes(clinicName) || clinicName.includes(provName)) {
        return clinic;
      }
    }
  }

  return null;
}

// Deduplicate providers by address
function deduplicateProviders(providers) {
  const seen = new Map();

  for (const p of providers) {
    const key = normalizeAddress(p.address1) + "|" + normalizeName(p.site);
    if (!seen.has(key)) {
      seen.set(key, p);
    }
  }

  return Array.from(seen.values());
}

async function main() {
  console.log("Adding missing PrEP providers to Airtable...\n");

  // Load NYS data
  const nysDataPath = path.join(rootDir, "tmp-prep-new-york.json");
  if (!fs.existsSync(nysDataPath)) {
    console.error("NYS data not found. Run scrape-prep-directory.js first.");
    process.exit(1);
  }
  const nysData = JSON.parse(fs.readFileSync(nysDataPath, "utf-8"));

  // Filter to NYC only
  const nycProviders = nysData.filter((p) =>
    NYC_COUNTIES.includes(p.county?.toUpperCase()),
  );
  console.log(`NYS providers in NYC: ${nycProviders.length}`);

  // Deduplicate
  const uniqueProviders = deduplicateProviders(nycProviders);
  console.log(`After deduplication: ${uniqueProviders.length}`);

  // Fetch existing clinics
  console.log("\nFetching existing clinics from Airtable...");
  const existingClinics = await fetchAllRecords();
  console.log(`Existing clinics: ${existingClinics.length}`);

  // Find missing providers
  const missing = [];
  const matched = [];

  for (const provider of uniqueProviders) {
    const existing = findExistingClinic(provider, existingClinics);
    if (existing) {
      matched.push({ provider, existing });
    } else {
      missing.push(provider);
    }
  }

  console.log(`\nMatched to existing: ${matched.length}`);
  console.log(`New providers to add: ${missing.length}\n`);

  if (missing.length === 0) {
    console.log("No new providers to add!");
    return;
  }

  // Add missing providers
  let added = 0;
  let errors = 0;

  for (const provider of missing) {
    const borough = COUNTY_TO_BOROUGH[provider.county?.toUpperCase()] || "";
    const fullAddress = [
      provider.address1,
      provider.address2,
      provider.city,
      "NY",
      provider.zip,
    ]
      .filter(Boolean)
      .join(", ")
      .replace(/, ,/g, ",");

    const fields = {
      "Clinic Name": provider.site || "Unknown Clinic",
      Address: fullAddress,
      Borough: borough,
      Phone: provider.sitePhone || "",
      Website: provider.website || "",
      Latitude: provider.lat,
      Longitude: provider.lng,
      PrEP: true,
      PEP: provider.PrePPEPOSMed?.includes("PEP") || false,
      "Walk-ins OK": provider.Walkins === "Yes",
      "Appointment Only": provider.Walkins === "No",
      "Data Sources": "NYS AIDS Institute Provider Directory Dec 2025",
    };

    try {
      await createRecord(fields);
      console.log(`✅ Added: ${provider.site}`);
      added++;

      // Rate limit - Airtable allows 5 requests/second
      await new Promise((r) => setTimeout(r, 250));
    } catch (err) {
      console.error(`❌ Failed to add ${provider.site}: ${err.message}`);
      errors++;
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Added: ${added}`);
  console.log(`Errors: ${errors}`);
  console.log(`\nRun 'npm run fetch-data' to regenerate GeoJSON.`);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
