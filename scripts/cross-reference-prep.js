#!/usr/bin/env node

/**
 * Cross-reference our PrEP providers with NYS AIDS Institute directory
 * to find gaps in our coverage.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

// Load our clinic data
const geojsonPath = path.join(rootDir, "public", "clinics.geojson");
const geojson = JSON.parse(fs.readFileSync(geojsonPath, "utf-8"));

// Load NYS data
const nysDataPath = path.join(rootDir, "tmp-prep-new-york.json");
const nysData = JSON.parse(fs.readFileSync(nysDataPath, "utf-8"));

// NYC counties
const NYC_COUNTIES = ["NEW YORK", "KINGS", "QUEENS", "BRONX", "RICHMOND"];

// Filter to NYC only
const nycPrepProviders = nysData.filter((p) =>
  NYC_COUNTIES.includes(p.county?.toUpperCase()),
);

console.log(
  `NYS AIDS Institute PrEP providers in NYC: ${nycPrepProviders.length}`,
);

// Our PrEP providers
const ourPrepClinics = geojson.features.filter(
  (f) => f.properties.has_prep === true,
);
console.log(`Our PrEP clinics: ${ourPrepClinics.length}\n`);

// Normalize address for matching
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
    .replace(/floor/g, "fl")
    .replace(/suite/g, "ste")
    .replace(/\bfl\b\s*\d+/g, "")
    .replace(/\bste\b\s*\d+/g, "")
    .replace(/\s*#\s*\d+/g, "")
    .trim();
}

// Normalize name for matching
function normalizeName(name) {
  if (!name) return "";
  return name
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .replace(/community health center/g, "chc")
    .replace(/health center/g, "hc")
    .replace(/medical center/g, "mc")
    .replace(/family health/g, "fh")
    .trim();
}

// Try to match NYS providers to our database
const matched = [];
const unmatched = [];

for (const nysProvider of nycPrepProviders) {
  const nysAddr = normalizeAddress(nysProvider.address1);
  const nysName = normalizeName(nysProvider.site);

  let found = false;
  for (const clinic of ourPrepClinics) {
    const ourAddr = normalizeAddress(clinic.properties.address);
    const ourName = normalizeName(clinic.properties.name);

    // Match by address similarity or name similarity
    if (
      (nysAddr && ourAddr && nysAddr.includes(ourAddr.split(" ")[0])) ||
      (nysName &&
        ourName &&
        (nysName.includes(ourName) || ourName.includes(nysName)))
    ) {
      found = true;
      matched.push({
        nys: nysProvider.site,
        ours: clinic.properties.name,
        nysAddr: nysProvider.address1,
        ourAddr: clinic.properties.address,
      });
      break;
    }
  }

  if (!found) {
    unmatched.push(nysProvider);
  }
}

console.log(`Matched: ${matched.length}`);
console.log(`Unmatched (potential gaps): ${unmatched.length}\n`);

// Group unmatched by organization/name patterns
const byOrg = {};
for (const p of unmatched) {
  // Try to extract organization from site name
  let orgKey = p.site || "Unknown";
  // Common patterns: "Org Name - Location" or "Location at Org"
  if (orgKey.includes(" - ")) {
    orgKey = orgKey.split(" - ")[0];
  } else if (orgKey.includes(", ")) {
    orgKey = orgKey.split(", ")[0];
  }
  if (!byOrg[orgKey]) byOrg[orgKey] = [];
  byOrg[orgKey].push(p);
}

console.log("=== UNMATCHED PROVIDERS (potential gaps in our database) ===\n");

// Sort by count
const sortedOrgs = Object.entries(byOrg).sort(
  (a, b) => b[1].length - a[1].length,
);

for (const [org, providers] of sortedOrgs.slice(0, 30)) {
  console.log(`\n${org} (${providers.length} locations):`);
  for (const p of providers.slice(0, 3)) {
    console.log(`  - ${p.site}`);
    console.log(`    ${p.address1}, ${p.city} ${p.zip}`);
    console.log(
      `    Phone: ${p.sitePhone || "N/A"}, Walk-ins: ${p.Walkins || "N/A"}`,
    );
  }
  if (providers.length > 3) {
    console.log(`  ... and ${providers.length - 3} more`);
  }
}

// Summary by borough
console.log("\n\n=== GAPS BY BOROUGH ===\n");
const byBorough = {
  Manhattan: unmatched.filter((p) => p.county === "NEW YORK"),
  Brooklyn: unmatched.filter((p) => p.county === "KINGS"),
  Queens: unmatched.filter((p) => p.county === "QUEENS"),
  Bronx: unmatched.filter((p) => p.county === "BRONX"),
  "Staten Island": unmatched.filter((p) => p.county === "RICHMOND"),
};

for (const [borough, providers] of Object.entries(byBorough)) {
  console.log(`${borough}: ${providers.length} potential gaps`);
}

// Save detailed gap analysis
const gapReport = {
  summary: {
    nysTotal: nycPrepProviders.length,
    oursTotal: ourPrepClinics.length,
    matched: matched.length,
    gaps: unmatched.length,
  },
  gapsByBorough: Object.fromEntries(
    Object.entries(byBorough).map(([k, v]) => [k, v.length]),
  ),
  detailedGaps: unmatched.map((p) => ({
    name: p.site,
    address: `${p.address1}, ${p.city}, NY ${p.zip}`,
    county: p.county,
    phone: p.sitePhone,
    website: p.website,
    walkins: p.Walkins,
    telehealth: p.Telehealth,
  })),
};

const reportPath = path.join(rootDir, "tmp-prep-gap-analysis.json");
fs.writeFileSync(reportPath, JSON.stringify(gapReport, null, 2));
console.log(`\nDetailed gap report saved to: ${reportPath}`);
