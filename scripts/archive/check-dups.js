#!/usr/bin/env node

import fs from "fs";

const envContent = fs.readFileSync(".env", "utf-8");
const envVars = {};
envContent.split("\n").forEach((line) => {
  const idx = line.indexOf("=");
  if (idx > 0) {
    envVars[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
});
const TOKEN = envVars.AIRTABLE_TOKEN;

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

const records = await fetchAll();
console.log(`Total records: ${records.length}\n`);

// Check for duplicate names
const byName = {};
records.forEach((r) => {
  const name = (r.fields["Clinic Name"] || "").trim().toLowerCase();
  if (!byName[name]) byName[name] = [];
  byName[name].push(r);
});

const dupNames = Object.entries(byName).filter(([k, v]) => v.length > 1 && k);
console.log(`=== DUPLICATE NAMES (${dupNames.length}) ===`);
dupNames.forEach(([name, recs]) => {
  console.log(`\n"${recs[0].fields["Clinic Name"]}" (${recs.length}x):`);
  recs.forEach((r) => {
    const addr = r.fields.Address || "NO ADDRESS";
    const borough = r.fields.Borough || "?";
    const hasCoords = r.fields.Latitude ? "✓" : "✗";
    const phone = r.fields.Phone || "no phone";
    console.log(
      `  [${r.id}] ${addr.substring(0, 45)}... [${borough}] coords:${hasCoords} ${phone}`,
    );
  });
});

// Check for duplicate addresses
const byAddr = {};
records.forEach((r) => {
  const addr = (r.fields.Address || "")
    .trim()
    .toLowerCase()
    .replace(/[,\.]/g, "");
  if (addr && addr.length > 10) {
    if (!byAddr[addr]) byAddr[addr] = [];
    byAddr[addr].push(r);
  }
});

const dupAddrs = Object.entries(byAddr).filter(([k, v]) => v.length > 1);
console.log(`\n\n=== DUPLICATE ADDRESSES (${dupAddrs.length}) ===`);
dupAddrs.forEach(([addr, recs]) => {
  console.log(`\n"${recs[0].fields.Address}":`);
  recs.forEach((r) => {
    const name = r.fields["Clinic Name"] || "NO NAME";
    console.log(`  [${r.id}] ${name}`);
  });
});

// Summary
console.log(`\n\n=== SUMMARY ===`);
console.log(`Total records: ${records.length}`);
console.log(`Duplicate name groups: ${dupNames.length}`);
console.log(`Duplicate address groups: ${dupAddrs.length}`);

// Group by organization to see naming patterns
console.log(`\n\n=== MULTI-LOCATION ORGS ===`);
const byOrg = {};
records.forEach((r) => {
  const org = r.fields.Organization || "No Org";
  const name = r.fields["Clinic Name"] || "NO NAME";
  const borough = r.fields.Borough || "?";
  if (!byOrg[org]) byOrg[org] = [];
  byOrg[org].push({ name, borough });
});

Object.entries(byOrg)
  .filter(([org, locs]) => locs.length > 1)
  .sort((a, b) => b[1].length - a[1].length)
  .forEach(([org, locs]) => {
    console.log(`\n${org} (${locs.length} locations):`);
    locs.forEach((l) => console.log(`  - ${l.name} [${l.borough}]`));
  });
