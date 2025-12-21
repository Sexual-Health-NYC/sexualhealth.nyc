#!/usr/bin/env node

/**
 * Import Gemini Round 2 research data into Airtable
 */

import fs from "fs";

const TOKEN = fs.readFileSync(".env", "utf-8").split("=")[1].trim();
const BASE_ID = "app2GMlVxnjw6ifzz";
const TABLE_ID = "tblx7sVpDo17Hkmmr";

// New clinics to create
const NEW_CLINICS = [
  {
    "Clinic Name": "NYC Health + Hospitals/Kings County",
    Address: "451 Clarkson Avenue, E-Building, Brooklyn, NY 11203",
    Borough: "Brooklyn",
    Phone: "(718) 245-3131",
    Website: "https://www.nychealthandhospitals.org/kings-county/",
    Latitude: 40.6564,
    Longitude: -73.9442,
    Organization: "NYC Health + Hospitals",
    "Clinic Type": "Hospital",
    "STI Testing": true,
    "HIV Testing": true,
    PrEP: true,
    PEP: true,
    Contraception: true,
    Abortion: true,
    "Gender-Affirming Care": true,
    Vaccines: true,
    "Accepts Medicaid": true,
    "Accepts Medicare": true,
    "Sliding Scale": true,
    "No Insurance OK": true,
    "Walk-ins OK": true,
    "LGBTQ+ Focused": true,
    "Youth Friendly": true,
    Hours:
      "Adult Medicine: Mon-Thu 8am-8pm, Fri 8am-6pm, Sat 8am-4pm; STD Clinic: Tue & Fri 1pm-4pm, Wed 9am-12pm",
    "Abortion Medication Max Weeks": 11,
    "Abortion Procedure Max Weeks": 24,
    "Offers Late-Term (20+ weeks)": true,
  },
  {
    "Clinic Name": "NYC Health + Hospitals/Elmhurst",
    Address: "79-01 Broadway, Elmhurst, NY 11373",
    Borough: "Queens",
    Phone: "(718) 334-4000",
    Website: "https://www.nychealthandhospitals.org/elmhurst/",
    Latitude: 40.7454,
    Longitude: -73.8856,
    Organization: "NYC Health + Hospitals",
    "Clinic Type": "Hospital",
    "STI Testing": true,
    "HIV Testing": true,
    PrEP: true,
    PEP: true,
    Contraception: true,
    Abortion: true,
    "Gender-Affirming Care": true,
    Vaccines: true,
    "Accepts Medicaid": true,
    "Accepts Medicare": true,
    "Sliding Scale": true,
    "No Insurance OK": true,
    "Walk-ins OK": true,
    "LGBTQ+ Focused": true,
    "Youth Friendly": true,
    Hours:
      "Infectious Disease (Pride): Mon/Tue/Thu/Fri 8am-5pm, Wed 8am-6pm; Women's Health: Mon-Fri 8am-5pm; Abortion: Thu & Fri",
    "Abortion Medication Max Weeks": 11,
    "Abortion Procedure Max Weeks": 24,
    "Offers Late-Term (20+ weeks)": true,
  },
  {
    "Clinic Name": "NYC Health + Hospitals/Queens",
    Address: "82-68 164th Street, Jamaica, NY 11432",
    Borough: "Queens",
    Phone: "(718) 883-3244",
    Website: "https://www.nychealthandhospitals.org/queens/",
    Latitude: 40.7163,
    Longitude: -73.8044,
    Organization: "NYC Health + Hospitals",
    "Clinic Type": "Hospital",
    "STI Testing": true,
    "HIV Testing": true,
    PrEP: true,
    PEP: true,
    Contraception: true,
    Abortion: true,
    "Gender-Affirming Care": true,
    Vaccines: true,
    "Accepts Medicaid": true,
    "Accepts Medicare": true,
    "Sliding Scale": true,
    "No Insurance OK": true,
    "Walk-ins OK": true,
    "LGBTQ+ Focused": true,
    "Youth Friendly": true,
    Hours:
      "Women's Health: Mon-Fri 9am-5pm; Adult Primary Care: Mon-Thu 8am-8pm, Fri 8am-5pm, Sat 8am-4pm; Abortion: Wednesdays",
    "Abortion Medication Max Weeks": 11,
    "Abortion Procedure Max Weeks": 24,
    "Offers Late-Term (20+ weeks)": true,
  },
  {
    "Clinic Name": "NYC Health + Hospitals/Harlem",
    Address: "506 Lenox Avenue, Ronald H. Brown Pavilion, New York, NY 10037",
    Borough: "Manhattan",
    Phone: "(212) 939-8273",
    Website: "https://www.nychealthandhospitals.org/harlem/",
    Latitude: 40.8143,
    Longitude: -73.9396,
    Organization: "NYC Health + Hospitals",
    "Clinic Type": "Hospital",
    "STI Testing": true,
    "HIV Testing": true,
    PrEP: true,
    PEP: true,
    Contraception: true,
    Abortion: true,
    "Gender-Affirming Care": true,
    Vaccines: true,
    "Accepts Medicaid": true,
    "Accepts Medicare": true,
    "Sliding Scale": true,
    "No Insurance OK": true,
    "Walk-ins OK": true,
    "LGBTQ+ Focused": true,
    "Youth Friendly": true,
    Hours:
      "Women's Health: Mon 9am-7pm, Tue-Fri 9am-5pm; Abortion: Mon, Tue, Fri",
    "Abortion Medication Max Weeks": 11,
    "Abortion Procedure Max Weeks": 24,
    "Offers Late-Term (20+ weeks)": true,
  },
  {
    "Clinic Name": "NYC Health + Hospitals/South Brooklyn Health",
    Address: "2601 Ocean Parkway, Main Building 8th Floor, Brooklyn, NY 11235",
    Borough: "Brooklyn",
    Phone: "(718) 616-3000",
    Website: "https://www.nychealthandhospitals.org/southbrooklynhealth/",
    Latitude: 40.5866,
    Longitude: -73.9658,
    Organization: "NYC Health + Hospitals",
    "Clinic Type": "Hospital",
    "STI Testing": true,
    "HIV Testing": true,
    PrEP: true,
    PEP: true,
    Contraception: true,
    Abortion: true,
    "Gender-Affirming Care": true,
    Vaccines: true,
    "Accepts Medicaid": true,
    "Accepts Medicare": true,
    "Sliding Scale": true,
    "No Insurance OK": true,
    "Walk-ins OK": true,
    "LGBTQ+ Focused": true,
    "Youth Friendly": true,
    Hours: "Mon-Fri 8am-4pm",
    "Abortion Medication Max Weeks": 11,
    "Abortion Procedure Max Weeks": 24,
    "Offers Late-Term (20+ weeks)": true,
  },
  {
    "Clinic Name": "NYC Health + Hospitals/North Central Bronx",
    Address: "3424 Kossuth Avenue, Suite 2D-01, Bronx, NY 10467",
    Borough: "Bronx",
    Phone: "(718) 519-3310",
    Website: "https://www.nychealthandhospitals.org/north-central-bronx/",
    Latitude: 40.8804,
    Longitude: -73.8817,
    Organization: "NYC Health + Hospitals",
    "Clinic Type": "Hospital",
    "STI Testing": true,
    "HIV Testing": true,
    PrEP: true,
    PEP: true,
    Contraception: true,
    Abortion: true,
    "Gender-Affirming Care": true,
    Vaccines: true,
    "Accepts Medicaid": true,
    "Accepts Medicare": true,
    "Sliding Scale": true,
    "No Insurance OK": true,
    "Walk-ins OK": true,
    "LGBTQ+ Focused": true,
    "Youth Friendly": true,
    Hours: "Mon-Fri 8am-4pm",
    "Abortion Medication Max Weeks": 11,
    "Abortion Procedure Max Weeks": 24,
    "Offers Late-Term (20+ weeks)": true,
  },
  {
    "Clinic Name": "All Women's Medical of Queens",
    Address: "120-34 Queens Blvd, Suite 420, Kew Gardens, NY 11415",
    Borough: "Queens",
    Phone: "(718) 793-1943",
    Website: "https://nyabortion.com/",
    Latitude: 40.7136,
    Longitude: -73.8306,
    "Clinic Type": "Private",
    Contraception: true,
    Abortion: true,
    "Accepts Medicaid": true,
    "Sliding Scale": true,
    "No Insurance OK": true,
    "Youth Friendly": true,
    Hours: "Mon-Sat 8:30am-6:00pm",
    "Abortion Medication Max Weeks": 10,
    "Abortion Procedure Max Weeks": 24,
    "Offers Late-Term (20+ weeks)": true,
  },
  {
    "Clinic Name": "SAGE Center",
    Address: "305 Seventh Avenue, 15th Floor, New York, NY 10001",
    Borough: "Manhattan",
    Phone: "(212) 741-2247",
    Website: "https://sageserves.org/",
    Latitude: 40.7463,
    Longitude: -73.9939,
    "Clinic Type": "LGBTQ+ Center",
    "STI Testing": true,
    "HIV Testing": true,
    "Sliding Scale": true,
    "No Insurance OK": true,
    "LGBTQ+ Focused": true,
    Hours: "Mon-Fri 9am-5pm",
    Notes:
      "LGBTQ+ elder focused (50+). Sexual wellness education; clinical services via referral.",
  },
  {
    "Clinic Name": "Ali Forney Center",
    Address: "307 West 38th Street, 3rd Floor, New York, NY 10018",
    Borough: "Manhattan",
    Phone: "(212) 206-0574",
    Website: "https://www.aliforneycenter.org/",
    Latitude: 40.7549,
    Longitude: -73.9922,
    "Clinic Type": "LGBTQ+ Center",
    "STI Testing": true,
    "HIV Testing": true,
    PrEP: true,
    PEP: true,
    Contraception: true,
    "Gender-Affirming Care": true,
    "Accepts Medicaid": true,
    "Accepts Medicare": true,
    "Sliding Scale": true,
    "No Insurance OK": true,
    "Walk-ins OK": true,
    "LGBTQ+ Focused": true,
    "Youth Friendly": true,
    Hours: "24/7 Drop-in; Medical: Mon 9-12:30, Tue 9-4, Thu 9-5",
    Notes:
      "Homeless LGBTQ+ youth ages 16-24. On-site medical via Institute for Family Health.",
  },
  {
    "Clinic Name": "Hetrick-Martin Institute",
    Address: "2 Astor Place, New York, NY 10003",
    Borough: "Manhattan",
    Phone: "(212) 674-2400",
    Website: "https://hmi.org/",
    Latitude: 40.7299,
    Longitude: -73.9918,
    "Clinic Type": "LGBTQ+ Center",
    "STI Testing": true,
    "HIV Testing": true,
    "Gender-Affirming Care": true,
    "Sliding Scale": true,
    "No Insurance OK": true,
    "Walk-ins OK": true,
    "LGBTQ+ Focused": true,
    "Youth Friendly": true,
    Hours: "Mon-Fri 10am-8pm; Intake 4-7pm",
    Notes:
      "LGBTQ+ youth ages 13-24. Health testing and counseling integrated with youth development.",
  },
];

