#!/usr/bin/env node

/**
 * Find hours records with no linked clinic (orphans from deleted clinics)
 *
 * Usage:
 *   node scripts/find-orphan-hours.js          # dry run - list orphans
 *   node scripts/find-orphan-hours.js --delete # actually delete them
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
const HOURS_TABLE_ID = "tblp2gxzk6xGeDtnI";
const DELETE = process.argv.includes("--delete");

async function airtableFetch(endpoint, options = {}) {
  const url = `https://api.airtable.com/v0/${BASE_ID}/${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Airtable error ${res.status}: ${text}`);
  }
  return res.json();
}

async function main() {
  console.log(DELETE ? "=== DELETE MODE ===" : "=== DRY RUN ===\n");

  // Fetch all hours records
  let allRecords = [];
  let offset = null;

  do {
    const params = new URLSearchParams();
    if (offset) params.set("offset", offset);

    const data = await airtableFetch(`${HOURS_TABLE_ID}?${params}`);
    allRecords = allRecords.concat(data.records);
    offset = data.offset;
  } while (offset);

  console.log(`Fetched ${allRecords.length} hours records\n`);

  // Find orphans (no Clinic linked)
  const orphans = allRecords.filter((r) => {
    const clinicIds = r.fields.Clinic || [];
    return clinicIds.length === 0;
  });

  if (orphans.length === 0) {
    console.log("No orphan records found!");
    return;
  }

  console.log(`Found ${orphans.length} orphan hours records:\n`);

  for (const record of orphans) {
    const f = record.fields;
    const days = f["Days of Week"]?.join(", ") || "?";
    const times = `${f["Open Time"] || "?"} - ${f["Close Time"] || "?"}`;
    const dept = f.Department || "";
    console.log(`  ${record.id}: ${days} ${times} ${dept ? `(${dept})` : ""}`);
  }

  if (!DELETE) {
    console.log(
      `\nRun with --delete to remove ${orphans.length} orphan records`,
    );
    return;
  }

  // Delete in batches of 10
  console.log(`\nDeleting ${orphans.length} orphan records...`);

  for (let i = 0; i < orphans.length; i += 10) {
    const batch = orphans.slice(i, i + 10);
    const ids = batch.map((r) => `records[]=${r.id}`).join("&");
    await airtableFetch(`${HOURS_TABLE_ID}?${ids}`, {
      method: "DELETE",
    });
    console.log(
      `  Deleted ${Math.min(i + 10, orphans.length)}/${orphans.length}`,
    );
  }

  console.log("\nDone!");
}

main().catch(console.error);
