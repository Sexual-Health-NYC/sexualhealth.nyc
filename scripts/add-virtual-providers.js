#!/usr/bin/env node

/**
 * Add virtual/telehealth GAC providers to Airtable.
 * Also updates existing clinics with Informed Consent HRT flag based on Erin Reed's map.
 *
 * Usage:
 *   node scripts/add-virtual-providers.js
 *
 * Requires AIRTABLE_TOKEN in .env
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

// Load token from .env
const envPath = path.join(rootDir, ".env");
const envContent = fs.readFileSync(envPath, "utf-8");
const TOKEN = envContent.split("=")[1].trim();

const BASE_ID = "app2GMlVxnjw6ifzz";
const CLINICS_TABLE = "tblx7sVpDo17Hkmmr";

// New virtual GAC providers to add
const VIRTUAL_PROVIDERS = [
  {
    fields: {
      "Clinic Name": "Folx Health",
      Website: "https://www.folxhealth.com",
      Phone: "",
      "Public Email": "support@folxhealth.com",
      "Is Virtual": true,

      // Services
      "Gender-Affirming Care": true,
      "Gender Affirming Hormones": true,
      "Informed Consent HRT": true,
      Contraception: true, // Sexual & reproductive health
      PrEP: true, // Sexual health services

      // Insurance
      "Accepts Medicaid": false,
      "Sliding Scale": false,
      "No Insurance OK": true,

      // Populations
      "LGBTQ+ Focused": true,

      // Metadata
      "Data Sources": "Folx Health website Dec 2025",
    },
  },
  {
    fields: {
      "Clinic Name": "Plume",
      Website: "https://getplume.co",
      Phone: "",
      "Public Email": "",
      "Is Virtual": true,

      // Services
      "Gender-Affirming Care": true,
      "Gender Affirming Hormones": true,
      "Informed Consent HRT": true,

      // Insurance
      "Accepts Medicaid": false,
      "Sliding Scale": false,
      "No Insurance OK": true,

      // Populations
      "LGBTQ+ Focused": true,

      // Metadata
      "Data Sources": "Plume website Dec 2025",
    },
  },
];

// Clinics that should have Informed Consent HRT flag set (from Erin Reed's map)
// These are already in our database - we just need to update the flag
const INFORMED_CONSENT_CLINICS = [
  "Callen-Lorde", // All Callen-Lorde locations
  "APICHA",
  "Planned Parenthood", // All PP locations in NYC
  "Mount Sinai Center for Transgender", // Center for Transgender Medicine
];

// Clinics with Express Testing available (same building, 1st floor)
const EXPRESS_TESTING_CLINICS = [
  "NYC DOH - Chelsea Sexual Health Clinic",
  "NYC DOH - Fort Greene Sexual Health Clinic",
];

async function createRecord(record) {
  const url = `https://api.airtable.com/v0/${BASE_ID}/${CLINICS_TABLE}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(record),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Airtable API error: ${res.status} ${error}`);
  }

  return await res.json();
}

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

async function updateRecord(recordId, fields) {
  const url = `https://api.airtable.com/v0/${BASE_ID}/${CLINICS_TABLE}/${recordId}`;

  const res = await fetch(url, {
    method: "PATCH",
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

async function checkExistingProvider(name) {
  const records = await fetchAllRecords();
  return records.find(
    (r) => r.fields["Clinic Name"]?.toLowerCase() === name.toLowerCase(),
  );
}

async function main() {
  console.log("Adding virtual GAC providers to Airtable...\n");

  // 1. Add new virtual providers
  for (const provider of VIRTUAL_PROVIDERS) {
    const name = provider.fields["Clinic Name"];

    // Check if already exists
    const existing = await checkExistingProvider(name);
    if (existing) {
      console.log(`⏭️  ${name} already exists (ID: ${existing.id}), skipping`);
      continue;
    }

    try {
      const result = await createRecord(provider);
      console.log(`✅ Added ${name} (ID: ${result.id})`);
    } catch (err) {
      console.error(`❌ Failed to add ${name}: ${err.message}`);
    }
  }

  console.log("\n--- Updating existing clinics ---\n");

  // 2. Fetch all existing records
  const allRecords = await fetchAllRecords();
  console.log(`Fetched ${allRecords.length} existing records`);

  // 3. Update Informed Consent HRT flags
  for (const record of allRecords) {
    const name = record.fields["Clinic Name"] || "";

    // Check if this clinic matches any informed consent provider
    const isInformedConsent = INFORMED_CONSENT_CLINICS.some((pattern) =>
      name.includes(pattern),
    );

    if (isInformedConsent && !record.fields["Informed Consent HRT"]) {
      try {
        await updateRecord(record.id, { "Informed Consent HRT": true });
        console.log(`✅ Set Informed Consent HRT for: ${name}`);
      } catch (err) {
        console.error(`❌ Failed to update ${name}: ${err.message}`);
      }
    }

    // Check if this clinic should have Express Testing flag
    // Note: This requires adding "Express Testing Available" column to Airtable first
    const hasExpressTesting = EXPRESS_TESTING_CLINICS.includes(name);
    if (hasExpressTesting) {
      console.log(
        `ℹ️  ${name} has Express Testing available (update manually or add column)`,
      );
    }
  }

  console.log("\nDone!");
  console.log("\nNext steps:");
  console.log("1. Run 'npm run fetch-data' to regenerate GeoJSON");
  console.log(
    "2. Add 'Express Testing Available' checkbox column to Airtable if needed",
  );
  console.log("3. Update VirtualClinicSection.jsx to show for GAC services");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
