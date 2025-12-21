#!/usr/bin/env node
/**
 * Delete Airtable records with bad addresses (org name repeated instead of street address)
 *
 * Usage: node scripts/clean-bad-addresses.js
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

async function fetchAllRecords() {
  const headers = { 'Authorization': `Bearer ${TOKEN}` };
  const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`;

  let allRecords = [];
  let offset = null;

  while (true) {
    const params = new URLSearchParams({ pageSize: '100' });
    if (offset) params.append('offset', offset);

    const response = await fetch(`${url}?${params}`, { headers });
    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Error fetching records:', data);
      process.exit(1);
    }

    allRecords = allRecords.concat(data.records || []);
    offset = data.offset;

    if (!offset) break;
  }

  return allRecords;
}

async function deleteRecords(recordIds) {
  const headers = {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
  };
  const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`;

  // Airtable allows max 10 records per delete request
  for (let i = 0; i < recordIds.length; i += 10) {
    const batch = recordIds.slice(i, i + 10);
    const params = new URLSearchParams();
    batch.forEach(id => params.append('records[]', id));

    const response = await fetch(`${url}?${params}`, {
      method: 'DELETE',
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`❌ Error deleting batch ${i/10 + 1}:`, data);
    } else {
      console.log(`✓ Deleted batch ${i/10 + 1} (${batch.length} records)`);
    }

    // Rate limit: wait a bit between batches
    if (i + 10 < recordIds.length) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
}

async function main() {
  console.log('Fetching all Airtable records...\n');
  const records = await fetchAllRecords();
  console.log(`✓ Found ${records.length} total records\n`);

  // Identify bad address records
  const badRecords = records.filter(record => {
    const name = (record.fields['Clinic Name'] || '').trim().toLowerCase();
    const address = (record.fields['Address'] || '').trim().toLowerCase();

    // Bad address = clinic name appears within the address field
    // OR address is empty
    // OR address is just a single word (likely org name)
    const isBad = (name && address.includes(name)) ||
                  !address ||
                  !address.match(/\d/) ||  // No numbers = not a street address
                  address.split(' ').length === 1;

    return isBad;
  });

  console.log(`Found ${badRecords.length} records with bad addresses:\n`);

  // Show sample of bad records
  badRecords.slice(0, 10).forEach(record => {
    console.log(`  ❌ ${record.fields['Clinic Name'] || 'Unnamed'}`);
    console.log(`     Address: "${record.fields['Address'] || 'EMPTY'}"\n`);
  });

  if (badRecords.length > 10) {
    console.log(`  ... and ${badRecords.length - 10} more\n`);
  }

  // Ask for confirmation
  console.log(`\n⚠️  About to DELETE ${badRecords.length} records with bad addresses.`);
  console.log('Press Ctrl+C to cancel, or wait 5 seconds to proceed...\n');

  await new Promise(resolve => setTimeout(resolve, 5000));

  if (badRecords.length > 0) {
    console.log('Deleting bad records...\n');
    const badIds = badRecords.map(r => r.id);
    await deleteRecords(badIds);
    console.log(`\n✓ Deleted ${badRecords.length} records with bad addresses`);
  }

  console.log(`\nRemaining records: ${records.length - badRecords.length}`);
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
