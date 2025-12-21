#!/usr/bin/env node

import fs from "fs";

const TOKEN = fs.readFileSync(".env", "utf-8").split("=")[1].trim();
const BASE_ID = "app2GMlVxnjw6ifzz";
const CLINICS_TABLE = "tblx7sVpDo17Hkmmr";
const HOURS_TABLE = "tblp2gxzk6xGeDtnI";

// Parse hours text into structured records
function parseHours(hoursText, clinicName) {
  if (!hoursText) return [];

  const records = [];
  const lines = hoursText
    .split(/[;\n]/)
    .map((l) => l.trim())
    .filter(Boolean);

  for (const line of lines) {
    const record = { Department: "General", Notes: "" };

    // Check for department prefix (e.g., "Women's Health: Mon-Fri 9am-5pm")
    const deptMatch = line.match(/^([^:]+):\s*(.+)$/);
    let timesPart = line;

    if (deptMatch) {
      const possibleDept = deptMatch[1].trim();
      // Check if it's a department name vs a day
      if (
        !possibleDept.match(
          /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/i,
        )
      ) {
        record.Department = possibleDept;
        timesPart = deptMatch[2];
      }
    }

    // Try to parse days and times
    // Pattern: "Mon-Fri 9am-5pm" or "Monday-Friday: 9:00am - 5:00pm"
    const dayTimeMatch = timesPart.match(
      /^([\w\s,\-\/]+?)\s*[:\s]\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\s*[-–to]+\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i,
    );

    if (dayTimeMatch) {
      record.Days = normalizeDays(dayTimeMatch[1]);
      record["Open Time"] = normalizeTime(dayTimeMatch[2]);
      record["Close Time"] = normalizeTime(dayTimeMatch[3]);
    } else {
      // Try simpler pattern: "Mon-Fri" with no times
      const daysOnlyMatch = timesPart.match(
        /^((?:Mon|Tue|Wed|Thu|Fri|Sat|Sun|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)[\w\s,\-\/]*)/i,
      );
      if (daysOnlyMatch) {
        record.Days = normalizeDays(daysOnlyMatch[1]);
        record["All Day"] = true;
      } else {
        // Can't parse - store as note
        record.Notes = line;
        record.Days = "";
      }
    }

    // Generate label
    record.Label = `${clinicName} - ${record.Department}${record.Days ? ` (${record.Days})` : ""}`;

    records.push(record);
  }

  return records.length > 0 ? records : null;
}

function normalizeDays(days) {
  return days
    .trim()
    .replace(/Monday/gi, "Mon")
    .replace(/Tuesday/gi, "Tue")
    .replace(/Wednesday/gi, "Wed")
    .replace(/Thursday/gi, "Thu")
    .replace(/Friday/gi, "Fri")
    .replace(/Saturday/gi, "Sat")
    .replace(/Sunday/gi, "Sun")
    .replace(/\s+/g, "")
    .replace(/,/g, "/");
}

function normalizeTime(time) {
  if (!time) return "";

  const t = time.trim().toLowerCase();
  const match = t.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);

  if (!match) return "";

  let hours = parseInt(match[1], 10);
  const mins = match[2] || "00";
  const period = match[3]?.toLowerCase();

  if (period === "pm" && hours < 12) hours += 12;
  if (period === "am" && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, "0")}:${mins}`;
}

async function fetchClinics() {
  const res = await fetch(
    `https://api.airtable.com/v0/${BASE_ID}/${CLINICS_TABLE}`,
    {
      headers: { Authorization: `Bearer ${TOKEN}` },
    },
  );
  const data = await res.json();
  return data.records;
}

async function createHoursRecords(records) {
  // Airtable allows max 10 records per request
  const batches = [];
  for (let i = 0; i < records.length; i += 10) {
    batches.push(records.slice(i, i + 10));
  }

  const createdRecords = [];
  for (const batch of batches) {
    const res = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${HOURS_TABLE}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ records: batch }),
      },
    );

    if (!res.ok) {
      const err = await res.json();
      console.error("Failed to create batch:", err);
      continue;
    }

    const data = await res.json();
    createdRecords.push(...data.records);
  }

  return createdRecords;
}

async function main() {
  const dryRun = !process.argv.includes("--execute");

  console.log("Fetching clinics...\n");
  const clinics = await fetchClinics();

  const hoursToCreate = [];
  const clinicHoursMap = new Map(); // clinicId -> [hoursRecordIds]

  for (const clinic of clinics) {
    const hoursText = clinic.fields.Hours;
    const clinicName = clinic.fields["Clinic Name"];

    if (!hoursText) continue;

    const parsed = parseHours(hoursText, clinicName);
    if (!parsed) continue;

    console.log(`${clinicName}:`);
    console.log(`  Original: "${hoursText}"`);

    for (const rec of parsed) {
      console.log(
        `  -> ${rec.Department}: ${rec.Days || "(no days)"} ${rec["Open Time"] || ""}-${rec["Close Time"] || ""} ${rec["All Day"] ? "(All Day)" : ""} ${rec.Notes ? `[${rec.Notes}]` : ""}`,
      );

      hoursToCreate.push({
        fields: {
          Label: rec.Label,
          Clinic: [clinic.id],
          Department: rec.Department,
          Days: rec.Days || "",
          "Open Time": rec["Open Time"] || "",
          "Close Time": rec["Close Time"] || "",
          "All Day": rec["All Day"] || false,
          Notes: rec.Notes || "",
        },
      });
    }

    console.log("");
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(
    `Clinics with hours: ${new Set(hoursToCreate.map((h) => h.fields.Clinic[0])).size}`,
  );
  console.log(`Hours records to create: ${hoursToCreate.length}`);

  if (dryRun) {
    console.log("\nDry run - no changes made. Run with --execute to apply.");
    return;
  }

  console.log("\nCreating hours records...");
  const created = await createHoursRecords(hoursToCreate);
  console.log(`Created ${created.length} hours records`);
}

main().catch(console.error);
