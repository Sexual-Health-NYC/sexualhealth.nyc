#!/usr/bin/env node

import fs from "fs";

const TOKEN = fs.readFileSync(".env", "utf-8").split("=")[1].trim();

async function main() {
  const res = await fetch(
    "https://api.airtable.com/v0/app2GMlVxnjw6ifzz/tblx7sVpDo17Hkmmr",
    { headers: { Authorization: `Bearer ${TOKEN}` } },
  );
  const data = await res.json();

  let noCoords = 0,
    noPhone = 0,
    noHours = 0,
    noServices = 0,
    noBorough = 0;

  data.records.forEach((r) => {
    const f = r.fields;
    if (!f.Latitude || !f.Longitude) noCoords++;
    if (!f.Phone) noPhone++;
    if (!f.Hours) noHours++;
    if (!f.Borough) noBorough++;
    const hasService =
      f["STI Testing"] ||
      f["HIV Testing"] ||
      f.PrEP ||
      f.Abortion ||
      f.Contraception;
    if (!hasService) noServices++;
  });

  console.log("=== DATA QUALITY GAPS ===");
  console.log("Total records:", data.records.length);
  console.log("Missing coordinates:", noCoords);
  console.log("Missing phone:", noPhone);
  console.log("Missing hours:", noHours);
  console.log("Missing borough:", noBorough);
  console.log("Missing all services:", noServices);

  console.log("\n=== RECORDS MISSING COORDINATES ===");
  data.records
    .filter((r) => !r.fields.Latitude)
    .forEach((r) => {
      console.log(
        "  - " +
          r.fields["Clinic Name"] +
          ": " +
          (r.fields.Address || "NO ADDRESS"),
      );
    });

  console.log("\n=== RECORDS MISSING PHONE ===");
  data.records
    .filter((r) => !r.fields.Phone)
    .forEach((r) => {
      console.log("  - " + r.fields["Clinic Name"]);
    });
}

main();
