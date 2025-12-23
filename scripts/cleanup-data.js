#!/usr/bin/env node
/**
 * Data cleanup script for Airtable
 *
 * 1. Delete duplicate clinics (same address)
 * 2. Delete duplicate hours records
 * 3. Delete bad hours records (Sunday only 24hrs, empty times, etc.)
 *
 * Usage:
 *   node scripts/cleanup-data.js           # Dry run
 *   node scripts/cleanup-data.js --execute # Actually delete
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
const CLINICS_TABLE = "tblx7sVpDo17Hkmmr";
const HOURS_TABLE = "tblp2gxzk6xGeDtnI";

const EXECUTE = process.argv.includes("--execute");

// Duplicate clinics to delete (keep the one with most services)
// Format: { delete: [ids to delete], keep: id to keep }
const DUPLICATE_CLINICS = [
  {
    // 506 Lenox Ave - Harlem Hospital
    // Keep recOGmGyKfnP0bDKI (has all services)
    // Delete rec07IInOhPspOUIY (no services) and rec1mZKNdDjdLPNJ0 (bad hours)
    delete: ["rec07IInOhPspOUIY", "rec1mZKNdDjdLPNJ0"],
    keep: "recOGmGyKfnP0bDKI",
    reason: "506 Lenox Ave - Harlem Hospital duplicates",
  },
  {
    // 514 49th St Brooklyn - Sunset Terrace
    delete: ["recD7VGHikwBvZ2wF"],
    keep: "recfyF6uesXvsgvzq",
    reason: "514 49th St - Sunset Terrace duplicate",
  },
  {
    // 94-98 Manhattan Ave Brooklyn - CHN Williamsburg
    delete: ["rechaBPmHAhyXHZGL"],
    keep: "rec2OYlkQfracJstI",
    reason: "94-98 Manhattan Ave - CHN Williamsburg duplicate",
  },
  {
    // 511 W 157th St - CHN Washington Heights
    delete: ["rec9RXtkCMkn4Do1q"],
    keep: "recmBahvaEmP3NCkE",
    reason: "511 W 157th St - CHN Washington Heights duplicate",
  },
  {
    // 1167 Nostrand Ave - CHN Crown Heights
    delete: ["recb9FHXO4pYdljKT"],
    keep: "recLXZvg0QOVaFiuH",
    reason: "1167 Nostrand Ave - CHN Crown Heights duplicate",
  },
];

async function deleteRecord(table, recordId) {
  if (!EXECUTE) return true;

  const res = await fetch(
    `https://api.airtable.com/v0/${BASE_ID}/${table}/${recordId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${TOKEN}` },
    },
  );

  if (!res.ok) {
    console.error(`  Failed to delete ${recordId}: ${await res.text()}`);
    return false;
  }
  return true;
}

async function fetchAllHours() {
  const records = [];
  let offset = null;

  do {
    const url = new URL(
      `https://api.airtable.com/v0/${BASE_ID}/${HOURS_TABLE}`,
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

async function main() {
  console.log(EXECUTE ? "=== EXECUTE MODE ===" : "=== DRY RUN ===");
  console.log("");

  // 1. Delete duplicate clinics
  console.log("=== DUPLICATE CLINICS ===\n");
  for (const dup of DUPLICATE_CLINICS) {
    console.log(`${dup.reason}:`);
    console.log(`  Keeping: ${dup.keep}`);
    for (const id of dup.delete) {
      if (EXECUTE) {
        await deleteRecord(CLINICS_TABLE, id);
        console.log(`  Deleted: ${id}`);
        await new Promise((r) => setTimeout(r, 250));
      } else {
        console.log(`  Would delete: ${id}`);
      }
    }
    console.log("");
  }

  // 2. Fetch all hours and find duplicates/bad data
  console.log("=== HOURS CLEANUP ===\n");
  const allHours = await fetchAllHours();
  console.log(`Fetched ${allHours.length} hours records\n`);

  // Group hours by clinic
  const hoursByClinic = {};
  allHours.forEach((h) => {
    const clinicIds = h.fields.Clinic || [];
    clinicIds.forEach((clinicId) => {
      if (!hoursByClinic[clinicId]) hoursByClinic[clinicId] = [];
      hoursByClinic[clinicId].push(h);
    });
  });

  let duplicateHoursDeleted = 0;
  let badHoursDeleted = 0;

  for (const [clinicId, hours] of Object.entries(hoursByClinic)) {
    // Find duplicate hours (same days/open/close)
    const seen = new Map();
    const toDelete = [];

    for (const h of hours) {
      const key = JSON.stringify({
        days: h.fields["Days of Week"]?.sort() || [],
        open: h.fields["Open Time"],
        close: h.fields["Close Time"],
        dept: h.fields.Department,
      });

      if (seen.has(key)) {
        toDelete.push({ id: h.id, reason: "duplicate" });
      } else {
        seen.set(key, h.id);
      }

      // Check for bad hours
      const days = h.fields["Days of Week"] || [];
      const open = h.fields["Open Time"] || "";
      const close = h.fields["Close Time"] || "";

      // Sunday only with 24 hours
      if (
        days.length === 1 &&
        days[0] === "Sun" &&
        open === "00:00" &&
        (close === "23:59" || close === "24:00")
      ) {
        if (!toDelete.find((d) => d.id === h.id)) {
          toDelete.push({ id: h.id, reason: "bad: Sunday 24hrs" });
        }
      }

      // Empty times
      if (open === "" || close === "") {
        if (!toDelete.find((d) => d.id === h.id)) {
          toDelete.push({ id: h.id, reason: "bad: empty times" });
        }
      }
    }

    if (toDelete.length > 0) {
      for (const item of toDelete) {
        if (EXECUTE) {
          await deleteRecord(HOURS_TABLE, item.id);
          await new Promise((r) => setTimeout(r, 100));
        }

        if (item.reason === "duplicate") {
          duplicateHoursDeleted++;
        } else {
          badHoursDeleted++;
        }
      }
    }
  }

  console.log(
    `Duplicate hours ${EXECUTE ? "deleted" : "to delete"}: ${duplicateHoursDeleted}`,
  );
  console.log(
    `Bad hours ${EXECUTE ? "deleted" : "to delete"}: ${badHoursDeleted}`,
  );

  console.log("\n=== Summary ===");
  console.log(
    `Duplicate clinics: ${DUPLICATE_CLINICS.reduce((sum, d) => sum + d.delete.length, 0)}`,
  );
  console.log(`Duplicate hours: ${duplicateHoursDeleted}`);
  console.log(`Bad hours: ${badHoursDeleted}`);

  if (!EXECUTE) {
    console.log("\nThis was a dry run. Use --execute to apply changes.");
  } else {
    console.log("\nRun `npm run fetch-data` to regenerate GeoJSON.");
  }
}

main().catch(console.error);
