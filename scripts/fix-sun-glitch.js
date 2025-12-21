#!/usr/bin/env node

import fs from "fs";

const TOKEN = fs.readFileSync(".env", "utf-8").split("=")[1].trim();
const BASE_ID = "app2GMlVxnjw6ifzz";
const HOURS_TABLE = "tblp2gxzk6xGeDtnI";

async function main() {
  const res = await fetch(
    `https://api.airtable.com/v0/${BASE_ID}/${HOURS_TABLE}`,
    {
      headers: { Authorization: `Bearer ${TOKEN}` },
    },
  );
  const data = await res.json();

  // Find records with "Express" or "until" in Days text that incorrectly have Sun
  const toFix = data.records.filter((r) => {
    const daysText = r.fields.Days || "";
    const daysOfWeek = r.fields["Days of Week"] || [];
    const hasProblematicText =
      daysText.toLowerCase().includes("express") ||
      daysText.toLowerCase().includes("until");
    return hasProblematicText && daysOfWeek.includes("Sun");
  });

  console.log(`Found ${toFix.length} records to fix:\n`);

  for (const r of toFix) {
    const currentDays = r.fields["Days of Week"];
    const fixedDays = currentDays.filter((d) => d !== "Sun");
    console.log(`${r.fields.Label}:`);
    console.log(`  [${currentDays.join(", ")}] → [${fixedDays.join(", ")}]`);

    const updateRes = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${HOURS_TABLE}/${r.id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields: { "Days of Week": fixedDays } }),
      },
    );

    if (updateRes.ok) {
      console.log("  ✓ Fixed\n");
    } else {
      console.log("  ✗ Failed\n");
    }
  }

  console.log("Done!");
}

main();
