#!/usr/bin/env node
/**
 * Remove email addresses from phone number fields in Airtable
 *
 * Usage: node scripts/fix-emails-in-phone.js
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

async function updateRecords(updates) {
  const headers = {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
  };
  const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`;

  // Airtable allows max 10 records per patch request
  for (let i = 0; i < updates.length; i += 10) {
    const batch = updates.slice(i, i + 10);

    const response = await fetch(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ records: batch })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`❌ Error updating batch ${i/10 + 1}:`, data);
    } else {
      console.log(`✓ Updated batch ${i/10 + 1} (${batch.length} records)`);
    }

    // Rate limit: wait a bit between batches
    if (i + 10 < updates.length) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
}

async function main() {
  console.log('Fetching all Airtable records...\n');
  const records = await fetchAllRecords();
  console.log(`✓ Found ${records.length} total records\n`);

  // Find records with emails in phone field
  const recordsWithEmails = records.filter(record => {
    const phone = record.fields['Phone'] || '';
    return phone.includes('@');
  });

  console.log(`Found ${recordsWithEmails.length} records with emails in phone field:\n`);

  recordsWithEmails.forEach(record => {
    console.log(`  📧 ${record.fields['Clinic Name'] || 'Unnamed'}`);
    console.log(`     Phone: "${record.fields['Phone']}"\n`);
  });

  if (recordsWithEmails.length === 0) {
    console.log('✓ No records with emails in phone field');
    return;
  }

  // Prepare updates - clear phone field
  const updates = recordsWithEmails.map(record => ({
    id: record.id,
    fields: {
      'Phone': ''  // Clear the phone field
    }
  }));

  console.log(`\n⚠️  About to CLEAR phone field for ${recordsWithEmails.length} records.`);
  console.log('Press Ctrl+C to cancel, or wait 5 seconds to proceed...\n');

  await new Promise(resolve => setTimeout(resolve, 5000));

  console.log('Clearing phone fields with emails...\n');
  await updateRecords(updates);
  console.log(`\n✓ Cleared ${recordsWithEmails.length} phone fields containing emails`);
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
