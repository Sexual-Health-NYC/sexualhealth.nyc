const fs = require("fs");

const API_KEY = "AIzaSyDvLR0u9U2cAPk0rbpjOq5nlh7Mtn3NQNg";

// Load clinics missing hours
const data = JSON.parse(fs.readFileSync("public/clinics.geojson"));
const clinics = data.features.map(f => f.properties);
const missing = clinics.filter(c => !c.hours || c.hours.length === 0);

console.log(`Fetching Google Places data for ${missing.length} clinics...\n`);

async function findPlace(name, address) {
  const query = encodeURIComponent(`${name} ${address}`);
  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&fields=place_id,name,formatted_address&key=${API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.candidates && data.candidates.length > 0) {
    return data.candidates[0];
  }
  return null;
}

async function getPlaceDetails(placeId) {
  const fields = [
    "name",
    "formatted_address",
    "formatted_phone_number",
    "international_phone_number",
    "website",
    "url",
    "opening_hours",
    "business_status",
    "types"
  ].join(",");

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${API_KEY}`;

  const res = await fetch(url);
  return await res.json();
}

function parseHoursToOurFormat(openingHours) {
  if (!openingHours || !openingHours.periods) return null;

  // Google format: periods array with open/close times
  // Our format: array of { department, schedule: [{ days, open, close }] }

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const schedule = [];

  for (const period of openingHours.periods) {
    if (!period.open) continue;

    const day = dayNames[period.open.day];
    const openTime = period.open.time; // "0900"
    const closeTime = period.close?.time || "2359";

    // Format times as "9:00 AM"
    const formatTime = (t) => {
      const h = parseInt(t.slice(0, 2));
      const m = t.slice(2);
      const ampm = h >= 12 ? "PM" : "AM";
      const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
      return m === "00" ? `${h12} ${ampm}` : `${h12}:${m} ${ampm}`;
    };

    schedule.push({
      days: [day],
      open: formatTime(openTime),
      close: formatTime(closeTime)
    });
  }

  return [{ department: "General", schedule }];
}

async function main() {
  const results = [];
  const fullResponses = [];

  for (let i = 0; i < missing.length; i++) {
    const clinic = missing[i];
    console.log(`[${i + 1}/${missing.length}] ${clinic.name}`);

    try {
      // Find place
      const place = await findPlace(clinic.name, clinic.address);

      if (!place) {
        console.log(`  ❌ Not found on Google`);
        results.push({ clinic: clinic.name, status: "not_found" });
        continue;
      }

      console.log(`  Found: ${place.name}`);

      // Get details
      const details = await getPlaceDetails(place.place_id);

      if (details.status !== "OK") {
        console.log(`  ❌ Details error: ${details.status}`);
        results.push({ clinic: clinic.name, status: "details_error", error: details.status });
        continue;
      }

      const result = details.result;
      fullResponses.push({ clinicName: clinic.name, clinicId: clinic.id, google: result });

      // Extract facts
      const facts = {
        clinicName: clinic.name,
        clinicId: clinic.id,
        googleName: result.name,
        phone: result.formatted_phone_number || null,
        website: result.website || null,
        googleMapsUrl: result.url || null,
        businessStatus: result.business_status || null,
        hours: parseHoursToOurFormat(result.opening_hours),
        hoursText: result.opening_hours?.weekday_text || null
      };

      results.push(facts);

      if (facts.hours) {
        console.log(`  ✓ Hours: ${facts.hoursText?.[0] || 'found'}`);
      } else {
        console.log(`  ⚠ No hours available`);
      }

      if (facts.phone) console.log(`  📞 ${facts.phone}`);
      if (facts.website) console.log(`  🌐 ${facts.website}`);

    } catch (err) {
      console.log(`  ❌ Error: ${err.message}`);
      results.push({ clinic: clinic.name, status: "error", error: err.message });
    }

    // Small delay to be nice
    await new Promise(r => setTimeout(r, 200));
  }

  // Save results
  fs.writeFileSync("scripts/google-places-full.json", JSON.stringify(fullResponses, null, 2));
  fs.writeFileSync("scripts/google-places-facts.json", JSON.stringify(results, null, 2));

  console.log("\n✓ Saved full responses to scripts/google-places-full.json");
  console.log("✓ Saved extracted facts to scripts/google-places-facts.json");

  // Summary
  const withHours = results.filter(r => r.hours);
  const withPhone = results.filter(r => r.phone);
  const withWebsite = results.filter(r => r.website);

  console.log(`\nSummary:`);
  console.log(`  Found hours: ${withHours.length}/${missing.length}`);
  console.log(`  Found phone: ${withPhone.length}/${missing.length}`);
  console.log(`  Found website: ${withWebsite.length}/${missing.length}`);
}

main().catch(console.error);
