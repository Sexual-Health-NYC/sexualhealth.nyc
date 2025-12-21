#!/usr/bin/env python3
"""
Add missing specialty clinics to Airtable.

These clinics were identified in GEMINI-GENDER-AFFIRMING.md research
and marked as ADDED in MISSING_CLINICS.md but were not actually in Airtable.
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
        response.raise_for_status()
        record_id = response.json()['records'][0]['id']
        print(f"  ✅ Added with ID: {record_id}")
        return record_id
    except requests.exceptions.RequestException as e:
        print(f"  ❌ Error: {e}")
        if hasattr(e, 'response') and e.response:
            print(f"     Response: {e.response.text}")
        return None


def main():
    if not AIRTABLE_TOKEN:
        print("Error: AIRTABLE_TOKEN not found in .env")
        return

    # Define the missing specialty clinics
    clinics_to_add = [
        {
            "Clinic Name": "Mount Sinai Center for Transgender Medicine and Surgery (CTMS)",
            "Address": "275 7th Avenue, 12th Floor, New York, NY 10001",
            "Borough": "Manhattan",
            "Phone": "(212) 604-1730",
            "Website": "https://www.mountsinai.org/care/transgender-medicine",
            "Organization": "Mount Sinai",
            "Clinic Type": "Hospital",
            # Services
            "Gender-Affirming Care": True,
            "STI Testing": True,
            "HIV Testing": True,
            "PrEP": True,
            "PEP": True,
            # Gender Affirming Details
            "Gender Affirming Hormones": True,
            "Gender Affirming Surgery": True,
            # Insurance
            "Accepts Medicaid": True,
            "Accepts Medicare": True,
            "Sliding Scale": False,
            "No Insurance OK": False,
            # Special
            "LGBTQ+ Focused": True,
            # Notes
            "Data Sources": "GEMINI-GENDER-AFFIRMING.md research (Dec 2024); Mount Sinai website"
        },
        {
            "Clinic Name": "NYU Langone Transgender Health Program",
            "Address": "550 First Avenue, New York, NY 10016",
            "Borough": "Manhattan",
            "Phone": "(646) 929-7875",
            "Website": "https://nyulangone.org/locations/transgender-health-program",
            "Organization": "NYU Langone Health",
            "Clinic Type": "Hospital",
            # Services
            "Gender-Affirming Care": True,
            "STI Testing": True,
            "HIV Testing": True,
            "PrEP": True,
            "PEP": True,
            "Contraception": True,
            # Gender Affirming Details
            "Gender Affirming Hormones": True,
            "Gender Affirming Surgery": True,
            # Insurance
            "Accepts Medicaid": True,
            "Accepts Medicare": True,
            "Sliding Scale": False,
            "No Insurance OK": False,
            # Special
            "LGBTQ+ Focused": True,
            # Notes
            "Data Sources": "GEMINI-GENDER-AFFIRMING.md research (Dec 2024); NYU Langone website"
        },
        {
            "Clinic Name": "NYU Langone Hassenfeld Children's Hospital - Transgender Youth Health Program",
            "Address": "One Park Avenue, 7th Floor, New York, NY 10016",
            "Borough": "Manhattan",
            "Phone": "(212) 263-5940",
            "Website": "https://nyulangone.org/locations/hassenfeld-childrens-hospital/transgender-youth-health-program",
            "Organization": "NYU Langone Health",
            "Clinic Type": "Hospital",
            # Services
            "Gender-Affirming Care": True,
            # Gender Affirming Details
            "Gender Affirming Hormones": True,
            "Gender Affirming Care (Youth)": True,
            # Insurance
            "Accepts Medicaid": True,
            "Accepts Medicare": True,
            "Sliding Scale": False,
            "No Insurance OK": False,
            # Special
            "LGBTQ+ Focused": True,
            "Youth Friendly": True,
            # Notes
            "Data Sources": "GEMINI-GENDER-AFFIRMING.md research (Dec 2024); NYU Langone website"
        }
    ]

    print(f"Adding {len(clinics_to_add)} specialty clinics to Airtable...\n")

    added = 0
    for clinic in clinics_to_add:
        if add_clinic(clinic):
            added += 1

    print(f"\n--- Done ---")
    print(f"Successfully added {added}/{len(clinics_to_add)} clinics")
    print("\nRun 'npm run fetch-data' to update clinics.geojson")


if __name__ == "__main__":
    main()
