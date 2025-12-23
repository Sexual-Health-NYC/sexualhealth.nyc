#!/usr/bin/env node
/**
 * Delete the closed Margaret Sanger Center from Airtable
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
const RECORD_ID = 'recR3f0pNv4kj0n6g'; // Margaret Sanger Center

async function deleteRecord() {
  const headers = {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
  };

  const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}/${RECORD_ID}`;

  console.log('🗑️  Deleting Planned Parenthood Manhattan Health Center (Margaret Sanger Center)');
  console.log('   26 Bleecker Street - CLOSED October 31, 2025\n');

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Error deleting record:', data);
      process.exit(1);
    }

    console.log('✓ Successfully deleted from Airtable');
    console.log(`   Record ID: ${data.id}`);
    console.log(`   Deleted: ${data.deleted}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

deleteRecord();
