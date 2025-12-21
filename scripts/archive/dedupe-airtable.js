#!/usr/bin/env node

/**
 * Deduplicate Airtable records and standardize names
 */

import fs from "fs";

const envContent = fs.readFileSync(".env", "utf-8");
const TOKEN = envContent.split("=")[1].trim();

const BASE_ID = "app2GMlVxnjw6ifzz";
const TABLE_ID = "tblx7sVpDo17Hkmmr";

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
  if (!res.ok) {
    console.error(`Failed to update ${id}:`, await res.text());
    return false;
  }
  return true;
}

async function deleteRecords(ids) {
  // Airtable allows max 10 records per delete
  for (let i = 0; i < ids.length; i += 10) {
    const batch = ids.slice(i, i + 10);
    const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`);
    batch.forEach((id) => url.searchParams.append("records[]", id));

    const res = await fetch(url, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    if (!res.ok) {
      console.error(`Failed to delete batch:`, await res.text());
      return false;
    }
  }
  return true;
}

function scoreRecord(r) {
  let score = 0;
  const f = r.fields;
  if (f.Latitude && f.Longitude) score += 10;
  if (f.Phone) score += 5;
  if (f.Borough) score += 3;
  if (f.Website) score += 2;
  if (f.Hours) score += 2;
  if (f["STI Testing"]) score += 1;
  if (f["HIV Testing"]) score += 1;
  if (f.PrEP) score += 1;
  if (f["Accepts Medicaid"]) score += 1;
  return score;
}

function normalizeAddress(addr) {
  if (!addr) return "";
  return addr
    .toLowerCase()
    .replace(/\b(avenue|ave)\b/g, "ave")
    .replace(/\b(street|st)\b/g, "st")
    .replace(/\b(boulevard|blvd)\b/g, "blvd")
    .replace(/\b(first|1st)\b/g, "1st")
    .replace(/\b(second|2nd)\b/g, "2nd")
    .replace(/\b(floor|fl)\b/g, "fl")
    .replace(/\b(extension|ext)\b/g, "ext")
    .replace(/[,\.]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function addressesMatch(addr1, addr2) {
  const n1 = normalizeAddress(addr1);
  const n2 = normalizeAddress(addr2);
  if (!n1 || !n2) return true; // If one is missing, allow merge
  // Extract street number
  const num1 = n1.match(/^(\d+)/)?.[1];
  const num2 = n2.match(/^(\d+)/)?.[1];
  // Different street numbers = different locations
  if (num1 && num2 && num1 !== num2) return false;
  return true;
}

function mergeFields(primary, secondary) {
  const merged = { ...primary.fields };
  const sec = secondary.fields;

  // Fill in missing fields from secondary
  Object.keys(sec).forEach((key) => {
    if (
      sec[key] !== null &&
      sec[key] !== undefined &&
      sec[key] !== "" &&
      (merged[key] === null || merged[key] === undefined || merged[key] === "")
    ) {
      merged[key] = sec[key];
    }
  });

  return merged;
}

// Name standardization rules
const NAME_FIXES = {
  // NYC DOH Sexual Health Clinics - add "NYC DOH -" prefix for clarity
  "Chelsea Sexual Health Clinic": "NYC DOH - Chelsea Sexual Health Clinic",
  "Chelsea Express Clinic": "NYC DOH - Chelsea Express Clinic",
  "Fort Greene Sexual Health Clinic":
    "NYC DOH - Fort Greene Sexual Health Clinic",
  "Fort Greene Express Clinic": "NYC DOH - Fort Greene Express Clinic",
  "Jamaica Sexual Health Clinic": "NYC DOH - Jamaica Sexual Health Clinic",
  "Corona Sexual Health Clinic": "NYC DOH - Corona Sexual Health Clinic",
  "Central Harlem Sexual Health Clinic":
    "NYC DOH - Central Harlem Sexual Health Clinic",
  "Morrisania Sexual Health Clinic":
    "NYC DOH - Morrisania Sexual Health Clinic",
  "Morrisania Sexual Health Clinic (NYC DOHMH)":
    "NYC DOH - Morrisania Sexual Health Clinic",

  // Planned Parenthood - standardize format
  "Planned Parenthood of Greater New York":
    "Planned Parenthood - Manhattan (Margaret Sanger Center)",
  "Planned Parenthood - Diane L. Max Health Center":
    "Planned Parenthood - Queens (Diane L. Max)",
};

// Address-based renames for disambiguation
const ADDRESS_RENAMES = {
  "439 Port Richmond Avenue":
    "Community Health Center of Richmond - Port Richmond",
  "235 Port Richmond Avenue":
    "Community Health Center of Richmond - South Avenue",
};

async function main() {
  console.log("Fetching all records...");
  const records = await fetchAll();
  console.log(`Found ${records.length} records\n`);

  // Find duplicates by normalized name
  const byName = {};
  records.forEach((r) => {
    const rawName = r.fields["Clinic Name"] || "";
    const normName = rawName.trim().toLowerCase().replace(/\s+/g, " ");
    if (!byName[normName]) byName[normName] = [];
    byName[normName].push(r);
  });

  const dupGroups = Object.entries(byName).filter(
    ([k, v]) => v.length > 1 && k,
  );

  console.log(`=== DUPLICATES TO MERGE (${dupGroups.length} groups) ===\n`);

  const toDelete = [];
  const toUpdate = [];

  for (const [normName, recs] of dupGroups) {
    // Sort by score (best first)
    recs.sort((a, b) => scoreRecord(b) - scoreRecord(a));
    const primary = recs[0];
    const duplicates = recs.slice(1);

    // Check if all addresses match (same location)
    const primaryAddr = primary.fields.Address;
    const allMatch = duplicates.every((d) =>
      addressesMatch(primaryAddr, d.fields.Address),
    );

    if (!allMatch) {
      console.log(
        `"${primary.fields["Clinic Name"]}" (${recs.length} records): DIFFERENT LOCATIONS - will disambiguate`,
      );
      recs.forEach((r) => {
        const addr = r.fields.Address || "";
        console.log(`  - ${addr || "NO ADDRESS"}`);
        // Check for address-based rename
        const addrKey = Object.keys(ADDRESS_RENAMES).find((k) =>
          addr.startsWith(k),
        );
        if (addrKey) {
          console.log(`    RENAME → "${ADDRESS_RENAMES[addrKey]}"`);
          toUpdate.push({
            id: r.id,
            fields: { "Clinic Name": ADDRESS_RENAMES[addrKey] },
          });
        } else {
          // Still apply name fixes if needed
          const origName = r.fields["Clinic Name"];
          if (NAME_FIXES[origName]) {
            toUpdate.push({
              id: r.id,
              fields: { "Clinic Name": NAME_FIXES[origName] },
            });
          }
        }
      });
      console.log("");
      continue;
    }

    console.log(`"${primary.fields["Clinic Name"]}" (${recs.length} records):`);
    console.log(`  KEEP: ${primary.id} (score: ${scoreRecord(primary)})`);

    // Merge all duplicates into primary
    let merged = primary.fields;
    for (const dup of duplicates) {
      console.log(`  DELETE: ${dup.id} (score: ${scoreRecord(dup)})`);
      merged = mergeFields({ fields: merged }, dup);
      toDelete.push(dup.id);
    }

    // Check if name needs standardization
    const origName = primary.fields["Clinic Name"];
    if (NAME_FIXES[origName]) {
      merged["Clinic Name"] = NAME_FIXES[origName];
      console.log(`  RENAME: "${origName}" → "${NAME_FIXES[origName]}"`);
    }

    toUpdate.push({ id: primary.id, fields: merged });
    console.log("");
  }

  // Also fix names for non-duplicate records
  console.log(`\n=== NAME STANDARDIZATION (non-duplicates) ===\n`);
  for (const r of records) {
    const name = r.fields["Clinic Name"];
    if (NAME_FIXES[name] && !toUpdate.find((u) => u.id === r.id)) {
      console.log(`RENAME: "${name}" → "${NAME_FIXES[name]}"`);
      toUpdate.push({
        id: r.id,
        fields: { "Clinic Name": NAME_FIXES[name] },
      });
    }
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`Records to update: ${toUpdate.length}`);
  console.log(`Records to delete: ${toDelete.length}`);

  // Dry run by default
  const dryRun = !process.argv.includes("--execute");
  if (dryRun) {
    console.log(`\nDRY RUN - no changes made. Use --execute to apply changes.`);
    return;
  }

  console.log(`\nApplying changes...`);

  // Update records
  for (const { id, fields } of toUpdate) {
    console.log(`Updating ${id}...`);
    await updateRecord(id, fields);
  }

  // Delete duplicates
  if (toDelete.length > 0) {
    console.log(`Deleting ${toDelete.length} duplicate records...`);
    await deleteRecords(toDelete);
  }

  console.log("Done!");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
