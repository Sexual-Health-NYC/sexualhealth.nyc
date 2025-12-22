#!/usr/bin/env node

/**
 * Bulk update clinic hours in Airtable based on scraped website data.
 *
 * Usage:
 *   node scripts/bulk-update-hours.js          # Dry run
 *   node scripts/bulk-update-hours.js --execute # Actually update
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

// Hours data scraped from websites - December 2025
const HOURS_BY_CLINIC_NAME = {
  // NYC DOH Sexual Health Clinics
  "NYC DOH - Chelsea Sexual Health Clinic": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:30",
      close: "15:30",
      department: "General",
    },
  ],
  "NYC DOH - Fort Greene Sexual Health Clinic": [
    {
      days: ["Mon", "Wed", "Thu", "Fri"],
      open: "08:30",
      close: "15:30",
      department: "General",
    },
    { days: ["Tue"], open: "08:30", close: "19:00", department: "Express" },
  ],
  "NYC DOH - Morrisania Sexual Health Clinic": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:30",
      close: "15:30",
      department: "General",
    },
  ],
  "NYC DOH - Jamaica Sexual Health Clinic": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:30",
      close: "15:30",
      department: "General",
    },
  ],
  "NYC DOH - Central Harlem Sexual Health Clinic": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:30",
      close: "15:30",
      department: "General",
    },
  ],

  // Institute for Family Health locations
  "Mt. Hope Family Practice": [
    { days: ["Mon"], open: "08:30", close: "19:00", department: "General" },
    {
      days: ["Tue", "Wed", "Thu", "Fri"],
      open: "08:30",
      close: "17:00",
      department: "General",
    },
  ],
  "Stevenson Family Health Center": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:30",
      close: "17:00",
      department: "General",
    },
  ],
  "Urban Horizons Family Health Center": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:30",
      close: "17:00",
      department: "General",
    },
  ],
  "Walton Family Health Center": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:30",
      close: "17:00",
      department: "General",
    },
  ],
  "Cadman Family Health  Center": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:30",
      close: "17:00",
      department: "General",
    },
  ],
  "Amsterdam Family Health Center": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:30",
      close: "17:00",
      department: "General",
    },
  ],
  "Family Health Center of Harlem": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:30",
      close: "17:00",
      department: "General",
    },
  ],
  "Institute for Family Health at 17th Street": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:30",
      close: "17:00",
      department: "General",
    },
  ],
  "The Family Health Center of Harlem": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:30",
      close: "17:00",
      department: "General",
    },
  ],

  // Nios Spa - electrolysis (7 days)
  "Nios Spa - Manhattan": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      open: "09:00",
      close: "20:00",
      department: "General",
    },
  ],
  "Nios Spa - Brooklyn": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      open: "09:00",
      close: "20:00",
      department: "General",
    },
  ],

  // Montefiore Oval Center
  "The Oval Center at Montefiore Medical Center": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:30",
      close: "17:00",
      department: "General",
    },
  ],

  // AIDS Healthcare Foundation
  "AIDS Healthcare Foundation": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],

  // Apicha Community Health Center - December 2025
  "Apicha Community Health Center - Manhattan": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:30",
      department: "General",
    },
  ],
  "Apicha Community Health Center - Queens": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:30",
      department: "General",
    },
  ],

  // Mount Sinai Adolescent Health Center - December 2025
  "Mount Sinai Adolescent Health Center": [
    {
      days: ["Mon", "Tue", "Wed", "Fri"],
      open: "08:30",
      close: "17:00",
      department: "General",
    },
    {
      days: ["Thu"],
      open: "12:00",
      close: "17:00",
      department: "General",
    },
    {
      days: ["Sat"],
      open: "08:30",
      close: "16:00",
      department: "General",
    },
  ],

  // Charles B. Wang Community Health Center - December 2025
  "Charles B. Wang Community Health Center - Manhattan": [
    {
      days: ["Mon", "Tue", "Thu", "Fri", "Sat", "Sun"],
      open: "09:00",
      close: "18:00",
      department: "General",
    },
    {
      days: ["Wed"],
      open: "10:00",
      close: "18:00",
      department: "General",
    },
  ],
  "Charles B. Wang Community Health Center - Flushing 45th Ave": [
    {
      days: ["Mon", "Tue", "Thu", "Fri", "Sat", "Sun"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
    {
      days: ["Wed"],
      open: "10:00",
      close: "17:00",
      department: "General",
    },
  ],
  "Charles B. Wang Community Health Center - Flushing 40th Rd": [
    {
      days: ["Mon", "Tue", "Thu", "Fri", "Sat", "Sun"],
      open: "09:00",
      close: "18:00",
      department: "General",
    },
    {
      days: ["Wed"],
      open: "10:00",
      close: "18:00",
      department: "General",
    },
  ],
  "Charles B. Wang Community Health Center - Flushing 37th Ave": [
    {
      days: ["Mon", "Tue", "Thu", "Fri", "Sat"],
      open: "09:00",
      close: "18:00",
      department: "General",
    },
    {
      days: ["Wed"],
      open: "10:00",
      close: "18:00",
      department: "General",
    },
  ],

  // Betances Health Center - December 2025
  "Betances Health Center - Manhattan": [
    {
      days: ["Mon", "Tue", "Wed", "Fri"],
      open: "08:00",
      close: "17:00",
      department: "General",
    },
    {
      days: ["Thu"],
      open: "10:00",
      close: "17:00",
      department: "General",
    },
    {
      days: ["Sat"],
      open: "10:00",
      close: "14:00",
      department: "General",
    },
  ],
  "Betances Health Center - Brooklyn": [
    {
      days: ["Mon"],
      open: "08:00",
      close: "17:00",
      department: "General",
    },
    {
      days: ["Tue", "Wed", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
    {
      days: ["Thu"],
      open: "10:00",
      close: "17:00",
      department: "General",
    },
  ],

  // GMHC - December 2025
  GMHC: [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:30",
      close: "16:30",
      department: "General",
    },
  ],

  // Callen-Lorde Community Health Center - December 2025
  "Callen-Lorde Community Health Center - Chelsea": [
    {
      days: ["Mon", "Tue", "Wed", "Thu"],
      open: "08:15",
      close: "20:15",
      department: "General",
    },
    {
      days: ["Fri"],
      open: "09:45",
      close: "16:45",
      department: "General",
    },
    {
      days: ["Sat"],
      open: "09:00",
      close: "15:15",
      department: "General",
    },
  ],
  "Callen-Lorde Community Health Center - Brooklyn": [
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
    {
      days: ["Fri"],
      open: "10:00",
      close: "16:45",
      department: "General",
    },
  ],
  "Callen-Lorde Community Health Center - Bronx": [
    {
      days: ["Mon", "Tue", "Wed", "Thu"],
      open: "08:30",
      close: "19:30",
      department: "General",
    },
    {
      days: ["Fri"],
      open: "10:30",
      close: "16:30",
      department: "General",
    },
  ],

  // Urban Health Plan - December 2025
  "Urban Health Plan - Bella Vista": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:00",
      close: "17:00",
      department: "General",
    },
  ],
  "Urban Health Plan - Adolescent Health Center": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:00",
      close: "18:00",
      department: "General",
    },
  ],

  // Wakefield Ambulatory Care Center - December 2025
  "Wakefield Ambulatory Care Center": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],

  // BronxCare Health System - December 2025
  "BronxCare Health System - Fulton Campus": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],

  // Sun River Health - December 2025
  "Sun River Health - Peekskill": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],

  // Planned Parenthood of Greater NY - December 2025
  "Planned Parenthood - Manhattan Health Center": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
    {
      days: ["Sat"],
      open: "09:00",
      close: "15:00",
      department: "General",
    },
  ],
  "Planned Parenthood - Brooklyn Health Center": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
    {
      days: ["Sat"],
      open: "09:00",
      close: "15:00",
      department: "General",
    },
  ],
  "Planned Parenthood - Bronx Health Center": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],
  "Planned Parenthood - Queens Health Center": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],
  "Planned Parenthood - Staten Island Health Center": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],

  // Exponents - December 2025
  Exponents: [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "10:00",
      close: "16:30",
      department: "General",
    },
  ],
};

async function fetchAllClinics() {
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
  const res = await fetch(
    `https://api.airtable.com/v0/${BASE_ID}/${HOURS_TABLE}/${recordId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${TOKEN}` },
    },
  );

  if (!res.ok) {
    throw new Error(`Delete error: ${res.status} ${await res.text()}`);
  }
  return true;
}

async function createHoursRecord(clinicId, hours) {
  const fields = {
    Clinic: [clinicId],
    Department: hours.department,
    "Days of Week": hours.days,
    "Open Time": hours.open,
    "Close Time": hours.close,
  };

  const res = await fetch(
    `https://api.airtable.com/v0/${BASE_ID}/${HOURS_TABLE}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields }),
    },
  );

  if (!res.ok) {
    throw new Error(`Create error: ${res.status} ${await res.text()}`);
  }

  return await res.json();
}

async function updateClinicHours(clinicId, clinicName, newHours) {
  console.log(`\nUpdating: ${clinicName}`);

  // 1. Fetch existing hours
  const existing = await fetchExistingHours(clinicId);

  // Skip if already has hours
  if (existing.length > 0) {
    console.log(`  Already has ${existing.length} hours records - skipping`);
    return false;
  }

  if (!EXECUTE) {
    console.log(`  Would add ${newHours.length} hours records (dry run)`);
    for (const h of newHours) {
      console.log(`    ${h.days.join(", ")}: ${h.open}-${h.close}`);
    }
    return false;
  }

  // 2. Create new hours
  for (const hours of newHours) {
    await createHoursRecord(clinicId, hours);
    console.log(
      `  Created: ${hours.days.join(", ")} ${hours.open}-${hours.close}`,
    );
    await new Promise((r) => setTimeout(r, 250)); // Rate limit
  }

  return true;
}

async function main() {
  console.log(EXECUTE ? "=== EXECUTE MODE ===" : "=== DRY RUN ===");
  console.log("");

  const clinics = await fetchAllClinics();
  console.log(`Fetched ${clinics.length} clinics from Airtable`);

  // Build map of clinic name -> record ID
  const clinicMap = new Map();
  for (const clinic of clinics) {
    const name = clinic.fields["Clinic Name"];
    if (name) {
      clinicMap.set(name, clinic.id);
    }
  }

  let updated = 0;
  let matched = 0;

  for (const [clinicName, hours] of Object.entries(HOURS_BY_CLINIC_NAME)) {
    const clinicId = clinicMap.get(clinicName);

    if (!clinicId) {
      console.log(`\nNOT FOUND: ${clinicName}`);
      continue;
    }

    matched++;
    const wasUpdated = await updateClinicHours(clinicId, clinicName, hours);
    if (wasUpdated) updated++;
  }

  console.log(`\n=== Summary ===`);
  console.log(`Matched: ${matched} clinics`);
  console.log(`Updated: ${updated} clinics`);

  if (!EXECUTE) {
    console.log("\nThis was a dry run. Use --execute to apply changes.");
  } else {
    console.log("\nRun `npm run fetch-data` to regenerate GeoJSON.");
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
