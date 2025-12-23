const fs = require("fs");
const path = require("path");

// Load token from .env
const envPath = path.join(__dirname, "..", ".env");
const envContent = fs.readFileSync(envPath, "utf-8");
const tokenMatch = envContent.match(/AIRTABLE_TOKEN=(.+)/);
const TOKEN = tokenMatch ? tokenMatch[1].trim() : null;

if (!TOKEN) {
  console.error("Missing AIRTABLE_TOKEN in .env");
  process.exit(1);
}

const BASE_ID = "app2GMlVxnjw6ifzz";
const CLINICS_TABLE = "tblx7sVpDo17Hkmmr";
const HOURS_TABLE = "tblp2gxzk6xGeDtnI";

// Load Google Places facts
const facts = JSON.parse(fs.readFileSync(path.join(__dirname, "google-places-facts.json")));

// Load current clinics to check what's missing
const geojson = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "public", "clinics.geojson")));
const clinicsById = {};
geojson.features.forEach(f => {
  clinicsById[f.properties.id] = f.properties;
});

async function updateClinic(clinicId, fields) {
  const url = `https://api.airtable.com/v0/${BASE_ID}/${CLINICS_TABLE}/${clinicId}`;

  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ fields })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Airtable error: ${res.status} ${text}`);
  }

  return await res.json();
}

async function createHoursRecords(clinicId, hoursData) {
  // hoursData is our parsed format: [{ department, schedule: [{ days, open, close }] }]
  const records = [];

  // Map full day names to abbreviations
  const dayAbbrev = {
    "Sunday": "Sun",
    "Monday": "Mon",
    "Tuesday": "Tue",
    "Wednesday": "Wed",
    "Thursday": "Thu",
    "Friday": "Fri",
    "Saturday": "Sat"
  };

  // Convert time like "9 AM" or "3:30 PM" to "09:00" or "15:30"
  const to24h = (t) => {
    const match = t.match(/(\d+)(?::(\d+))?\s*(AM|PM)/i);
    if (!match) return t;
    let h = parseInt(match[1]);
    const m = match[2] || "00";
    const ampm = match[3].toUpperCase();
    if (ampm === "PM" && h !== 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
    return `${h.toString().padStart(2, "0")}:${m}`;
  };

  for (const dept of hoursData) {
    for (const sched of dept.schedule) {
      // sched.days is an array like ["Monday"]
      const daysOfWeek = sched.days.map(d => dayAbbrev[d] || d);
      const daysStr = daysOfWeek.join("/");

      records.push({
        fields: {
          Clinic: [clinicId],
          Department: dept.department || "General",
          Days: daysStr,
          "Days of Week": daysOfWeek,
          "Open Time": to24h(sched.open),
          "Close Time": to24h(sched.close)
        }
      });
    }
  }

  // Batch create (max 10 per request)
  for (let i = 0; i < records.length; i += 10) {
    const batch = records.slice(i, i + 10);
    const url = `https://api.airtable.com/v0/${BASE_ID}/${HOURS_TABLE}`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ records: batch })
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Airtable hours error: ${res.status} ${text}`);
    }
  }

  return records.length;
}

async function main() {
  console.log("Pushing Google Places data to Airtable...\n");

  let updatedCount = 0;
  let hoursAdded = 0;
  let phonesAdded = 0;
  let websitesAdded = 0;

  for (const fact of facts) {
    // Skip errors/not found
    if (fact.status === "not_found" || fact.status === "error") {
      continue;
    }

    const clinicId = fact.clinicId;
    const current = clinicsById[clinicId];

    if (!current) {
      console.log(`⚠ Clinic ${fact.clinicName} not in geojson, skipping`);
      continue;
    }

    const updates = {};
    let needsUpdate = false;

    // Phone - only update if missing
    if (fact.phone && !current.phone) {
      updates.Phone = fact.phone;
      needsUpdate = true;
      phonesAdded++;
    }

    // Website - only update if missing
    if (fact.website && !current.website) {
      updates.Website = fact.website;
      needsUpdate = true;
      websitesAdded++;
    }

    // Update clinic record
    if (needsUpdate) {
      console.log(`Updating ${fact.clinicName}:`);
      if (updates.Phone) console.log(`  📞 Adding phone: ${updates.Phone}`);
      if (updates.Website) console.log(`  🌐 Adding website: ${updates.Website}`);

      try {
        await updateClinic(clinicId, updates);
        updatedCount++;
      } catch (err) {
        console.log(`  ❌ Error: ${err.message}`);
      }
    }

    // Hours - add if we have them and clinic is missing hours
    if (fact.hours && (!current.hours || current.hours.length === 0)) {
      console.log(`Adding hours for ${fact.clinicName}...`);
      try {
        const count = await createHoursRecords(clinicId, fact.hours);
        console.log(`  ✓ Added ${count} hour records`);
        hoursAdded++;
      } catch (err) {
        console.log(`  ❌ Hours error: ${err.message}`);
      }
    }

    // Small delay
    await new Promise(r => setTimeout(r, 100));
  }

  console.log("\n--- Summary ---");
  console.log(`Clinics updated: ${updatedCount}`);
  console.log(`Hours added for: ${hoursAdded} clinics`);
  console.log(`Phones added: ${phonesAdded}`);
  console.log(`Websites added: ${websitesAdded}`);
  console.log("\nRun 'node scripts/fetch-airtable.js' to regenerate geojson");
}

main().catch(console.error);
