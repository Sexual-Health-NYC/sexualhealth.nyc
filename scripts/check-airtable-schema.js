#!/usr/bin/env node
/**
 * Check Airtable schema and column order
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const TOKEN = envContent.split('\n')
  .find(line => line.startsWith('AIRTABLE_TOKEN='))
  ?.split('=')[1]
  ?.trim();

if (!TOKEN) {
  console.error('❌ AIRTABLE_TOKEN not found in .env');
  process.exit(1);
}

const BASE_ID = 'app2GMlVxnjw6ifzz';
const TABLE_ID = 'tblx7sVpDo17Hkmmr';

async function getTableSchema() {
  const headers = {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
  };

  // Fetch the base schema using the meta API
  const baseUrl = `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables`;

  try {
    const response = await fetch(baseUrl, { headers });
    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Error fetching schema:', data);
      process.exit(1);
    }

    // Find the Clinics table
    const clinicsTable = data.tables.find(t => t.id === TABLE_ID);

    if (!clinicsTable) {
      console.error('❌ Clinics table not found');
      process.exit(1);
    }

    console.log('📋 Airtable Schema - Current Column Order\n');
    console.log(`Table: ${clinicsTable.name}`);
    console.log(`Total Fields: ${clinicsTable.fields.length}\n`);

    // Group fields by category for analysis
    const fieldGroups = {
      basic: [],
      location: [],
      contact: [],
      services: [],
      gac: [],
      insurance: [],
      hours: [],
      metadata: [],
      other: []
    };

    clinicsTable.fields.forEach((field, index) => {
      const name = field.name;
      const type = field.type;

      // Categorize fields
      if (['id', 'Name', 'Clinic Name'].includes(name)) {
        fieldGroups.basic.push({ index, name, type });
      } else if (['Address', 'City', 'State', 'ZIP', 'Borough', 'Latitude', 'Longitude', 'Borough-Block-Lot'].includes(name)) {
        fieldGroups.location.push({ index, name, type });
      } else if (['Phone', 'Website', 'Email'].includes(name)) {
        fieldGroups.contact.push({ index, name, type });
      } else if (name.toLowerCase().includes('gender affirming') || name.toLowerCase().includes('gac') || name === 'Informed Consent HRT') {
        fieldGroups.gac.push({ index, name, type });
      } else if (name.toLowerCase().includes('insurance') || name.toLowerCase().includes('medicaid') || name.toLowerCase().includes('medicare') || name.toLowerCase().includes('sliding scale')) {
        fieldGroups.insurance.push({ index, name, type });
      } else if (name.toLowerCase().includes('hour') || name.toLowerCase().includes('walk-in') || name.toLowerCase().includes('appointment')) {
        fieldGroups.hours.push({ index, name, type });
      } else if (['STI Testing', 'HIV Testing', 'PrEP', 'PEP', 'Contraception', 'Abortion', 'Vaccines'].some(s => name.includes(s))) {
        fieldGroups.services.push({ index, name, type });
      } else if (name.toLowerCase().includes('source') || name.toLowerCase().includes('verified') || name.toLowerCase().includes('updated')) {
        fieldGroups.metadata.push({ index, name, type });
      } else {
        fieldGroups.other.push({ index, name, type });
      }
    });

    // Print current order
    console.log('Current Order:');
    console.log('─'.repeat(80));
    clinicsTable.fields.forEach((field, index) => {
      console.log(`${(index + 1).toString().padStart(3)}. ${field.name.padEnd(40)} [${field.type}]`);
    });

    console.log('\n\n📊 Logical Grouping Analysis:\n');

    const groups = [
      { name: '🏥 Basic Info', fields: fieldGroups.basic },
      { name: '📍 Location', fields: fieldGroups.location },
      { name: '📞 Contact', fields: fieldGroups.contact },
      { name: '💊 Core Services', fields: fieldGroups.services },
      { name: '🏳️‍⚧️ Gender-Affirming Care', fields: fieldGroups.gac },
      { name: '💳 Insurance', fields: fieldGroups.insurance },
      { name: '🕐 Hours & Access', fields: fieldGroups.hours },
      { name: '📝 Metadata', fields: fieldGroups.metadata },
      { name: '❓ Other', fields: fieldGroups.other }
    ];

    groups.forEach(group => {
      if (group.fields.length > 0) {
        console.log(`\n${group.name} (${group.fields.length} fields):`);
        group.fields.forEach(f => {
          console.log(`  ${(f.index + 1).toString().padStart(3)}. ${f.name.padEnd(40)} [${f.type}]`);
        });
      }
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

getTableSchema();
