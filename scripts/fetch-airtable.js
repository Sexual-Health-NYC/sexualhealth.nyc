#!/usr/bin/env node

/**
 * Fetch clinic data from Airtable and generate GeoJSON for the map.
 *
 * Usage:
 *   node scripts/fetch-airtable.js
 *
 * Requires AIRTABLE_TOKEN in .env
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
const CLINICS_TABLE = "tblx7sVpDo17Hkmmr";
const HOURS_TABLE = "tblp2gxzk6xGeDtnI";

async function fetchAllRecords(tableId) {
  const records = [];
  let offset = null;

  do {
    const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${tableId}`);
    url.searchParams.set("pageSize", "100");
    if (offset) url.searchParams.set("offset", offset);

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });

    if (!res.ok) {
      throw new Error(`Airtable API error: ${res.status} ${await res.text()}`);
    }

    const data = await res.json();
    records.push(...data.records);
    offset = data.offset;
  } while (offset);

  return records;
}

function formatHours(clinicId, hoursMap) {
  const hoursRecords = hoursMap.get(clinicId) || [];
  if (hoursRecords.length === 0) return [];

  return hoursRecords.map((h) => ({
    department: h.Department || "General",
    days: h["Days of Week"] || [],
    open: h["Open Time"] || "",
    close: h["Close Time"] || "",
    allDay: h["All Day"] || false,
    notes: h.Notes || "",
  }));
}

// Known Medicaid MCOs in NYC
const MEDICAID_MCOS = [
  "Healthfirst",
  "MetroPlus",
  "Fidelis Care",
  "UHC", // UnitedHealthcare
  "Emblem Health",
  "Wellcare",
  "Molina",
  "Affinity",
  "Amerigroup",
  "Healthplus",
];

function extractMedicaidInfo(insurancePlans) {
  if (
    !insurancePlans ||
    !Array.isArray(insurancePlans) ||
    insurancePlans.length === 0
  ) {
    return { medicaid_mcos: [], medicaid_type: null };
  }

  const mcos = [];
  let hasStraightMedicaid = false;

  for (const plan of insurancePlans) {
    const planLower = plan.toLowerCase();

    // Check for straight Medicaid
    if (
      planLower === "medicaid" ||
      planLower === "medicaid family planning" ||
      planLower === "medicaid for pregnant women" ||
      planLower === "nys emergency medicaid"
    ) {
      hasStraightMedicaid = true;
    }

    // Check for MCO-specific Medicaid plans
    for (const mco of MEDICAID_MCOS) {
      if (
        planLower.includes(mco.toLowerCase()) &&
        planLower.includes("medicaid")
      ) {
        if (!mcos.includes(mco)) {
          mcos.push(mco);
        }
      }
    }
  }

  let medicaidType = null;
  if (hasStraightMedicaid && mcos.length > 0) {
    medicaidType = "both";
  } else if (hasStraightMedicaid) {
    medicaidType = "straight";
  } else if (mcos.length > 0) {
    medicaidType = "managed";
  }

  return { medicaid_mcos: mcos, medicaid_type: medicaidType };
}

function recordToVirtualClinic(record) {
  const f = record.fields;

  // Only include virtual clinics
  if (!f["Is Virtual"]) {
    return null;
  }

  return {
    id: record.id,
    name: f["Clinic Name"] || "",
    phone: f.Phone || "",
    website: f.Website || "",
    email: f["Public Email"] || "",

    // Services - Abortion
    has_abortion: f.Abortion || false,
    medication_abortion: f["Medication Abortion"] || false,
    abortion_medication_max_weeks: f["Abortion Medication Max Weeks"] || null,

    // Services - General
    has_contraception: f.Contraception || false,
    has_prep: f.PrEP || false,
    has_sti_testing: f["STI Testing"] || false,

    // Services - Gender Affirming Care
    has_gender_affirming: f["Gender-Affirming Care"] || false,
    gender_affirming_hormones: f["Gender Affirming Hormones"] || false,
    gender_affirming_informed_consent: f["Informed Consent HRT"] || false,

    // Insurance
    accepts_medicaid: f["Accepts Medicaid"] || false,
    sliding_scale: f["Sliding Scale"] || false,
    no_insurance_ok: f["No Insurance OK"] || false,

    // Populations
    lgbtq_focused: f["LGBTQ+ Focused"] || false,

    // Metadata
    data_sources: f["Data Sources"] || "",
  };
}

function recordToFeature(record, hoursMap) {
  const f = record.fields;

  // Skip virtual clinics (no physical location) and records without coordinates
  if (f["Is Virtual"] || !f.Latitude || !f.Longitude) {
    return null;
  }

  const insurancePlans = f["Insurance Plans Accepted"] || [];
  const { medicaid_mcos, medicaid_type } = extractMedicaidInfo(insurancePlans);

  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [f.Longitude, f.Latitude],
    },
    properties: {
      id: record.id,
      name: f["Clinic Name"] || "",
      address: f.Address || "",
      borough: f.Borough || "",
      phone: f.Phone || "",
      website: f.Website || "",
      hours: formatHours(record.id, hoursMap),

      // Organization
      organization: f.Organization || "",
      clinic_type: f["Clinic Type"] || "",

      // Services (booleans)
      has_sti_testing: f["STI Testing"] || false,
      has_hiv_testing: f["HIV Testing"] || false,
      has_prep: f.PrEP || false,
      has_pep: f.PEP || false,
      prep_ap_registered: f["PrEP-AP Registered"] || false,
      has_contraception: f.Contraception || false,
      has_abortion: f.Abortion || false,
      has_gender_affirming: f["Gender-Affirming Care"] || false,
      has_vaccines: f.Vaccines || false,

      // Gender Affirming Details
      gender_affirming_youth: f["Gender Affirming Care (Youth)"] || false,
      gender_affirming_hormones: f["Gender Affirming Hormones"] || false,
      gender_affirming_surgery: f["Gender Affirming Surgery"] || false,
      gender_affirming_youth_policy: f["Gender Affirming Youth Policy"] || "",
      // Granular GAC procedures (from Amida GIST directory)
      gender_affirming_ffs: f["Gender Affirming FFS"] || false, // Facial feminization
      gender_affirming_fms: f["Gender Affirming FMS"] || false, // Facial masculinization
      gender_affirming_voice: f["Gender Affirming Voice"] || false, // Speech therapy/voice modification
      gender_affirming_electrolysis:
        f["Gender Affirming Electrolysis"] || false,
      gender_affirming_laser: f["Gender Affirming Laser"] || false,
      gender_affirming_top_surgery: f["Gender Affirming Top Surgery"] || false,
      gender_affirming_bottom_surgery:
        f["Gender Affirming Bottom Surgery"] || false,
      gender_affirming_informed_consent: f["Informed Consent HRT"] || false,

      // Service subtypes
      medication_abortion: f["Medication Abortion"] || false,
      in_clinic_abortion: f["In-Clinic Abortion"] || false,
      abortion_medication_limit: f["Abortion: Medication (limit)"] || "",
      abortion_procedure_limit: f["Abortion: Procedure (limit)"] || "",
      abortion_medication_max_weeks: f["Abortion Medication Max Weeks"] || null,
      abortion_procedure_max_weeks: f["Abortion Procedure Max Weeks"] || null,
      offers_late_term: f["Offers Late-Term (20+ weeks)"] || false,

      // Insurance
      accepts_medicaid: f["Accepts Medicaid"] || false,
      accepts_medicare: f["Accepts Medicare"] || false,
      sliding_scale: f["Sliding Scale"] || false,
      no_insurance_ok: f["No Insurance OK"] || false,
      insurance_plans: insurancePlans,
      medicaid_mcos: medicaid_mcos,
      medicaid_type: medicaid_type,

      // Access
      walk_in: f["Walk-ins OK"] || false,
      appointment_only: f["Appointment Only"] || false,
      express_testing: f["Express Testing Available"] || false,

      // Special populations
      lgbtq_focused: f["LGBTQ+ Focused"] || false,
      youth_friendly: f["Youth Friendly"] || false,
      anonymous_testing: f["Anonymous Testing"] || false,

      // Transit
      transit: f["Nearest Subway"] || "",
      bus: f["Nearest Bus"] || "",

      // Metadata
      last_verified: f["Last Verified"] || "",
      data_sources: f["Data Sources"] || "",

      // Virtual/telehealth
      is_virtual: f["Is Virtual"] || false,
    },
  };
}

async function main() {
  console.log("Fetching clinics from Airtable...");
  const clinics = await fetchAllRecords(CLINICS_TABLE);
  console.log(`Fetched ${clinics.length} clinics`);

  console.log("Fetching hours from Airtable...");
  const hoursRecords = await fetchAllRecords(HOURS_TABLE);
  console.log(`Fetched ${hoursRecords.length} hours records`);

  // Build a map of clinicId -> hours records
  const hoursMap = new Map();
  for (const hr of hoursRecords) {
    const clinicLinks = hr.fields.Clinic || [];
    for (const clinicId of clinicLinks) {
      if (!hoursMap.has(clinicId)) {
        hoursMap.set(clinicId, []);
      }
      hoursMap.get(clinicId).push(hr.fields);
    }
  }

  const features = clinics
    .map((r) => recordToFeature(r, hoursMap))
    .filter((f) => f !== null);

  const virtualClinics = clinics
    .map((r) => recordToVirtualClinic(r))
    .filter((v) => v !== null);

  console.log(`${features.length} physical clinics with coordinates`);
  console.log(`${virtualClinics.length} virtual/telehealth clinics`);

  const geojson = {
    type: "FeatureCollection",
    features,
    metadata: {
      generated: new Date().toISOString(),
      source: "Airtable",
      total_records: clinics.length,
      records_with_coords: features.length,
    },
  };

  const outputPath = path.join(rootDir, "public", "clinics.geojson");
  fs.writeFileSync(outputPath, JSON.stringify(geojson, null, 2));
  console.log(`Wrote ${outputPath}`);

  // Write virtual clinics to separate JSON file
  const virtualOutput = {
    clinics: virtualClinics,
    metadata: {
      generated: new Date().toISOString(),
      source: "Airtable",
      count: virtualClinics.length,
    },
  };
  const virtualPath = path.join(rootDir, "public", "virtual-clinics.json");
  fs.writeFileSync(virtualPath, JSON.stringify(virtualOutput, null, 2));
  console.log(`Wrote ${virtualPath}`);

  // Summary
  const withAbortion = features.filter((f) => f.properties.has_abortion).length;
  const withLateTerm = features.filter(
    (f) => f.properties.offers_late_term,
  ).length;
  const withPrep = features.filter((f) => f.properties.has_prep).length;
  const withMedicaid = features.filter(
    (f) => f.properties.accepts_medicaid,
  ).length;

  console.log("\nSummary:");
  console.log(`  Abortion services: ${withAbortion}`);
  console.log(`  Late-term (20+ weeks): ${withLateTerm}`);
  console.log(`  PrEP services: ${withPrep}`);
  console.log(`  Accepts Medicaid: ${withMedicaid}`);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
