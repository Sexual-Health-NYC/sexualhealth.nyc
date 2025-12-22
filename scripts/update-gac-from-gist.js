#!/usr/bin/env node

/**
 * Update GAC sub-service flags based on Amida Care GIST May 2025 data.
 *
 * Usage:
 *   node scripts/update-gac-from-gist.js
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

async function fetchAllRecords(tableId) {
  const records = [];
  let offset = null;

  do {
    const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${tableId}`);
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
    throw new Error(
      `Failed to update ${recordId}: ${res.status} ${await res.text()}`,
    );
  }

  return res.json();
}

// GIST data mapping - clinic name patterns to services they offer
const GIST_UPDATES = [
  {
    // Mount Sinai CTMS - offers FFS, FMS, top surgery, bottom surgery (vaginoplasty, metoidioplasty, phalloplasty)
    namePattern: /Mount Sinai Center for Transgender Medicine/i,
    updates: {
      "Gender Affirming FFS": true,
      "Gender Affirming FMS": true,
      "Gender Affirming Top Surgery": true,
      "Gender Affirming Bottom Surgery": true,
    },
  },
  {
    // Mount Sinai Voice Therapy
    namePattern: /Mount Sinai.*Voice/i,
    updates: {
      "Gender Affirming Voice": true,
    },
  },
  {
    // NYU Langone Transgender Health Program - offers FFS, FMS, top surgery, bottom surgery
    namePattern: /NYU Langone Transgender Health/i,
    updates: {
      "Gender Affirming FFS": true,
      "Gender Affirming FMS": true,
      "Gender Affirming Top Surgery": true,
      "Gender Affirming Bottom Surgery": true,
    },
  },
  {
    // The Oval Center at Montefiore - full Transwellness program
    // Offers hormones, FFS, FMS, voice, top surgery, bottom surgery
    namePattern: /Oval Center.*Montefiore/i,
    updates: {
      "Gender-Affirming Care": true,
      "Gender Affirming Hormones": true,
      "Informed Consent HRT": true,
      "Gender Affirming FFS": true,
      "Gender Affirming FMS": true,
      "Gender Affirming Voice": true,
      "Gender Affirming Top Surgery": true,
      "Gender Affirming Bottom Surgery": true,
    },
  },
  {
    // Lenox Hill Hospital - Gerald J. Friedman Transgender Health & Wellness Program
    // Hormones and primary care (surgery referrals to Long Island campus)
    namePattern: /Lenox Hill/i,
    updates: {
      "Gender-Affirming Care": true,
      "Gender Affirming Hormones": true,
    },
  },
  {
    // Callen-Lorde - informed consent HRT, hormones
    namePattern: /Callen-Lorde/i,
    updates: {
      "Informed Consent HRT": true,
    },
  },
  {
    // Nios Spa - electrolysis
    namePattern: /Nios/i,
    updates: {
      "Gender Affirming Electrolysis": true,
    },
  },
  {
    // L'Elite Medispa - electrolysis and laser
    namePattern: /L'Elite|L\'Elite/i,
    updates: {
      "Gender Affirming Electrolysis": true,
      "Gender Affirming Laser": true,
    },
  },
  {
    // New York Electrolysis
    namePattern: /New York Electrolysis/i,
    updates: {
      "Gender Affirming Electrolysis": true,
    },
  },
  {
    // Planned Parenthood - informed consent
    namePattern: /Planned Parenthood/i,
    updates: {
      "Informed Consent HRT": true,
    },
  },
  {
    // Housing Works - informed consent
    namePattern: /Housing Works/i,
    updates: {
      "Informed Consent HRT": true,
    },
  },
  {
    // APICHA - informed consent
    namePattern: /Apicha/i,
    updates: {
      "Informed Consent HRT": true,
    },
  },
  {
    // CHN (Community Healthcare Network) - informed consent
    namePattern: /^CHN /i,
    updates: {
      "Informed Consent HRT": true,
    },
  },
];

async function main() {
  console.log("Fetching clinics from Airtable...");
  const clinics = await fetchAllRecords(CLINICS_TABLE);
  console.log(`Fetched ${clinics.length} clinics\n`);

  let updatedCount = 0;

  for (const clinic of clinics) {
    const name = clinic.fields["Clinic Name"] || "";

    for (const rule of GIST_UPDATES) {
      if (rule.namePattern.test(name)) {
        // Check if any updates are actually needed
        const neededUpdates = {};
        for (const [field, value] of Object.entries(rule.updates)) {
          if (clinic.fields[field] !== value) {
            neededUpdates[field] = value;
          }
        }

        if (Object.keys(neededUpdates).length > 0) {
          console.log(`Updating: ${name}`);
          console.log(`  Setting: ${Object.keys(neededUpdates).join(", ")}`);

          await updateRecord(clinic.id, neededUpdates);
          updatedCount++;

          // Rate limit - Airtable allows 5 requests/second
          await new Promise((resolve) => setTimeout(resolve, 250));
        }
      }
    }
  }

  console.log(`\nUpdated ${updatedCount} clinics`);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
