#!/usr/bin/env node

import fs from "fs";

const TOKEN = fs.readFileSync(".env", "utf-8").split("=")[1].trim();
const BASE_ID = "app2GMlVxnjw6ifzz";

async function main() {
  console.log("Creating Hours table in Airtable...\n");

  // Step 1: Create the Hours table with all fields
  const createTableRes = await fetch(
    `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Hours",
        description: "Structured hours data linked to clinics",
        fields: [
          {
            name: "Label",
            type: "singleLineText",
            description: "Auto-generated label for this hours entry",
          },
          {
            name: "Clinic",
            type: "multipleRecordLinks",
            options: {
              linkedTableId: "tblx7sVpDo17Hkmmr", // Clinics table ID
            },
          },
          {
            name: "Department",
            type: "singleLineText",
            description:
              "Department or service (e.g., Women's Health, General, Abortion Services)",
          },
          {
            name: "Days",
            type: "singleLineText",
            description:
              "Days of operation (e.g., Mon-Fri, Mon/Wed/Fri, Tuesday)",
          },
          {
            name: "Open Time",
            type: "singleLineText",
            description: "Opening time in 24h format (e.g., 09:00, 08:30)",
          },
          {
            name: "Close Time",
            type: "singleLineText",
            description: "Closing time in 24h format (e.g., 17:00, 20:00)",
          },
          {
            name: "All Day",
            type: "checkbox",
            description: "Check if open all day (no specific hours)",
            options: {
              icon: "check",
              color: "greenBright",
            },
          },
          {
            name: "Notes",
            type: "singleLineText",
            description:
              "Additional context (e.g., Check for late nights, Express hours)",
          },
        ],
      }),
    },
  );

  if (!createTableRes.ok) {
    const err = await createTableRes.json();
    console.error("Failed to create table:", err);
    process.exit(1);
  }

  const tableData = await createTableRes.json();
  console.log("✓ Created Hours table");
  console.log("  Table ID:", tableData.id);

  // Step 2: Add the "Hours (Linked)" field to the Clinics table
  console.log("\nAdding 'Hours (Linked)' field to Clinics table...");

  const addFieldRes = await fetch(
    `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables/tblx7sVpDo17Hkmmr/fields`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Hours (Linked)",
        type: "multipleRecordLinks",
        description: "Structured hours data",
        options: {
          linkedTableId: tableData.id,
        },
      }),
    },
  );

  if (!addFieldRes.ok) {
    const err = await addFieldRes.json();
    console.error("Failed to add field to Clinics:", err);
    console.log(
      "\nNote: The Hours table was created but the link field failed.",
    );
    console.log(
      "You may need to manually add a 'Hours (Linked)' field in Clinics.",
    );
    process.exit(1);
  }

  const fieldData = await addFieldRes.json();
  console.log("✓ Added 'Hours (Linked)' field to Clinics table");
  console.log("  Field ID:", fieldData.id);

  console.log("\n=== SETUP COMPLETE ===");
  console.log("Hours table ID:", tableData.id);
  console.log("\nNext steps:");
  console.log("1. Run the hours migration script to populate data");
  console.log("2. Verify data in Airtable UI");
  console.log("3. Update fetch-airtable.js to use new Hours table");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
