#!/usr/bin/env node

/**
 * Scrape ALL clinic websites for hours data.
 * Uses BrightData MCP to scrape each website.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

// Load the GeoJSON to find clinics without hours
const geojsonPath = path.join(rootDir, "public/clinics.geojson");
const data = JSON.parse(fs.readFileSync(geojsonPath, "utf-8"));

// Find clinics without hours that have websites
const clinicsNeedingHours = data.features.filter((f) => {
  const hours = f.properties.hours;
  const website = f.properties.website;
  return (!hours || hours.length === 0) && website;
});

console.log(
  `Found ${clinicsNeedingHours.length} clinics without hours that have websites:\n`,
);

for (const clinic of clinicsNeedingHours) {
  console.log(`- ${clinic.properties.name}`);
  console.log(`  ${clinic.properties.website}`);
}

// Also find clinics without websites
const noWebsite = data.features.filter((f) => !f.properties.website);
console.log(`\n${noWebsite.length} clinics have no website at all:`);
for (const clinic of noWebsite) {
  console.log(`- ${clinic.properties.name}`);
}
