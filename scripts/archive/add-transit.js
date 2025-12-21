#!/usr/bin/env node

/**
 * Calculate nearest subway station for each clinic using NYC Open Data.
 *
 * Usage:
 *   node scripts/add-transit.js          # Dry run
 *   node scripts/add-transit.js --execute # Update Airtable
 */

import fs from "fs";

const TOKEN = fs.readFileSync(".env", "utf-8").split("=")[1].trim();
const BASE_ID = "app2GMlVxnjw6ifzz";
const CLINICS_TABLE = "tblx7sVpDo17Hkmmr";

const EXECUTE = process.argv.includes("--execute");

// Haversine formula to calculate distance between two points
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
  // Get unique stops with their routes - use $select to dedupe and aggregate
  const url =
    "https://data.ny.gov/resource/2ucp-7wg5.json?$limit=50000&$select=stop_id,stop_name,latitude,longitude,route_short_name&$where=latitude IS NOT NULL";
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch bus stops: ${res.status}`);
  }
  const data = await res.json();

  // Aggregate routes per stop (same stop_id can have multiple routes)
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
  return res.ok;
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

function formatBusInfo(stop) {
  if (!stop) return null;

  // Format distance
  let distanceStr;
  if (stop.distanceFeet < 1000) {
    distanceStr = `${stop.distanceFeet} ft`;
  } else {
    distanceStr = `${stop.distance.toFixed(2)} mi`;
  }

  // Limit routes shown (can be many at a stop)
  const routes = stop.routes.split(", ").slice(0, 4);
  const routeStr =
    routes.length < stop.routes.split(", ").length
      ? routes.join(", ") + "..."
      : routes.join(", ");

  return `${routeStr} at ${stop.name} (${distanceStr})`;
}

function formatTransitInfo(station) {
  if (!station) return null;

  // Format routes as subway line badges
  const routes = station.routes
    .split(" ")
    .filter((r) => r)
    .join("/");

  // Format distance
  let distanceStr;
  if (station.distanceFeet < 1000) {
    distanceStr = `${station.distanceFeet} ft`;
  } else {
    distanceStr = `${station.distance.toFixed(2)} mi`;
  }

  return `${routes} at ${station.name} (${distanceStr})`;
}

async function main() {
  console.log(EXECUTE ? "=== EXECUTE MODE ===" : "=== DRY RUN ===\n");

  const [stations, busStops, clinics] = await Promise.all([
    fetchSubwayStations(),
    fetchBusStops(),
    fetchAllClinics(),
  ]);

  console.log(`\nProcessing ${clinics.length} clinics...\n`);

  let updated = 0;
  let skipped = 0;

  for (const clinic of clinics) {
    const name = clinic.fields["Clinic Name"];
    const lat = clinic.fields.Latitude;
    const lon = clinic.fields.Longitude;
    const existingSubway = clinic.fields["Nearest Subway"];
    const existingBus = clinic.fields["Nearest Bus"];

    if (!lat || !lon) {
      console.log(`${name}: No coordinates, skipping`);
      skipped++;
      continue;
    }

    const nearestSubway = findNearestStation(lat, lon, stations);
    const nearestBus = findNearestBusStop(lat, lon, busStops);
    const subwayInfo = formatTransitInfo(nearestSubway);
    const busInfo = formatBusInfo(nearestBus);

    console.log(`${name}`);
    if (subwayInfo) console.log(`  Subway: ${subwayInfo}`);
    if (busInfo) console.log(`  Bus: ${busInfo}`);

    // Check if anything changed
    const subwayChanged = subwayInfo && existingSubway !== subwayInfo;
    const busChanged = busInfo && existingBus !== busInfo;

    if (!subwayChanged && !busChanged) {
      console.log("  (unchanged)");
      skipped++;
      continue;
    }

    if (EXECUTE) {
      const fields = {};
      if (subwayInfo) fields["Nearest Subway"] = subwayInfo;
      if (busInfo) fields["Nearest Bus"] = busInfo;

      const success = await updateClinic(clinic.id, fields);
      console.log(success ? "  UPDATED" : "  UPDATE FAILED");
      if (success) updated++;
    } else {
      console.log("  (dry run)");
    }
  }

  console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}`);
}

main().catch(console.error);
