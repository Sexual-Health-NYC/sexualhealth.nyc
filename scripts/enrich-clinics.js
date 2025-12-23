#!/usr/bin/env node

/**
 * Clinic Enrichment Pipeline
 *
 * Augments clinic records with data from external APIs:
 * 1. Geocoding (lat/lon + BBL from NYC Planning Labs)
 * 2. Transit (nearest subway + bus from NYC Open Data)
 *
 * Usage:
 *   node scripts/enrich-clinics.js              # Dry run - show what would be updated
 *   node scripts/enrich-clinics.js --execute    # Actually update Airtable
 *   node scripts/enrich-clinics.js --transit    # Only run transit enrichment
 *   node scripts/enrich-clinics.js --geocode    # Only run geocoding
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

const EXECUTE = process.argv.includes("--execute");
const TRANSIT_ONLY = process.argv.includes("--transit");
const GEOCODE_ONLY = process.argv.includes("--geocode");

// ============================================================================
// Airtable helpers
// ============================================================================

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

// ============================================================================
// Geocoding (NYC Planning Labs GeoSearch)
// ============================================================================

async function geocodeNYC(address, borough) {
  const fullAddress = borough
    ? `${address}, ${borough}, NY`
    : `${address}, New York, NY`;

  const url = new URL("https://geosearch.planninglabs.nyc/v2/search");
  url.searchParams.set("text", fullAddress);
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

  return {
    latitude: coords[1],
    longitude: coords[0],
    bbl: props.addendum?.pad?.bbl || null,
  };
}

// ============================================================================
// Transit (NYC Open Data)
// ============================================================================

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 3959; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function fetchSubwayStations() {
  console.log("Fetching subway stations from NYC Open Data...");
  const url = "https://data.ny.gov/resource/39hk-dx4f.json?$limit=1000";
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch stations: ${res.status}`);
  }
  const data = await res.json();
  console.log(`Fetched ${data.length} subway stations`);
  return data;
}

async function fetchBusStops() {
  console.log("Fetching bus stops from NYC Open Data...");
  const url =
    "https://data.ny.gov/resource/2ucp-7wg5.json?$limit=50000&$select=stop_id,stop_name,latitude,longitude,route_short_name&$where=latitude IS NOT NULL";
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch bus stops: ${res.status}`);
  }
  const data = await res.json();

  // Aggregate routes per stop
  const stopMap = new Map();
  for (const stop of data) {
    if (!stop.latitude || !stop.longitude) continue;
    const key = stop.stop_id;
    if (!stopMap.has(key)) {
      stopMap.set(key, {
        stop_id: stop.stop_id,
        stop_name: stop.stop_name,
        latitude: parseFloat(stop.latitude),
        longitude: parseFloat(stop.longitude),
        routes: new Set(),
      });
    }
    if (stop.route_short_name) {
      stopMap.get(key).routes.add(stop.route_short_name);
    }
  }

  const stops = Array.from(stopMap.values()).map((s) => ({
    ...s,
    routes: Array.from(s.routes).sort().join(", "),
  }));

  console.log(`Fetched ${stops.length} unique bus stops`);
  return stops;
}

function findNearestStation(clinicLat, clinicLon, stations) {
  let nearest = null;
  let minDistance = Infinity;

  for (const station of stations) {
    const stationLat = parseFloat(station.gtfs_latitude);
    const stationLon = parseFloat(station.gtfs_longitude);

    if (isNaN(stationLat) || isNaN(stationLon)) continue;

    const distance = haversineDistance(
      clinicLat,
      clinicLon,
      stationLat,
      stationLon,
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearest = {
        name: station.stop_name,
        routes: station.daytime_routes,
        distance: distance,
        distanceFeet: Math.round(distance * 5280),
      };
    }
  }

  return nearest;
}

function findNearestBusStop(clinicLat, clinicLon, stops) {
  let nearest = null;
  let minDistance = Infinity;

  for (const stop of stops) {
    if (isNaN(stop.latitude) || isNaN(stop.longitude)) continue;

    const distance = haversineDistance(
      clinicLat,
      clinicLon,
      stop.latitude,
      stop.longitude,
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearest = {
        name: stop.stop_name,
        routes: stop.routes,
        distance: distance,
        distanceFeet: Math.round(distance * 5280),
      };
    }
  }

  return nearest;
}

function formatTransitInfo(station) {
  if (!station) return null;

  const routes = station.routes
    .split(" ")
    .filter((r) => r)
    .join("/");

  let distanceStr;
  if (station.distanceFeet < 1000) {
    distanceStr = `${station.distanceFeet} ft`;
  } else {
    distanceStr = `${station.distance.toFixed(2)} mi`;
  }

  return `${routes} at ${station.name} (${distanceStr})`;
}

function formatBusInfo(stop) {
  if (!stop) return null;

  let distanceStr;
  if (stop.distanceFeet < 1000) {
    distanceStr = `${stop.distanceFeet} ft`;
  } else {
    distanceStr = `${stop.distance.toFixed(2)} mi`;
  }

  // Show all routes, no truncation
  const routeStr = stop.routes;

  return `${routeStr} at ${stop.name} (${distanceStr})`;
}

// ============================================================================
// Main pipeline
// ============================================================================

async function main() {
  console.log(EXECUTE ? "=== EXECUTE MODE ===" : "=== DRY RUN ===");
  console.log("");

  const clinics = await fetchAllClinics();
  console.log(`Fetched ${clinics.length} clinics from Airtable\n`);

  // Load transit data if needed
  let subwayStations = null;
  let busStops = null;
  if (!GEOCODE_ONLY) {
    subwayStations = await fetchSubwayStations();
    busStops = await fetchBusStops();
    console.log("");
  }

  const stats = {
    geocoded: 0,
    transitAdded: 0,
    skipped: 0,
    errors: 0,
  };

  for (const clinic of clinics) {
    const name = clinic.fields["Clinic Name"];
    const address = clinic.fields.Address;
    const borough = clinic.fields.Borough;
    const lat = clinic.fields.Latitude;
    const lon = clinic.fields.Longitude;
    const existingSubway = clinic.fields["Nearest Subway"];
    const existingBus = clinic.fields["Nearest Bus"];
    const existingBBL = clinic.fields.BBL;

    const updates = {};

    // Step 1: Geocoding (if missing coords or BBL)
    if (!TRANSIT_ONLY) {
      const needsGeocode = !lat || !lon || !existingBBL;

      if (needsGeocode && address && !address.includes("CLOSED")) {
        const result = await geocodeNYC(address, borough);

        if (result) {
          if (!lat || !lon) {
            updates.Latitude = result.latitude;
            updates.Longitude = result.longitude;
            console.log(
              `${name}: Geocoded to ${result.latitude}, ${result.longitude}`,
            );
          }
          if (!existingBBL && result.bbl) {
            updates.BBL = result.bbl;
            console.log(`${name}: Added BBL ${result.bbl}`);
          }
          stats.geocoded++;
        } else {
          console.log(`${name}: Geocode failed for "${address}"`);
          stats.errors++;
        }

        // Rate limit geocoder
        await new Promise((r) => setTimeout(r, 100));
      }
    }

    // Step 2: Transit (if missing subway/bus info)
    if (!GEOCODE_ONLY && subwayStations && busStops) {
      const clinicLat = updates.Latitude || lat;
      const clinicLon = updates.Longitude || lon;

      if (clinicLat && clinicLon) {
        const nearestSubway = findNearestStation(
          clinicLat,
          clinicLon,
          subwayStations,
        );
        const nearestBus = findNearestBusStop(clinicLat, clinicLon, busStops);
        const subwayInfo = formatTransitInfo(nearestSubway);
        const busInfo = formatBusInfo(nearestBus);

        if (subwayInfo && existingSubway !== subwayInfo) {
          updates["Nearest Subway"] = subwayInfo;
          console.log(`${name}: Subway → ${subwayInfo}`);
        }
        if (busInfo && existingBus !== busInfo) {
          updates["Nearest Bus"] = busInfo;
          console.log(`${name}: Bus → ${busInfo}`);
        }

        if (updates["Nearest Subway"] || updates["Nearest Bus"]) {
          stats.transitAdded++;
        }
      }
    }

    // Apply updates
    if (Object.keys(updates).length > 0) {
      if (EXECUTE) {
        const success = await updateClinic(clinic.id, updates);
        if (!success) stats.errors++;
        // Rate limit Airtable
        await new Promise((r) => setTimeout(r, 250));
      }
    } else {
      stats.skipped++;
    }
  }

  console.log("\n=== Summary ===");
  console.log(`Geocoded: ${stats.geocoded}`);
  console.log(`Transit added: ${stats.transitAdded}`);
  console.log(`Skipped (no changes): ${stats.skipped}`);
  console.log(`Errors: ${stats.errors}`);

  if (!EXECUTE) {
    console.log("\nThis was a dry run. Use --execute to apply changes.");
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