// Updates to existing records (by name match)
const UPDATES = [
  // Coordinates
  {
    name: "The Mount Sinai Comprehensive Health – Downtown",
    fields: { Latitude: 40.7461, Longitude: -73.9937, Phone: "(212) 604-1701" },
  },
  {
    name: "Queens Abortion Pill",
    fields: { Latitude: 40.7136, Longitude: -73.8306, Phone: "(718) 793-1943" },
  },
  {
    name: "Early Options",
    fields: {
      Latitude: 40.7506,
      Longitude: -73.9764,
      Phone: "(212) 431-8533",
      "Abortion Medication Max Weeks": 10,
      "Abortion Procedure Max Weeks": 12,
    },
  },
  {
    name: "Professional Gynecological Services",
    fields: {
      Latitude: 40.6905,
      Longitude: -73.9827,
      Phone: "(718) 875-4848",
      "Abortion Medication Max Weeks": 10,
      "Abortion Procedure Max Weeks": 24,
      "Offers Late-Term (20+ weeks)": true,
    },
  },
  {
    name: "Maze Women's Sexual Health - NYC",
    fields: { Latitude: 40.7503, Longitude: -73.9744, Phone: "(212) 422-1800" },
  },
  {
    name: "Bellevue Hospital Center Obg",
    fields: { Latitude: 40.7397, Longitude: -73.9767, Phone: "(212) 562-5555" },
  },
  {
    name: "NYC Health + Hospitals/Metropolitan",
    fields: { Latitude: 40.7845, Longitude: -73.9438, Phone: "(212) 423-6262" },
  },
  {
    name: "Eastside Gynecology",
    fields: { Latitude: 40.7634, Longitude: -73.9712, Phone: "(212) 308-4988" },
  },
  {
    name: "Planned Parenthood - Queens (Diane L. Max)",
    fields: { Latitude: 40.7476, Longitude: -73.9483, Phone: "(212) 965-7000" },
  },
  {
    name: "NYC DOH - Fort Greene Express Clinic",
    fields: {
      Latitude: 40.6917,
      Longitude: -73.9824,
      Phone: "(347) 396-7959",
      Notes:
        "Express testing only (HIV, Syphilis, Chlamydia, Gonorrhea). Symptomatic patients referred elsewhere.",
    },
  },
  {
    name: "Brooklyn Abortion Clinic",
    fields: {
      Latitude: 40.6905,
      Longitude: -73.9827,
      Phone: "(718) 369-1900",
      "Abortion Medication Max Weeks": 11,
      "Abortion Procedure Max Weeks": 24,
      "Offers Late-Term (20+ weeks)": true,
    },
  },
  {
    name: "Dr. Emily Women's Health Center",
    fields: {
      Latitude: 40.8133,
      Longitude: -73.9011,
      Phone: "(718) 585-1010",
      "Abortion Medication Max Weeks": 9,
      "Abortion Procedure Max Weeks": 21,
      "Offers Late-Term (20+ weeks)": true,
    },
  },
  {
    name: "Labtek STD Testing Centers",
    fields: { Latitude: 40.7162, Longitude: -73.9961, Phone: "(888) 510-3132" },
  },
  {
    name: "Manhattan Sexual Health and Wellness",
    fields: { Latitude: 40.7458, Longitude: -73.9808, Phone: "(212) 686-9015" },
  },
  // Other phone updates
  {
    name: "The Institute for Family Health",
    fields: { Phone: "(844) 434-2778" },
  },
  {
    name: "NYC DOH - Corona Sexual Health Clinic",
    fields: { Phone: "(347) 396-7959" },
  },
  { name: "Destination Tomorrow", fields: { Phone: "(646) 723-3325" } },
  {
    name: "Community Health Center of Richmond - South Avenue",
    fields: { Phone: "(718) 924-2254" },
  },
  {
    name: "Callen-Lorde Community Health Center",
    fields: { Phone: "(212) 271-7200" },
  },
  {
    name: "NYC DOH - Morrisania Sexual Health Clinic",
    fields: { Phone: "(347) 396-7959" },
  },
  {
    name: "Community Health Action of Staten Island (CHASI)",
    fields: { Phone: "(718) 808-1300" },
  },
  {
    name: "NYC DOH - Chelsea Express Clinic",
    fields: { Phone: "(347) 396-7959" },
  },
  // Gestational limits for existing abortion providers
  {
    name: "Parkmed NYC",
    fields: {
      "Abortion Medication Max Weeks": 10,
      "Abortion Procedure Max Weeks": 27,
      "Offers Late-Term (20+ weeks)": true,
    },
  },
  {
    name: "Choices Women's Medical Center",
    fields: {
      "Abortion Medication Max Weeks": 11,
      "Abortion Procedure Max Weeks": 24,
      "Offers Late-Term (20+ weeks)": true,
    },
  },
];

