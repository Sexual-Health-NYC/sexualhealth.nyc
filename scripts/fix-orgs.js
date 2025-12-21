#!/usr/bin/env node

import fs from "fs";

const TOKEN = fs.readFileSync(".env", "utf-8").split("=")[1].trim();
const BASE_ID = "app2GMlVxnjw6ifzz";
const TABLE_ID = "tblx7sVpDo17Hkmmr";

// Rules for assigning organizations based on clinic name patterns
const ORG_RULES = [
  {
    pattern: /NYC DOH|Sexual Health Clinic|Express Clinic/i,
    org: "NYC Health Dept (DOH)",
    type: "DOH",
  },
  { pattern: /Housing Works/i, org: "Housing Works", type: "FQHC" },
  { pattern: /Callen-Lorde/i, org: "Callen-Lorde", type: "LGBTQ+ Center" },
  {
    pattern: /Planned Parenthood/i,
    org: "Planned Parenthood",
    type: "Planned Parenthood",
  },
  {
    pattern: /^CHN |Community Healthcare Network/i,
    org: "Community Healthcare Network",
    type: "FQHC",
  },
  {
    pattern: /NYC Health \+ Hospitals|H\+H|Gotham Health/i,
    org: "NYC Health + Hospitals",
    type: "Hospital",
  },
  { pattern: /Mount Sinai/i, org: "Mount Sinai", type: "Hospital" },
  { pattern: /GMHC/i, org: "GMHC", type: "LGBTQ+ Center" },
  { pattern: /Apicha/i, org: "Apicha", type: "FQHC" },
  { pattern: /The Door/i, org: "The Door", type: "FQHC" },
  {
    pattern: /Destination Tomorrow/i,
    org: "Destination Tomorrow",
    type: "LGBTQ+ Center",
  },
  {
    pattern: /Community Health Action|CHASI/i,
    org: "Community Health Action of Staten Island",
    type: "FQHC",
  },
  {
    pattern: /Community Health Center of Richmond/i,
    org: "Community Health Center of Richmond",
    type: "FQHC",
  },
  {
    pattern: /Institute for Family Health/i,
    org: "Institute for Family Health",
    type: "FQHC",
  },
  { pattern: /Bellevue/i, org: "NYC Health + Hospitals", type: "Hospital" },
];

// Borough detection from address
function detectBorough(address) {
  if (!address) return null;
  const addr = address.toLowerCase();
  if (addr.includes("bronx") || addr.includes(", ny 104")) return "Bronx";
  if (addr.includes("brooklyn") || addr.includes(", ny 112")) return "Brooklyn";
  if (
    addr.includes("queens") ||
    addr.includes("jamaica") ||
    addr.includes("jackson heights") ||
    addr.includes("long island city") ||
    addr.includes("kew gardens") ||
    addr.includes(", ny 113") ||
    addr.includes(", ny 114") ||
    addr.includes(", ny 116")
  )
    return "Queens";
  if (addr.includes("staten island") || addr.includes(", ny 103"))
    return "Staten Island";
  if (
    addr.includes("manhattan") ||
    addr.includes("new york, ny 100") ||
    addr.includes("new york, ny 101") ||
    addr.includes(", ny 100") ||
    addr.includes(", ny 101")
  )
    return "Manhattan";
  return null;
}

async function fetchAll() {
  const records = [];
  let offset = null;
  do {
    const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`);
    url.searchParams.set("pageSize", "100");
    if (offset) url.searchParams.set("offset", offset);
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    const data = await res.json();
    records.push(...data.records);
    offset = data.offset;
  } while (offset);
  return records;
}

async function updateRecord(id, fields) {
  const res = await fetch(
    `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}/${id}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields }),
    },
  );
  return res.ok;
}

async function main() {
  console.log("Fetching all records...");
  const records = await fetchAll();
  console.log(`Found ${records.length} records\n`);

  const updates = [];

  for (const r of records) {
    const name = r.fields["Clinic Name"] || "";
    const currentOrg = r.fields.Organization;
    const currentType = r.fields["Clinic Type"];
    const currentBorough = r.fields.Borough;
    const address = r.fields.Address || "";

    const fieldsToUpdate = {};

    // Check org rules
    if (!currentOrg) {
      for (const rule of ORG_RULES) {
        if (rule.pattern.test(name)) {
          fieldsToUpdate.Organization = rule.org;
          if (!currentType) {
            fieldsToUpdate["Clinic Type"] = rule.type;
          }
          break;
        }
      }
    }

    // Check borough
    if (!currentBorough) {
      const detectedBorough = detectBorough(address);
      if (detectedBorough) {
        fieldsToUpdate.Borough = detectedBorough;
      }
    }

    if (Object.keys(fieldsToUpdate).length > 0) {
      updates.push({ id: r.id, name, fields: fieldsToUpdate });
    }
  }

  console.log(`=== UPDATES TO APPLY (${updates.length}) ===\n`);
  updates.forEach((u) => {
    console.log(`${u.name}:`);
    Object.entries(u.fields).forEach(([k, v]) => console.log(`  ${k}: ${v}`));
  });

  const dryRun = !process.argv.includes("--execute");
  if (dryRun) {
    console.log("\nDRY RUN - use --execute to apply changes");
    return;
  }

  console.log("\nApplying changes...");
  for (const u of updates) {
    const ok = await updateRecord(u.id, u.fields);
    console.log(`${ok ? "✓" : "✗"} ${u.name}`);
  }
  console.log("Done!");
}

main();
