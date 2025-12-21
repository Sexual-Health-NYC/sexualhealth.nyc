#!/usr/bin/env node

/**
 * Update clinic hours in Airtable based on December 2025 website scraping.
 *
 * This script updates hours for:
 * - PP Bronx (had wrong hours)
 * - Callen-Lorde Chelsea (had simplified hours)
 * - Callen-Lorde Brooklyn (had simplified hours)
 * - Callen-Lorde Bronx (had simplified hours)
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

// Clinic record IDs
const CLINICS = {
  "PP Bronx": "reciqL0DSrCPIpQWl",
  "Callen-Lorde Chelsea": "rec21RbZxU7kqsmbW",
  "Callen-Lorde Brooklyn": "recGGbOw7hpU3Tt4i",
  "Callen-Lorde Bronx": "recfD1rix9W0c0MIA",
};

// Updated hours from website scraping Dec 21, 2025
const HOURS_UPDATES = {
  "PP Bronx": [
    {
      days: ["Mon", "Tue", "Wed", "Thu"],
      open: "08:00",
      close: "19:00",
      department: "General",
    },
    { days: ["Fri"], open: "08:00", close: "18:00", department: "General" },
  ],
  "Callen-Lorde Chelsea": [
    {
      days: ["Mon", "Tue", "Wed", "Thu"],
      open: "08:15",
      close: "20:15",
      department: "General",
    },
    { days: ["Fri"], open: "09:45", close: "16:45", department: "General" },
    { days: ["Sat"], open: "09:00", close: "15:15", department: "General" },
  ],
  "Callen-Lorde Brooklyn": [
    {
      days: ["Mon", "Tue"],
      open: "08:30",
      close: "20:00",
      department: "General",
    },
    {
      days: ["Wed", "Thu"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
    { days: ["Fri"], open: "10:00", close: "16:45", department: "General" },
  ],
  "Callen-Lorde Bronx": [
    {
      days: ["Mon", "Tue", "Wed", "Thu"],
      open: "08:30",
      close: "19:30",
      department: "General",
    },
    { days: ["Fri"], open: "10:30", close: "16:30", department: "General" },
  ],
};

async function fetchExistingHours(clinicId) {
  const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${HOURS_TABLE}`);
  url.searchParams.set("filterByFormula", `{Clinic} = "${clinicId}"`);

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  if (!res.ok) {
    throw new Error(`Airtable API error: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return data.records;
}

async function deleteHoursRecord(recordId) {
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

async function createHoursRecord(clinicId, hours) {
  const url = `https://api.airtable.com/v0/${BASE_ID}/${HOURS_TABLE}`;

  const fields = {
    Clinic: [clinicId],
    Department: hours.department,
    "Days of Week": hours.days,
    "Open Time": hours.open,
    "Close Time": hours.close,
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields }),
  });

  if (!res.ok) {
    throw new Error(`Create error: ${res.status} ${await res.text()}`);
  }

  return await res.json();
}

async function updateClinicHours(clinicName) {
  const clinicId = CLINICS[clinicName];
  const newHours = HOURS_UPDATES[clinicName];

  console.log(`\nUpdating ${clinicName} (${clinicId})...`);

  // 1. Fetch existing hours
  const existing = await fetchExistingHours(clinicId);
  console.log(`  Found ${existing.length} existing hours records`);

  // 2. Delete old hours
  for (const record of existing) {
    await deleteHoursRecord(record.id);
    console.log(`  Deleted: ${record.id}`);
  }

  // 3. Create new hours
  for (const hours of newHours) {
    const created = await createHoursRecord(clinicId, hours);
    console.log(
      `  Created: ${hours.days.join(", ")} ${hours.open}-${hours.close}`,
    );
  }

  console.log(`  Done!`);
}

async function main() {
  console.log("Updating clinic hours from December 2025 website scraping...\n");

  for (const clinicName of Object.keys(HOURS_UPDATES)) {
    try {
      await updateClinicHours(clinicName);
    } catch (err) {
      console.error(`Error updating ${clinicName}:`, err.message);
    }
  }

  console.log(
    "\nAll done! Run `node scripts/fetch-airtable.js` to regenerate GeoJSON.",
  );
}

main().catch(console.error);