// Records to delete (closed facilities)
const TO_DELETE = ["Planned Parenthood - Manhattan (Margaret Sanger Center)"];

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

async function createRecords(records) {
  // Airtable allows max 10 records per create
  for (let i = 0; i < records.length; i += 10) {
    const batch = records.slice(i, i + 10).map((fields) => ({ fields }));
    const res = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ records: batch }),
      },
    );
    if (!res.ok) {
      console.error("Create failed:", await res.text());
    } else {
      console.log(`Created ${batch.length} records`);
    }
  }
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

async function deleteRecords(ids) {
  for (let i = 0; i < ids.length; i += 10) {
    const batch = ids.slice(i, i + 10);
    const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`);
    batch.forEach((id) => url.searchParams.append("records[]", id));
    const res = await fetch(url, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    if (!res.ok) {
      console.error("Delete failed:", await res.text());
    }
  }
}

async function main() {
  console.log("Fetching existing records...");
  const existing = await fetchAll();
  console.log(`Found ${existing.length} existing records\n`);

  const dryRun = !process.argv.includes("--execute");

  // 1. Create new clinics
  console.log(`=== NEW CLINICS TO CREATE (${NEW_CLINICS.length}) ===`);
  NEW_CLINICS.forEach((c) => console.log(`  + ${c["Clinic Name"]}`));

  // 2. Updates
  console.log(`\n=== UPDATES TO APPLY (${UPDATES.length}) ===`);
  const updateActions = [];
  for (const update of UPDATES) {
    const record = existing.find(
      (r) =>
        r.fields["Clinic Name"]?.toLowerCase() === update.name.toLowerCase(),
    );
    if (record) {
      console.log(
        `  ~ ${update.name}: ${Object.keys(update.fields).join(", ")}`,
      );
      updateActions.push({ id: record.id, fields: update.fields });
    } else {
      console.log(`  ? ${update.name}: NOT FOUND`);
    }
  }

  // 3. Deletions
  console.log(`\n=== RECORDS TO DELETE (${TO_DELETE.length}) ===`);
  const deleteIds = [];
  for (const name of TO_DELETE) {
    const record = existing.find(
      (r) => r.fields["Clinic Name"]?.toLowerCase() === name.toLowerCase(),
    );
    if (record) {
      console.log(`  - ${name}`);
      deleteIds.push(record.id);
    } else {
      console.log(`  ? ${name}: NOT FOUND (already deleted?)`);
    }
  }

  // Summary
  console.log(`\n=== SUMMARY ===`);
  console.log(`New records to create: ${NEW_CLINICS.length}`);
  console.log(`Records to update: ${updateActions.length}`);
  console.log(`Records to delete: ${deleteIds.length}`);

  if (dryRun) {
    console.log("\nDRY RUN - use --execute to apply changes");
    return;
  }

  console.log("\nApplying changes...");

  // Create new
  if (NEW_CLINICS.length > 0) {
    console.log("\nCreating new clinics...");
    await createRecords(NEW_CLINICS);
  }

  // Update existing
  if (updateActions.length > 0) {
    console.log("\nUpdating existing records...");
    for (const action of updateActions) {
      const ok = await updateRecord(action.id, action.fields);
      console.log(
        `  ${ok ? "✓" : "✗"} ${UPDATES.find((u) => existing.find((e) => e.id === action.id)?.fields["Clinic Name"] === u.name)?.name || action.id}`,
      );
    }
  }

  // Delete closed
  if (deleteIds.length > 0) {
    console.log("\nDeleting closed facilities...");
    await deleteRecords(deleteIds);
    console.log(`  Deleted ${deleteIds.length} records`);
  }

  console.log("\nDone!");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
