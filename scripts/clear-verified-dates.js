#!/usr/bin/env node

/**
 * Clear all "Last Verified" dates from Airtable
 * These were set incorrectly before we started actual verification
 *
 * Usage:
 *   node scripts/clear-verified-dates.js          # dry run
 *   node scripts/clear-verified-dates.js --execute  # actually clear
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

// Load token from .env
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
const TABLE_ID = "tblx7sVpDo17Hkmmr";
const EXECUTE = process.argv.includes("--execute");

async function airtableFetch(endpoint, options = {}) {
  const url = `https://api.airtable.com/v0/${BASE_ID}/${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Airtable error ${res.status}: ${text}`);
  }
  return res.json();
}

async function main() {
  console.log(EXECUTE ? "=== EXECUTE MODE ===" : "=== DRY RUN ===");

  // Fetch all records with Last Verified set
  let allRecords = [];
  let offset = null;

  do {
    const params = new URLSearchParams();
    params.set("filterByFormula", 'NOT({Last Verified} = "")');
    params.append("fields[]", "Clinic Name");
    params.append("fields[]", "Last Verified");
    if (offset) params.set("offset", offset);

    const data = await airtableFetch(`${TABLE_ID}?${params}`);
    allRecords = allRecords.concat(data.records);
    offset = data.offset;
  } while (offset);

  console.log(
    `\nFound ${allRecords.length} clinics with Last Verified dates:\n`,
  );

  for (const record of allRecords) {
    console.log(
      ` - ${record.fields["Clinic Name"]}: ${record.fields["Last Verified"]}`,
    );
  }

  if (allRecords.length === 0) {
    console.log("Nothing to clear!");
    return;
  }

  if (!EXECUTE) {
    console.log(`\nRun with --execute to clear ${allRecords.length} dates`);
    return;
  }

  // Clear in batches of 10
  console.log(`\nClearing ${allRecords.length} dates...`);

  for (let i = 0; i < allRecords.length; i += 10) {
    const batch = allRecords.slice(i, i + 10);
    const updates = batch.map((r) => ({
      id: r.id,
      fields: { "Last Verified": null },
    }));

    await airtableFetch(TABLE_ID, {
      method: "PATCH",
      body: JSON.stringify({ records: updates }),
    });

    console.log(
      `  Cleared ${Math.min(i + 10, allRecords.length)}/${allRecords.length}`,
    );
  }

  console.log("\nDone!");
}

main().catch(console.error);
