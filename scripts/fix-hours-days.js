#!/usr/bin/env node

import fs from "fs";

const TOKEN = fs.readFileSync(".env", "utf-8").split("=")[1].trim();
const BASE_ID = "app2GMlVxnjw6ifzz";
const HOURS_TABLE = "tblp2gxzk6xGeDtnI";

async function main() {
  const dryRun = !process.argv.includes("--execute");

  // Step 1: Add multi-select Days field
  console.log("Adding 'Days of Week' multi-select field...\n");

  if (!dryRun) {
    const addFieldRes = await fetch(
      `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables/${HOURS_TABLE}/fields`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Days of Week",
          type: "multipleSelects",
          description: "Select all days this schedule applies to",
          options: {
            choices: [
              { name: "Mon", color: "blueLight2" },
              { name: "Tue", color: "cyanLight2" },
              { name: "Wed", color: "tealLight2" },
              { name: "Thu", color: "greenLight2" },
              { name: "Fri", color: "yellowLight2" },
              { name: "Sat", color: "orangeLight2" },
              { name: "Sun", color: "redLight2" },
            ],
          },
        }),
      },
    );

    if (!addFieldRes.ok) {
      const err = await addFieldRes.json();
      if (err.error?.message?.includes("already exists")) {
        console.log("Field already exists, continuing...\n");
      } else {
        console.error("Failed to add field:", err);
        process.exit(1);
      }
    } else {
      console.log("✓ Created 'Days of Week' field\n");
    }
  }

  // Step 2: Fetch existing hours records
  console.log("Fetching hours records...");
  const res = await fetch(
    `https://api.airtable.com/v0/${BASE_ID}/${HOURS_TABLE}`,
    {
      headers: { Authorization: `Bearer ${TOKEN}` },
    },
  );
  const data = await res.json();
  console.log(`Found ${data.records.length} records\n`);

  // Step 3: Parse Days text and convert to multi-select
  const updates = [];

  for (const record of data.records) {
    const daysText = record.fields.Days || "";
    const days = parseDaysToArray(daysText);

    if (days.length > 0) {
      console.log(`${record.fields.Label || record.id}:`);
      console.log(`  "${daysText}" → [${days.join(", ")}]`);
      updates.push({
        id: record.id,
        fields: { "Days of Week": days },
      });
    } else if (daysText) {
      console.log(`${record.fields.Label || record.id}:`);
      console.log(`  "${daysText}" → COULD NOT PARSE`);
    }
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`Records to update: ${updates.length}`);

  if (dryRun) {
    console.log("\nDry run - no changes made. Run with --execute to apply.");
    return;
  }

  // Step 4: Update records in batches
  console.log("\nUpdating records...");
  for (let i = 0; i < updates.length; i += 10) {
    const batch = updates.slice(i, i + 10);
    const updateRes = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${HOURS_TABLE}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ records: batch }),
      },
    );

    if (!updateRes.ok) {
      const err = await updateRes.json();
      console.error("Failed to update batch:", err);
    }
  }

  console.log(`Updated ${updates.length} records`);
  console.log(
    "\nYou can now hide or delete the old 'Days' text field in Airtable.",
  );
}

function parseDaysToArray(text) {
  if (!text) return [];

  const days = [];
  const t = text.toLowerCase();

  // Handle ranges like "Mon-Fri" or "Tue-Thu"
  const rangeMatch = t.match(
    /(mon|tue|wed|thu|fri|sat|sun)\s*[-–]\s*(mon|tue|wed|thu|fri|sat|sun)/i,
  );
  if (rangeMatch) {
    const dayOrder = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    const start = dayOrder.indexOf(rangeMatch[1].toLowerCase().slice(0, 3));
    const end = dayOrder.indexOf(rangeMatch[2].toLowerCase().slice(0, 3));
    if (start !== -1 && end !== -1) {
      for (let i = start; i <= end; i++) {
        days.push(capitalize(dayOrder[i]));
      }
      return days;
    }
  }

  // Handle individual days
  if (t.includes("mon")) days.push("Mon");
  if (t.includes("tue")) days.push("Tue");
  if (t.includes("wed")) days.push("Wed");
  if (t.includes("thu")) days.push("Thu");
  if (t.includes("fri")) days.push("Fri");
  if (t.includes("sat")) days.push("Sat");
  if (t.includes("sun")) days.push("Sun");

  return days;
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

main().catch(console.error);
