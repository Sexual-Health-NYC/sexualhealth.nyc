#!/usr/bin/env node

/**
 * Add Express Testing Available flag to Chelsea and Fort Greene Sexual Health Clinics.
 *
 * Note: This script assumes the "Express Testing Available" checkbox column
 * already exists in Airtable. If not, you'll need to create it first.
 *
 * Usage:
 *   node scripts/add-express-testing.js
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

// Clinics that have Express Testing (same building, 1st floor, rapid STI results)
const EXPRESS_TESTING_CLINICS = [
  "NYC DOH - Chelsea Sexual Health Clinic",
  "NYC DOH - Fort Greene Sexual Health Clinic",
];

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

async function main() {
  console.log("Adding Express Testing flag to clinics...\n");

  // Fetch all existing records
  const allRecords = await fetchAllRecords();
  console.log(`Fetched ${allRecords.length} existing records\n`);

  let updated = 0;
  let skipped = 0;

  for (const record of allRecords) {
    const name = record.fields["Clinic Name"] || "";

    if (EXPRESS_TESTING_CLINICS.includes(name)) {
      // Check if already has the flag
      if (record.fields["Express Testing Available"]) {
        console.log(`⏭️  ${name} already has Express Testing flag`);
        skipped++;
        continue;
      }

      try {
        await updateRecord(record.id, { "Express Testing Available": true });
        console.log(`✅ Set Express Testing Available for: ${name}`);
        updated++;
      } catch (err) {
        // If the column doesn't exist, Airtable will return an error
        if (err.message.includes("UNKNOWN_FIELD_NAME")) {
          console.error(
            `\n❌ Error: "Express Testing Available" column doesn't exist in Airtable!`,
          );
          console.error(
            `   Please create a checkbox column named "Express Testing Available" first.\n`,
          );
          process.exit(1);
        }
        console.error(`❌ Failed to update ${name}: ${err.message}`);
      }
    }
  }

  console.log(`\nDone! Updated ${updated} clinics, skipped ${skipped}.`);

  if (updated > 0) {
    console.log("\nNext steps:");
    console.log("1. Run 'npm run fetch-data' to regenerate GeoJSON");
    console.log("2. Update UI to show Express Testing badge if desired");
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
