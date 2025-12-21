#!/usr/bin/env node

import fs from "fs";

const TOKEN = fs.readFileSync(".env", "utf-8").split("=")[1].trim();

async function main() {
  const res = await fetch(
    "https://api.airtable.com/v0/app2GMlVxnjw6ifzz/tblx7sVpDo17Hkmmr",
    {
      headers: { Authorization: `Bearer ${TOKEN}` },
    },
  );
  const data = await res.json();

  console.log("=== CLINICS WITHOUT ORGANIZATION ===\n");
  data.records
    .filter((r) => !r.fields.Organization)
    .forEach((r) => {
      const name = r.fields["Clinic Name"] || "NO NAME";
      const type = r.fields["Clinic Type"] || "?";
      const borough = r.fields.Borough || "?";
      console.log(`${name} [${type}] - ${borough}`);
    });

  console.log("\n=== SUMMARY: WHAT'S LIKELY MISSING ===\n");

  // Check for NYC H+H coverage
  const hh = data.records.filter(
    (r) => r.fields.Organization === "NYC Health + Hospitals",
  );
  console.log(`NYC Health + Hospitals: ${hh.length} locations`);
  console.log(
    "  Expected: ~11 hospitals (Bellevue, Kings County, Elmhurst, Queens, Harlem, Lincoln, Jacobi, Woodhull, Coney Island, Metropolitan, North Central Bronx)",
  );
  console.log("  Current:");
  hh.forEach((r) => console.log(`    - ${r.fields["Clinic Name"]}`));

  // Check Planned Parenthood
  const pp = data.records.filter(
    (r) => r.fields.Organization === "Planned Parenthood",
  );
  console.log(`\nPlanned Parenthood: ${pp.length} locations`);
  console.log(
    "  Note: Margaret Sanger Center (Manhattan) closed Oct 2024, so ~5-6 active locations expected",
  );
  console.log("  Current:");
  pp.forEach((r) => console.log(`    - ${r.fields["Clinic Name"]}`));

  // Private abortion clinics
  const abortion = data.records.filter(
    (r) =>
      r.fields.Abortion ||
      (r.fields["Clinic Name"] || "").toLowerCase().includes("abortion"),
  );
  console.log(`\nAbortion providers: ${abortion.length} locations`);
  console.log("  Known major providers to check:");
  console.log("    - Parkmed NYC (Manhattan) - up to 27 weeks");
  console.log("    - All Women's Medical (Queens) - up to 24 weeks");
  console.log("    - Choices Women's Medical Center (Queens)");
  console.log("    - Brooklyn Abortion Clinic");
  console.log("    - Dr. Emily Women's Health Center");
  console.log("    - Early Options");
}

main();
