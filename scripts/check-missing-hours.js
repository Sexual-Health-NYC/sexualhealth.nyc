#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

const geojson = JSON.parse(
  fs.readFileSync(path.join(rootDir, "public/clinics.geojson"), "utf8"),
);

// Group by borough
const byBorough = {};
for (const f of geojson.features) {
  const b = f.properties.borough || "Unknown";
  if (!(b in byBorough)) byBorough[b] = { withHours: [], missingHours: [] };
  const hasHours = f.properties.hours && f.properties.hours.length > 0;
  if (hasHours) {
    byBorough[b].withHours.push(f.properties);
  } else {
    byBorough[b].missingHours.push(f.properties);
  }
}

const total = geojson.features.length;
const missing = geojson.features.filter(
  (f) => (f.properties.hours || []).length === 0,
);

console.log(`Total physical clinics: ${total}`);
console.log(`Missing hours: ${missing.length}`);
console.log(
  `Coverage: ${Math.round(((total - missing.length) / total) * 100)}%\n`,
);

console.log("By borough:");
for (const [borough, data] of Object.entries(byBorough).sort()) {
  const t = data.withHours.length + data.missingHours.length;
  const m = data.missingHours.length;
  console.log(`  ${borough}: ${t} total, ${m} missing`);
}

console.log("\nMissing hours:");
missing.forEach((f) => console.log(` - ${f.properties.name}`));
