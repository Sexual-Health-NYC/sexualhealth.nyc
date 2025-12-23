#!/usr/bin/env node
/**
 * Add missing website URLs to clinics in Airtable
 * Found via BrightData SERP searches
 * Run with: node scripts/add-websites.js [--execute]
 */

const TOKEN = process.env.AIRTABLE_TOKEN;
const BASE_ID = "app2GMlVxnjw6ifzz";
const CLINICS_TABLE = "tblx7sVpDo17Hkmmr";

const DRY_RUN = !process.argv.includes("--execute");

// Mapping of clinic names to website URLs (found via search)
const WEBSITE_UPDATES = {
  // From first batch of searches
  "NYC Health + Hospitals / Harlem":
    "https://www.nychealthandhospitals.org/harlem/",
  "Morris Heights Health Center": "https://www.mhhc.org/",
  "Settlement Health": "https://www.settlementhealth.org/",
  "Damian Firehouse Health Center": "http://www.damian.org/",
  "William F. Ryan Community Health Center": "https://ryanhealth.org/",
  "Boriken Neighborhood Health Center - East Harlem Council for Human Services":
    "https://www.boriken.org/",
  "Henry Street Settlement Health Unlimited Family Medical Center":
    "https://www.henrystreet.org/contacts/health-unlimited-family-medical-center/",

  // From second batch
  "The Spencer Cox Center":
    "https://www.mountsinai.org/care/infectious-diseases/services/hiv-aids",
  "Pierre Toussaint Family Health Center":
    "https://onebrooklynhealth.org/services/pierre-toussaint",
  "Bedford-Stuyvesant Family Health Center": "https://www.bsfhc.org/",
  "Gouverneur Healthcare Services":
    "https://www.nychealthandhospitals.org/gouverneur/",
  "Harlem United": "https://www.harlemunited.org/",
  "Brookdale Family Care Center":
    "https://onebrooklynhealth.org/services/bfcc-linden",
  "Judson Community Health Center":
    "https://www.nychealthandhospitals.org/locations/judson/",
  "Comprehensive Health Program New York Presbyterian Hospital":
    "https://www.nyp.org/",
  "Weill Cornell Medical Associates": "https://weillcornell.org/",
  "Wyckoff Hospital": "https://www.wyckoffhospital.org/",

  // From third batch
  "Coney Island Hospital":
    "https://www.nychealthandhospitals.org/southbrooklynhealth/",
  "The Young Men's Clinic":
    "https://www.nyp.org/acn/primary-care/young-mens-clinic",
  "Adolescent AIDS Program, Children's Hospital at Montefiore":
    "https://www.cham.org/specialties-and-programs/adolescent-medicine/",
  "Community Healthcare Network": "https://www.chnnyc.org/",

  // Additional clinics with known websites
  "NYC Health + Hospitals/North Central Bronx":
    "https://www.nychealthandhospitals.org/northcentralbronx/",
  "Bronx-Lebanon Hospital Center for Comprehensive Care":
    "https://www.bronxcare.org/",
  "Mount Sinai Beth Israel":
    "https://www.mountsinai.org/locations/union-square",
  "Mount Sinai Beth Israel Peter Krueger Clinic":
    "https://www.mountsinai.org/patient-care/iam/the-peter-krueger-clinic",
  "New York Presbyterian Hospital - Center for Special Studies":
    "https://www.nyp.org/acn/primary-care/center-for-special-studies-david-rogers",
  "Montefiore Medical Center - Comprehensive Health Care Center":
    "https://www.montefiore.org/",
  "Montefiore Medical Center - Comprehensive Family Care Center":
    "https://www.montefiore.org/",
  "Montefiore Center for Positive Living/I.D. Clinic":
    "https://www.montefiore.org/patient-care/services/hiv-aids",
  "Montefiore On Point": "https://www.montefiore.org/",
};

async function fetchAllClinics() {
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

    if (!res.ok) {
      throw new Error(`Airtable API error: ${res.status} ${await res.text()}`);
    }

    const data = await res.json();
    records.push(...data.records);
    offset = data.offset;
  } while (offset);

  return records;
}

async function updateClinicWebsite(recordId, website) {
  if (DRY_RUN) {
    return true;
  }

  const res = await fetch(
    `https://api.airtable.com/v0/${BASE_ID}/${CLINICS_TABLE}/${recordId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          Website: website,
        },
      }),
    },
  );

  if (!res.ok) {
    throw new Error(`Update error: ${res.status} ${await res.text()}`);
  }
  return true;
}

async function main() {
  if (DRY_RUN) {
    console.log("=== DRY RUN ===\n");
  } else {
    console.log("=== EXECUTE MODE ===\n");
  }

  const clinics = await fetchAllClinics();
  console.log(`Fetched ${clinics.length} clinics from Airtable\n`);

  let matched = 0;
  let updated = 0;

  for (const [clinicName, website] of Object.entries(WEBSITE_UPDATES)) {
    const clinic = clinics.find(
      (c) =>
        c.fields["Clinic Name"] === clinicName ||
        c.fields["Clinic Name"]?.toLowerCase() === clinicName.toLowerCase(),
    );

    if (!clinic) {
      console.log(`NOT FOUND: ${clinicName}`);
      continue;
    }

    matched++;

    // Skip if already has a website
    if (clinic.fields.Website) {
      console.log(`SKIP (has website): ${clinicName}`);
      continue;
    }

    if (DRY_RUN) {
      console.log(`Would update: ${clinicName}`);
      console.log(`  Website: ${website}`);
    } else {
      await updateClinicWebsite(clinic.id, website);
      console.log(`Updated: ${clinicName}`);
      console.log(`  Website: ${website}`);
      updated++;
    }
  }

  console.log("\n=== Summary ===");
  console.log(`Matched: ${matched} clinics`);
  console.log(`Updated: ${updated} clinics`);

  if (DRY_RUN) {
    console.log("\nThis was a dry run. Use --execute to apply changes.");
  } else {
    console.log("\nRun `npm run fetch-data` to regenerate GeoJSON.");
  }
}

main().catch(console.error);
