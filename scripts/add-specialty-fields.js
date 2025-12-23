#!/usr/bin/env node

import fs from "fs";

const TOKEN = fs.readFileSync(".env", "utf-8").split("=")[1].trim();
const BASE_ID = "app2GMlVxnjw6ifzz";
const CLINICS_TABLE_ID = "tblx7sVpDo17Hkmmr";

// Define the specialty GAC checkbox fields to add
const fieldsToAdd = [
  {
    name: "Gender Affirming Electrolysis",
    type: "checkbox",
    description: "Provides electrolysis hair removal services",
    options: {
      icon: "check",
      color: "greenBright",
    },
  },
  {
    name: "Gender Affirming Laser",
    type: "checkbox",
    description: "Provides laser hair removal services",
    options: {
      icon: "check",
      color: "greenBright",
    },
  },
  {
    name: "Gender Affirming Voice",
    type: "checkbox",
    description: "Provides voice therapy/modification services",
    options: {
      icon: "check",
      color: "greenBright",
    },
  },
  {
    name: "Gender Affirming FFS",
    type: "checkbox",
    description: "Provides facial feminization surgery",
    options: {
      icon: "check",
      color: "greenBright",
    },
  },
  {
    name: "Gender Affirming FMS",
    type: "checkbox",
    description: "Provides facial masculinization surgery",
    options: {
      icon: "check",
      color: "greenBright",
    },
  },
  {
    name: "Gender Affirming Top Surgery",
    type: "checkbox",
    description:
      "Provides top surgery (chest masculinization/breast augmentation)",
    options: {
      icon: "check",
      color: "greenBright",
    },
  },
  {
    name: "Gender Affirming Bottom Surgery",
    type: "checkbox",
    description:
      "Provides bottom surgery (vaginoplasty/phalloplasty/metoidioplasty)",
    options: {
      icon: "check",
      color: "greenBright",
    },
  },
  {
    name: "Informed Consent HRT",
    type: "checkbox",
    description:
      "Provides hormone replacement therapy without requiring therapy letters",
    options: {
      icon: "check",
      color: "greenBright",
    },
  },
];

async function addField(field) {
  console.log(`\nAdding field: ${field.name}`);

  const res = await fetch(
    `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables/${CLINICS_TABLE_ID}/fields`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(field),
    },
  );

  if (!res.ok) {
    const err = await res.json();
    console.error(`  ❌ Failed: ${err.error?.type || "Unknown error"}`);
    console.error(`     ${err.error?.message || JSON.stringify(err)}`);
    return false;
  }

  const data = await res.json();
  console.log(`  ✅ Added (ID: ${data.id})`);
  return true;
}

async function main() {
  console.log("Adding specialty GAC checkbox fields to Clinics table...\n");
  console.log(`Base ID: ${BASE_ID}`);
  console.log(`Table ID: ${CLINICS_TABLE_ID}`);

  let added = 0;
  for (const field of fieldsToAdd) {
    if (await addField(field)) {
      added++;
    }
    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  console.log(`\n=== COMPLETE ===`);
  console.log(`Successfully added ${added}/${fieldsToAdd.length} fields`);

  if (added === fieldsToAdd.length) {
    console.log("\nNext steps:");
    console.log("1. Run: python3 pipeline/update_specialty_providers.py");
    console.log("2. Run: npm run fetch-data");
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
