#!/usr/bin/env node

/**
 * Geocode clinics missing coordinates using NYC Planning Labs GeoSearch API.
 * Also adds BBL (Borough-Block-Lot) field for deduplication.
 *
 * Usage:
 *   node scripts/geocode-missing.js          # Dry run
 *   node scripts/geocode-missing.js --execute # Actually update Airtable
 */

import fs from "fs";

const TOKEN = fs.readFileSync(".env", "utf-8").split("=")[1].trim();
const BASE_ID = "app2GMlVxnjw6ifzz";
const CLINICS_TABLE = "tblx7sVpDo17Hkmmr";

const EXECUTE = process.argv.includes("--execute");

// NYC Planning Labs GeoSearch - free, no API key needed
async function geocodeNYC(address) {
  const url = new URL("https://geosearch.planninglabs.nyc/v2/search");
  url.searchParams.set("text", address);
  url.searchParams.set("size", "1");

  const res = await fetch(url);
  if (!res.ok) {
    console.error(`  Geocoder error: ${res.status}`);
    return null;
  }

  const data = await res.json();
  if (!data.features || data.features.length === 0) {
    return null;
  }

  const feature = data.features[0];
  const props = feature.properties;
  const coords = feature.geometry.coordinates;

  // BBL is nested in addendum.pad.bbl
  const bbl = props.addendum?.pad?.bbl || null;

  return {
    latitude: coords[1],
    longitude: coords[0],
    bbl,
    cleanAddress: props.label || null,
  };
}

async function ensureBBLField() {
  // Check if BBL field exists
  const res = await fetch(
    `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables`,
    {
      headers: { Authorization: `Bearer ${TOKEN}` },
    },
  );
  const data = await res.json();
  const clinicsTable = data.tables.find((t) => t.id === CLINICS_TABLE);
  const hasBBL = clinicsTable.fields.some((f) => f.name === "BBL");

  if (hasBBL) {
    console.log("BBL field already exists");
    return;
  }

  if (!EXECUTE) {
    console.log("Would create BBL field (use --execute to create)");
    return;
  }

  console.log("Creating BBL field...");
  const createRes = await fetch(
    `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables/${CLINICS_TABLE}/fields`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "BBL",
        type: "singleLineText",
        description:
          "Borough-Block-Lot - NYC unique property ID from geocoder. Used for deduplication.",
      }),
    },
  );

  if (!createRes.ok) {
    console.error(`Failed to create BBL field: ${await createRes.text()}`);
  } else {
    console.log("BBL field created");
  }
}

async function fetchAllRecords() {
  const records = [];
  let offset = null;

  do {
    const url = new URL(
      `https://api.airtable.com/v0/${BASE_ID}/${CLINICS_TABLE}`,
    );
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

async function fetchMissingBBL() {
  const all = await fetchAllRecords();
  // Return clinics missing BBL (regardless of whether they have coords)
  return all.filter((r) => !r.fields.BBL);
}

async function updateClinic(recordId, fields) {
  const res = await fetch(
    `https://api.airtable.com/v0/${BASE_ID}/${CLINICS_TABLE}/${recordId}`,
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
    console.error(`  Update failed: ${await res.text()}`);
    return false;
  }
  return true;
}

async function main() {
  console.log(EXECUTE ? "=== EXECUTE MODE ===" : "=== DRY RUN ===\n");

  // Step 1: Ensure BBL field exists
  await ensureBBLField();

  // Step 2: Fetch clinics without BBL
  const missing = await fetchMissingBBL();
  console.log(`\nFound ${missing.length} clinics without BBL:\n`);

  for (const clinic of missing) {
    const name = clinic.fields["Clinic Name"];
    const address = clinic.fields.Address;

    console.log(`${name}`);
    console.log(`  Address: ${address}`);

    if (!address || address.includes("CLOSED")) {
      console.log(`  SKIP - no valid address\n`);
      continue;
    }

    // Build full address with borough
    const borough = clinic.fields.Borough || "";
    const fullAddress = borough
      ? `${address}, ${borough}, NY`
      : `${address}, New York, NY`;

    console.log(`  Querying: ${fullAddress}`);

    const result = await geocodeNYC(fullAddress);

    if (!result) {
      console.log(`  NOT FOUND\n`);
      continue;
    }

    console.log(`  Found: ${result.cleanAddress}`);
    console.log(`  Lat/Lon: ${result.latitude}, ${result.longitude}`);
    console.log(`  BBL: ${result.bbl || "N/A"}`);

    if (EXECUTE) {
      const fields = {
        Latitude: result.latitude,
        Longitude: result.longitude,
      };
      if (result.bbl) {
        fields.BBL = result.bbl;
      }

      const success = await updateClinic(clinic.id, fields);
      console.log(success ? "  UPDATED" : "  UPDATE FAILED");
    } else {
      console.log("  (dry run - not updating)");
    }
    console.log("");
  }
}

main().catch(console.error);
