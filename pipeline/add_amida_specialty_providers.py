#!/usr/bin/env python3
"""
Add AMIDA GIST specialty providers to Airtable.

These are non-clinical facility providers for:
- Electrolysis (hair removal for pre-surgical requirements)
- Laser hair removal
- Voice therapy/modification

Source: AMIDA Care GIST Provider Listing (May 2025)
- data/source-scrapes/amida-gist-may-2025.txt
- data/source-scrapes/amida-electrolysis-2024.txt
"""

import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

AIRTABLE_TOKEN = os.getenv("AIRTABLE_TOKEN")
BASE_ID = "app2GMlVxnjw6ifzz"
CLINICS_TABLE_ID = "tblx7sVpDo17Hkmmr"

AIRTABLE_API_URL = f"https://api.airtable.com/v0/{BASE_ID}/{CLINICS_TABLE_ID}"
HEADERS = {
    "Authorization": f"Bearer {AIRTABLE_TOKEN}",
    "Content-Type": "application/json"
}

# NYC Planning Labs GeoSearch API
def geocode_nyc_address(address_str):
    url = "https://geosearch.planninglabs.nyc/v2/search"
    params = {'text': address_str, 'size': 1}

    try:
        response = requests.get(url, params=params, timeout=5)
        response.raise_for_status()
        data = response.json()

        if not data.get('features'):
            print(f"  ⚠️ No geocode match for: {address_str}")
            return None

        best_match = data['features'][0]
        props = best_match['properties']
        geom = best_match['geometry']

        return {
            'clean_address': props.get('label'),
            'latitude': geom['coordinates'][1],
            'longitude': geom['coordinates'][0],
            'bbl': props.get('pad_bbl'),
        }
    except Exception as e:
        print(f"  ❌ Geocode error: {e}")
        return None


def add_clinic(clinic_data):
    """Add a single clinic to Airtable."""
    name = clinic_data.get('Clinic Name', 'Unknown')
    print(f"\nAdding: {name}")

    # Geocode if address provided
    if clinic_data.get('Address'):
        geo = geocode_nyc_address(clinic_data['Address'])
        if geo:
            clinic_data['Latitude'] = geo['latitude']
            clinic_data['Longitude'] = geo['longitude']
            print(f"  📍 Geocoded: {geo['latitude']}, {geo['longitude']}")

    payload = {"records": [{"fields": clinic_data}]}

    try:
        response = requests.post(AIRTABLE_API_URL, headers=HEADERS, json=payload)
        if response.status_code != 200:
            print(f"  ❌ Error {response.status_code}: {response.text}")
            import json
            print(f"     Payload sent: {json.dumps(payload, indent=2)}")
            return None
        record_id = response.json()['records'][0]['id']
        print(f"  ✅ Added with ID: {record_id}")
        return record_id
    except Exception as e:
        print(f"  ❌ Exception: {e}")
        return None


def main():
    if not AIRTABLE_TOKEN:
        print("Error: AIRTABLE_TOKEN not found in .env")
        return

    # Define the specialty providers from AMIDA GIST May 2025
    providers_to_add = [
        # ELECTROLYSIS PROVIDERS
        {
            "Clinic Name": "Nios Spa - Manhattan",
            "Address": "315 W 57th Street, Suite 308, New York, NY 10019",
            "Borough": "Manhattan",
            "Phone": "(212) 863-9058",
            "Website": "https://www.niosspa.com",
            # Services
            "Gender-Affirming Care": True,
            # Insurance
            "Accepts Medicaid": True,
        },
        {
            "Clinic Name": "Nios Spa - Brooklyn",
            "Address": "567 Pacific Street, Retail Level, Brooklyn, NY 11217",
            "Borough": "Brooklyn",
            "Phone": "(212) 863-9058",
            "Website": "https://www.niosspa.com",
            # Services
            "Gender-Affirming Care": True,
            # Insurance
            "Accepts Medicaid": True,
        },
        {
            "Clinic Name": "New York Electrolysis",
            "Address": "119 West 23rd Street, Suite 610, New York, NY 10011",
            "Borough": "Manhattan",
            "Phone": "(212) 673-4358",
            # Services
            "Gender-Affirming Care": True,
            # Insurance
            "Accepts Medicaid": True,
        },
        {
            "Clinic Name": "L'Elite Medispa and Wellness",
            "Address": "754 Nostrand Avenue, Brooklyn, NY 11216",
            "Borough": "Brooklyn",
            "Phone": "(347) 627-3374",
            # Services
            "Gender-Affirming Care": True,
            # Insurance
            "Accepts Medicaid": True,
        },

        # VOICE THERAPY
        {
            "Clinic Name": "Mount Sinai - Voice Therapy",
            "Address": "5 E 98th Street, 8th Floor, New York, NY 10029",
            "Borough": "Manhattan",
            "Phone": "(212) 241-9112",
            "Website": "https://www.mountsinai.org",
            # Services
            "Gender-Affirming Care": True,
            # Insurance
            "Accepts Medicaid": True,
            "Accepts Medicare": True,
        }
    ]

    print(f"Adding {len(providers_to_add)} AMIDA GIST specialty providers to Airtable...\n")

    added = 0
    for provider in providers_to_add:
        if add_clinic(provider):
            added += 1

    print(f"\n--- Done ---")
    print(f"Successfully added {added}/{len(providers_to_add)} providers")
    print("\nNext step: Run 'npm run fetch-data' to update clinics.geojson")


if __name__ == "__main__":
    main()
