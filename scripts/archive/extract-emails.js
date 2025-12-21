#!/usr/bin/env node

import fs from "fs";

const TOKEN = fs.readFileSync(".env", "utf-8").split("=")[1].trim();
const BASE_ID = "app2GMlVxnjw6ifzz";

// Parse CSV
const csv = fs.readFileSync("data/raw/nyc_opendata_facilities.csv", "utf-8");
const lines = csv.split("\n");
const headers = lines[0].split(",");

const emailIndex = headers.indexOf("contacts_email");
const nameIndex = headers.indexOf("facilityname");
const addressIndex = headers.indexOf("address");

// Extract facilities with emails
const facilitiesWithEmails = [];
for (let i = 1; i < lines.length; i++) {
  // Simple CSV parsing (assumes no commas in fields, which isn't always true)
  const match = lines[i].match(
    /^([^,]*),([^,]*),([^,]*),([^,]*),([^,]*),([^,]*),([^,]*),([^,]*),([^,]*),([^,]*),("[^"]*"|[^,]*),/,
  );
  if (match && match[11]) {
    const email = match[11].replace(/"/g, "").trim();
    if (email && email.includes("@")) {
      // Get facility name - it's field 15
      const parts = lines[i].split(",");
      let name = parts[14] || "";
      facilitiesWithEmails.push({ name, email, line: i });
    }
  }
}

console.log("=== NYC OPEN DATA FACILITIES WITH EMAILS ===");
console.log(`Found ${facilitiesWithEmails.length} facilities with emails\n`);

// Now fetch Airtable clinics to match
const res = await fetch(
  `https://api.airtable.com/v0/${BASE_ID}/tblx7sVpDo17Hkmmr`,
  { headers: { Authorization: `Bearer ${TOKEN}` } },
);
const data = await res.json();

console.log("=== MATCHING TO AIRTABLE CLINICS ===\n");

const matches = [];
for (const clinic of data.records) {
  const clinicName = (clinic.fields["Clinic Name"] || "").toLowerCase();

  for (const fac of facilitiesWithEmails) {
    const facName = (fac.name || "").toLowerCase();

    // Check for partial matches
    if (
      clinicName &&
      facName &&
      (clinicName.includes(facName) ||
        facName.includes(clinicName) ||
        clinicName
          .split(/\s+/)
          .some((w) => w.length > 4 && facName.includes(w)))
    ) {
      matches.push({
        clinicId: clinic.id,
        clinicName: clinic.fields["Clinic Name"],
        matchedName: fac.name,
        emails: fac.email,
      });
      break;
    }
  }
}

console.log(`Matched ${matches.length} clinics to email data:\n`);
matches.forEach((m) => {
  console.log(`  ${m.clinicName}`);
  console.log(`    -> ${m.emails}\n`);
});

console.log("\n=== ALL NYC OPEN DATA EMAILS ===\n");
facilitiesWithEmails.forEach((f) => {
  console.log(`${f.name}: ${f.email}`);
});
