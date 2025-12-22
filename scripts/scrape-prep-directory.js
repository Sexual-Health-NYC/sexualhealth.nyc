#!/usr/bin/env node

/**
 * Scrape NYS PrEP Provider Directory using Bright Data Web Unlocker
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { HttpsProxyAgent } from "https-proxy-agent";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

// Load tokens from .env
const envPath = path.join(rootDir, ".env");
const envContent = fs.readFileSync(envPath, "utf-8");
const envVars = {};
envContent.split("\n").forEach((line) => {
  const [key, value] = line.split("=");
  if (key && value) envVars[key.trim()] = value.trim();
});

const BRIGHTDATA_API_KEY = envVars.BRIGHTDATA_API_KEY;

if (!BRIGHTDATA_API_KEY) {
  console.error("BRIGHTDATA_API_KEY not found in .env");
  process.exit(1);
}

// NYS AIDS Institute Provider Directory - the actual searchable database
const PREP_URL = "https://providerdirectory.aidsinstituteny.org/";

// NYC county codes for the form
const NYC_COUNTIES = [
  "NEW YORK", // Manhattan
  "KINGS", // Brooklyn
  "QUEENS", // Queens
  "BRONX", // Bronx
  "RICHMOND", // Staten Island
];

async function scrapeWithUnblocker(url) {
  console.log(`Scraping via Web Unlocker: ${url}`);

  // Use Web Unlocker zone via proxy
  const proxyUrl = `http://brd-customer-hl_a8a12e9c-zone-unblocker:${BRIGHTDATA_API_KEY}@brd.superproxy.io:33335`;
  const agent = new HttpsProxyAgent(proxyUrl);

  const response = await fetch(url, {
    agent,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });

  if (!response.ok) {
    console.error(`HTTP error: ${response.status}`);
    return null;
  }

  return await response.text();
}

async function postToApi(endpoint, data) {
  console.log(`POST to: ${endpoint}`);

  const proxyUrl = `http://brd-customer-hl_a8a12e9c-zone-unblocker:${BRIGHTDATA_API_KEY}@brd.superproxy.io:33335`;
  const agent = new HttpsProxyAgent(proxyUrl);

  const response = await fetch(endpoint, {
    method: "POST",
    agent,
    headers: {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Accept: "application/json, text/javascript, */*; q=0.01",
      "X-Requested-With": "XMLHttpRequest",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    console.error(`HTTP error: ${response.status}`);
    return null;
  }

  return await response.text();
}

async function main() {
  console.log(
    "Attempting to scrape NYS AIDS Institute Provider Directory...\n",
  );

  // NYC counties
  const counties = ["New York", "Kings", "Queens", "Bronx", "Richmond"];

  // The API endpoint we found
  const apiUrl =
    "https://providerdirectory.aidsinstituteny.org/GeoMap/SiteLocInfoExtract";

  // PrEP service type abbreviation (need to find this)
  // First get the service categories
  const catUrl =
    "https://providerdirectory.aidsinstituteny.org/GeoMap/ExtractServiceCategory";
  const categories = await postToApi(catUrl, { p_role: "" });
  if (categories) {
    console.log("Service categories response:", categories.substring(0, 2000));

    // Save for analysis
    fs.writeFileSync(
      path.join(rootDir, "tmp-service-categories.json"),
      categories,
    );
  }

  // Try to fetch PrEP providers for each NYC county
  for (const county of counties) {
    console.log(`\nFetching PrEP providers in ${county} county...`);

    const result = await postToApi(apiUrl, {
      searchInfo: "",
      svcType: "PrEP", // Try PrEP as service type
      radius: 100,
      clientLoc: "40.7128,-74.006", // NYC center
      listAll: true,
      SrchByCnty: county,
      telehealth: false,
    });

    if (result) {
      console.log(`Got ${result.length} chars of data`);
      const outputPath = path.join(
        rootDir,
        `tmp-prep-${county.toLowerCase().replace(" ", "-")}.json`,
      );
      fs.writeFileSync(outputPath, result);
      console.log(`Saved to ${outputPath}`);

      // Parse and count
      try {
        const data = JSON.parse(result);
        console.log(
          `Found ${Array.isArray(data) ? data.length : "?"} providers`,
        );
        if (Array.isArray(data) && data.length > 0) {
          console.log(
            "Sample provider:",
            JSON.stringify(data[0], null, 2).substring(0, 500),
          );
        }
      } catch {
        console.log("First 500 chars:", result.substring(0, 500));
      }
    }
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
