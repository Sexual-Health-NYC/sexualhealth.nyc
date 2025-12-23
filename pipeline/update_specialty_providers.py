#!/usr/bin/env python3
"""Update the 5 specialty providers with their specific service flags"""
import os
import requests
from dotenv import load_dotenv

load_dotenv()

AIRTABLE_TOKEN = os.getenv("AIRTABLE_TOKEN")
BASE_ID = "app2GMlVxnjw6ifzz"
TABLE_ID = "tblx7sVpDo17Hkmmr"
HEADERS = {
    "Authorization": f"Bearer {AIRTABLE_TOKEN}",
    "Content-Type": "application/json"
}

# Map clinic names to their specialty services
SPECIALTY_UPDATES = {
    "Nios Spa - Manhattan": {
        "Gender Affirming Electrolysis": True
    },
    "Nios Spa - Brooklyn": {
        "Gender Affirming Electrolysis": True
    },
    "New York Electrolysis": {
        "Gender Affirming Electrolysis": True
    },
    "L'Elite Medispa and Wellness": {
        "Gender Affirming Electrolysis": True,
        "Gender Affirming Laser": True
    },
    "Mount Sinai - Voice Therapy": {
        "Gender Affirming Voice": True
    }
}

def fetch_all_records():
    records = []
    offset = None
    while True:
        url = f"https://api.airtable.com/v0/{BASE_ID}/{TABLE_ID}?pageSize=100"
        if offset:
            url += f"&offset={offset}"
        response = requests.get(url, headers=HEADERS)
        data = response.json()
        records.extend(data.get('records', []))
        offset = data.get('offset')
        if not offset:
            break
    return records

def update_record(record_id, fields, name):
    url = f"https://api.airtable.com/v0/{BASE_ID}/{TABLE_ID}/{record_id}"
    response = requests.patch(url, headers=HEADERS, json={"fields": fields})
    if response.status_code == 200:
        print(f"✅ Updated {name}")
    else:
        if "UNKNOWN_FIELD_NAME" in response.text:
            print(f"⚠️  Fields not in schema yet for {name} - add checkbox fields to Airtable first")
        else:
            print(f"❌ Failed {name}: {response.text}")

def main():
    print("Fetching all records...")
    records = fetch_all_records()
    print(f"Found {len(records)} total records\n")
    
    updated = 0
    for record in records:
        name = record['fields'].get('Clinic Name', '')
        if name in SPECIALTY_UPDATES:
            updates = SPECIALTY_UPDATES[name]
            print(f"Updating: {name}")
            update_record(record['id'], updates, name)
            updated += 1
    
    print(f"\n✅ Updated {updated}/{len(SPECIALTY_UPDATES)} specialty providers")
    if updated < len(SPECIALTY_UPDATES):
        print("\nTo fix: Add these checkbox fields to Airtable schema first:")
        print("  - Gender Affirming Electrolysis")
        print("  - Gender Affirming Laser")
        print("  - Gender Affirming Voice")

if __name__ == "__main__":
    main()
