#!/usr/bin/env node

/**
 * Update clinic hours in Airtable based on scraped website data.
 *
 * Usage:
 *   node scripts/update-hours-from-scrapes.js          # Dry run
 *   node scripts/update-hours-from-scrapes.js --execute # Actually update
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
const HOURS_TABLE = "tblHoursTable"; // Will need to get actual table ID

const EXECUTE = process.argv.includes("--execute");

// Hours data scraped from websites - December 2025
// Format: { clinicNamePattern: { hours: [...], notes: string } }
const SCRAPED_HOURS = {
  // NYC DOH Sexual Health Clinics - all same hours
  "NYC DOH - Chelsea Sexual Health Clinic": {
    hours: [
      {
        days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        open: "08:30",
        close: "15:30",
      },
    ],
    notes:
      "Express clinic has extended Tuesday hours until 7pm. May close early when capacity reached.",
    walkIn: true,
  },
  "NYC DOH - Fort Greene Sexual Health Clinic": {
    hours: [
      { days: ["Mon", "Wed", "Thu", "Fri"], open: "08:30", close: "15:30" },
      { days: ["Tue"], open: "08:30", close: "19:00" },
    ],
    notes:
      "Express clinic on 1st floor has extended Tuesday hours. May close early when capacity reached.",
    walkIn: true,
  },
  "NYC DOH - Corona Sexual Health Clinic": {
    hours: [
      { days: ["Mon", "Tue", "Wed", "Fri"], open: "08:30", close: "15:30" },
      { days: ["Thu"], open: "08:30", close: "19:15" },
    ],
    notes:
      "TEMPORARILY CLOSED for repairs as of August 2024. Thursday evening hours for STI/HIV testing.",
    walkIn: true,
  },
  "NYC DOH - Morrisania Sexual Health Clinic": {
    hours: [
      {
        days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        open: "08:30",
        close: "15:30",
      },
    ],
    notes:
      "May close early when capacity reached. Medication abortion available.",
    walkIn: true,
  },
  "NYC DOH - Jamaica Sexual Health Clinic": {
    hours: [
      {
        days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        open: "08:30",
        close: "15:30",
      },
    ],
    notes:
      "May close early when capacity reached. Medication abortion available.",
    walkIn: true,
  },
  "NYC DOH - Central Harlem Sexual Health Clinic": {
    hours: [
      {
        days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        open: "08:30",
        close: "15:30",
      },
    ],
    notes:
      "May close early when capacity reached. Medication abortion and pregnancy testing available.",
    walkIn: true,
  },

  // Institute for Family Health locations
  "Mt. Hope Family Practice": {
    hours: [
      { days: ["Mon"], open: "08:30", close: "19:00" },
      { days: ["Tue", "Wed", "Thu", "Fri"], open: "08:30", close: "17:00" },
    ],
    notes:
      "Open at 9:30am on 1st and 3rd Thursday. Saturday hours available - call for details.",
    walkIn: false,
  },
  "Stevenson Family Health Center": {
    hours: [
      {
        days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        open: "08:30",
        close: "17:00",
      },
    ],
    notes: "Call (718) 589-8775 for appointments.",
    walkIn: false,
  },
  "Urban Horizons Family Health Center": {
    hours: [
      {
        days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        open: "08:30",
        close: "17:00",
      },
    ],
    notes: "Call (718) 293-3900 for appointments.",
    walkIn: false,
  },
  "Walton Family Health Center": {
    hours: [
      {
        days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        open: "08:30",
        close: "17:00",
      },
    ],
    notes: "Free clinics for uninsured available. Call (718) 583-3060.",
    walkIn: false,
  },
  "Cadman Family Health Center": {
    hours: [
      {
        days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        open: "08:30",
        close: "17:00",
      },
    ],
    notes: "Call (718) 822-1818 for appointments.",
    walkIn: false,
  },
  "Amsterdam Family Health Center": {
    hours: [
      {
        days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        open: "08:30",
        close: "17:00",
      },
    ],
    notes: "Call (212) 865-4104 for appointments.",
    walkIn: false,
  },
  "Family Health Center of Harlem": {
    hours: [
      {
        days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        open: "08:30",
        close: "17:00",
      },
    ],
    notes: "Call (212) 423-4500 for appointments.",
    walkIn: false,
  },
  "Institute for Family Health at 17th Street": {
    hours: [
      {
        days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        open: "08:30",
        close: "17:00",
      },
    ],
    notes: "Free clinics for uninsured available. Call (212) 206-5200.",
    walkIn: false,
  },

  // Nios Spa - electrolysis
  "Nios Spa - Manhattan": {
    hours: [
      {
        days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        open: "09:00",
        close: "20:00",
      },
    ],
    notes: "Free consultation + 50% off first treatment for new clients.",
    walkIn: false,
  },
  "Nios Spa - Brooklyn": {
    hours: [
      {
        days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        open: "09:00",
        close: "20:00",
      },
    ],
    notes: "Free consultation + 50% off first treatment for new clients.",
    walkIn: false,
  },
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

async function updateClinic(recordId, fields) {
  const res = await fetch(
    `https://api.airtable.com/v0/${BASE_ID}/${CLINICS_TABLE}/${recordId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields }),
    },
  );

  if (!res.ok) {
    console.error(`  Update failed: ${await res.text()}`);
    return false;
  }
  return true;
}

function findMatchingHours(clinicName) {
  // Try exact match first
  if (SCRAPED_HOURS[clinicName]) {
    return SCRAPED_HOURS[clinicName];
  }

  // Try partial matches
  for (const [pattern, hours] of Object.entries(SCRAPED_HOURS)) {
    if (
      clinicName.toLowerCase().includes(pattern.toLowerCase()) ||
      pattern.toLowerCase().includes(clinicName.toLowerCase())
    ) {
      return hours;
    }
  }

  return null;
}

async function main() {
  console.log(EXECUTE ? "=== EXECUTE MODE ===" : "=== DRY RUN ===");
  console.log("");

  const clinics = await fetchAllClinics();
  console.log(`Fetched ${clinics.length} clinics from Airtable\n`);

  let matched = 0;
  let updated = 0;

  for (const clinic of clinics) {
    const name = clinic.fields["Clinic Name"] || "";
    const existingHours = clinic.fields["Hours JSON"];

    const hoursData = findMatchingHours(name);

    if (hoursData) {
      matched++;
      console.log(`MATCH: ${name}`);
      console.log(`  Hours: ${JSON.stringify(hoursData.hours)}`);
      if (hoursData.notes) console.log(`  Notes: ${hoursData.notes}`);

      if (EXECUTE) {
        // For now, just update walk-in status since hours are in separate table
        const fields = {};
        if (hoursData.walkIn !== undefined) {
          fields["Walk-In"] = hoursData.walkIn;
        }

        if (Object.keys(fields).length > 0) {
          const success = await updateClinic(clinic.id, fields);
          if (success) updated++;
          await new Promise((r) => setTimeout(r, 250));
        }
      }
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Matched: ${matched} clinics`);
  console.log(`Updated: ${updated} clinics`);

  if (!EXECUTE) {
    console.log("\nThis was a dry run. Use --execute to apply changes.");
    console.log("\nNOTE: Hours are stored in a separate table. This script");
    console.log("currently only updates walk-in status. Full hours update");
    console.log("requires adding records to the Hours table.");
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
