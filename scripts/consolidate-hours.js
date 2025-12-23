#!/usr/bin/env node

/**
 * Find and consolidate duplicate hours entries
 * e.g., 5 records for Mon, Tue, Wed, Thu, Fri with same times -> 1 record with all days
 *
 * Usage:
 *   node scripts/consolidate-hours.js          # dry run
 *   node scripts/consolidate-hours.js --execute  # actually consolidate
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
const HOURS_TABLE_ID = "tblp2gxzk6xGeDtnI";
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
  console.log(EXECUTE ? "=== EXECUTE MODE ===" : "=== DRY RUN ===\n");

  // Fetch all hours records
  let allRecords = [];
  let offset = null;

  do {
    const params = new URLSearchParams();
    if (offset) params.set("offset", offset);

    const data = await airtableFetch(`${HOURS_TABLE_ID}?${params}`);
    allRecords = allRecords.concat(data.records);
    offset = data.offset;
  } while (offset);

  console.log(`Fetched ${allRecords.length} hours records\n`);

  // Group by clinic + department + times
  const groups = {};

  for (const record of allRecords) {
    const f = record.fields;
    const clinicIds = f.Clinic || [];
    const dept = f.Department || "";
    const open = f["Open Time"] || "";
    const close = f["Close Time"] || "";
    const allDay = f["All Day"] || false;
    const notes = f.Notes || "";
    const daysOfWeek = f["Days of Week"] || [];

    // Skip records with multiple days already (they're already consolidated)
    // We only want to consolidate single-day records
    if (daysOfWeek.length !== 1) continue;

    // Create a key for grouping
    const key = `${clinicIds.join(",")}_${dept}_${open}_${close}_${allDay}_${notes}`;

    if (!groups[key]) {
      groups[key] = {
        clinicIds,
        dept,
        open,
        close,
        allDay,
        notes,
        records: [],
        days: [],
      };
    }

    groups[key].records.push(record);
    groups[key].days.push(daysOfWeek[0]);
  }

  // Find groups with multiple records (these need consolidation)
  const toConsolidate = Object.values(groups).filter(
    (g) => g.records.length > 1,
  );

  if (toConsolidate.length === 0) {
    console.log("No duplicates found to consolidate!");
    return;
  }

  console.log(`Found ${toConsolidate.length} groups to consolidate:\n`);

  let totalDeleted = 0;
  let totalUpdated = 0;

  for (const group of toConsolidate) {
    const clinicName = group.records[0].fields.Clinics || "Unknown";
    console.log(`\n${clinicName} - ${group.dept || "General"}`);
    console.log(
      `  Times: ${group.open || "?"} - ${group.close || "?"} ${group.allDay ? "(All Day)" : ""}`,
    );
    console.log(
      `  Current: ${group.records.length} separate records for: ${group.days.join(", ")}`,
    );
    console.log(
      `  Action: Merge into 1 record with Days of Week = [${group.days.join(", ")}]`,
    );

    if (EXECUTE) {
      // Keep the first record, update it with all days
      const keepRecord = group.records[0];
      const deleteRecords = group.records.slice(1);

      // Dedupe and sort days
      const uniqueDays = [...new Set(group.days)];
      const dayOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      uniqueDays.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));

      // Update the first record with all days
      await airtableFetch(HOURS_TABLE_ID, {
        method: "PATCH",
        body: JSON.stringify({
          records: [
            {
              id: keepRecord.id,
              fields: {
                "Days of Week": uniqueDays,
              },
            },
          ],
        }),
      });
      totalUpdated++;

      // Delete the other records in batches of 10
      for (let i = 0; i < deleteRecords.length; i += 10) {
        const batch = deleteRecords.slice(i, i + 10);
        const ids = batch.map((r) => `records[]=${r.id}`).join("&");
        await airtableFetch(`${HOURS_TABLE_ID}?${ids}`, {
          method: "DELETE",
        });
        totalDeleted += batch.length;
      }

      console.log(`  ✓ Done`);
    }
  }

  if (EXECUTE) {
    console.log(`\n=== Summary ===`);
    console.log(`Updated: ${totalUpdated} records`);
    console.log(`Deleted: ${totalDeleted} duplicate records`);
  } else {
    const wouldDelete = toConsolidate.reduce(
      (sum, g) => sum + g.records.length - 1,
      0,
    );
    console.log(
      `\nRun with --execute to consolidate ${toConsolidate.length} groups (would delete ${wouldDelete} duplicate records)`,
    );
  }
}

main().catch(console.error);
