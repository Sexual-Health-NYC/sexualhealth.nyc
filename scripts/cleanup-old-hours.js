#!/usr/bin/env node

/**
 * Clean up duplicate/old hours records for clinics that were updated.
 * Keeps only the new records we created.
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
const HOURS_TABLE = "tblp2gxzk6xGeDtnI";

// Clinic record IDs we updated
const CLINIC_IDS = [
  "reciqL0DSrCPIpQWl", // PP Bronx
  "rec21RbZxU7kqsmbW", // Callen-Lorde Chelsea
  "recGGbOw7hpU3Tt4i", // Callen-Lorde Brooklyn
  "recfD1rix9W0c0MIA", // Callen-Lorde Bronx
];

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

async function deleteRecord(recordId) {
  const url = `https://api.airtable.com/v0/${BASE_ID}/${HOURS_TABLE}/${recordId}`;

  const res = await fetch(url, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  if (!res.ok) {
    throw new Error(`Delete error: ${res.status} ${await res.text()}`);
  }

  return true;
}

async function main() {
  console.log("Fetching all hours records...");
  const allHours = await fetchAllHours();
  console.log(`Found ${allHours.length} total hours records\n`);

  // Find records for our clinics
  const relevantRecords = allHours.filter((record) => {
    const clinicLinks = record.fields.Clinic || [];
    return clinicLinks.some((id) => CLINIC_IDS.includes(id));
  });

  console.log(`Found ${relevantRecords.length} records for updated clinics\n`);

  // Group by clinic
  const byClinic = {};
  for (const record of relevantRecords) {
    const clinicId = (record.fields.Clinic || [])[0];
    if (!byClinic[clinicId]) byClinic[clinicId] = [];
    byClinic[clinicId].push(record);
  }

  // For each clinic, keep only the most recent records (created by our update script)
  for (const clinicId of CLINIC_IDS) {
    const records = byClinic[clinicId] || [];
    console.log(`\nClinic ${clinicId}: ${records.length} records`);

    // Sort by creation time (newest first)
    records.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));

    // Show all records
    for (const r of records) {
      const days = (r.fields["Days of Week"] || []).join(", ");
      const open = r.fields["Open Time"] || "";
      const close = r.fields["Close Time"] || "";
      console.log(`  ${r.id}: ${days} ${open}-${close} (${r.createdTime})`);
    }

    // If there are old records (before our update at ~19:57 UTC), identify them for deletion
    // Our updates were made around 19:57 UTC, so anything before 19:50 is old
    const cutoffTime = new Date("2025-12-21T19:50:00.000Z");
    const oldRecords = records.filter(
      (r) => new Date(r.createdTime) < cutoffTime,
    );

    if (oldRecords.length > 0) {
      console.log(`  -> ${oldRecords.length} old records to delete`);
      for (const r of oldRecords) {
        await deleteRecord(r.id);
        console.log(`     Deleted: ${r.id}`);
      }
    }
  }

  console.log(
    "\nDone! Run `node scripts/fetch-airtable.js` to regenerate GeoJSON.",
  );
}

main().catch(console.error);
