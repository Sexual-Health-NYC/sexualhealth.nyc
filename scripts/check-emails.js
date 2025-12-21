#!/usr/bin/env node

import fs from "fs";

const TOKEN = fs.readFileSync(".env", "utf-8").split("=")[1].trim();
const BASE_ID = "app2GMlVxnjw6ifzz";

async function main() {
  const res = await fetch(
    `https://api.airtable.com/v0/${BASE_ID}/tblx7sVpDo17Hkmmr`,
    { headers: { Authorization: `Bearer ${TOKEN}` } },
  );
  const data = await res.json();

  const withEmail = data.records.filter(
    (r) => r.fields["Update Contact Email"],
  );
  const phoneWithEmail = data.records.filter(
    (r) => r.fields.Phone && r.fields.Phone.includes("@"),
  );

  console.log("=== CLINICS WITH UPDATE CONTACT EMAIL ===");
  console.log(`${withEmail.length} of ${data.records.length} have emails\n`);
  withEmail.forEach((r) => {
    console.log(
      `  ${r.fields["Clinic Name"]}: ${r.fields["Update Contact Email"]}`,
    );
  });

  console.log("\n=== PHONE FIELD WITH @ (possible emails) ===");
  phoneWithEmail.forEach((r) => {
    console.log(`  ${r.fields["Clinic Name"]}: ${r.fields.Phone}`);
  });

  console.log("\n=== CLINICS WITHOUT ANY CONTACT INFO ===");
  const noContact = data.records.filter(
    (r) => !r.fields.Phone && !r.fields["Update Contact Email"],
  );
  noContact.forEach((r) => {
    console.log(`  ${r.fields["Clinic Name"]}`);
  });
}

main();
