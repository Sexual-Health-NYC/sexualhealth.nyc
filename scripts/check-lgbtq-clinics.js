#!/usr/bin/env node
/**
 * List clinics marked as LGBTQ+ focused
 */

import fs from 'fs';

const data = JSON.parse(fs.readFileSync('public/clinics.geojson', 'utf8'));

const lgbtqClinics = data.features
  .filter(f => f.properties.lgbtq_focused === true)
  .map(f => f.properties.name)
  .sort();

console.log(`\nLGBTQ+ Focused Clinics (${lgbtqClinics.length} total):\n`);
lgbtqClinics.forEach((name, i) => {
  console.log(`${(i + 1).toString().padStart(2)}. ${name}`);
});
