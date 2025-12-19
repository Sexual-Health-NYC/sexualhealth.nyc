"""
Fetch health facility data from NYC Open Data using SODA API.

Relevant datasets:
- NYC Health + Hospitals locations
- DOHMH facilities
- Community health centers

API docs: https://dev.socrata.com/foundry/data.cityofnewyork.us/
"""

import requests
import csv
import json
import os
from typing import List, Dict

# SODA API base URL
BASE_URL = "https://data.cityofnewyork.us/resource"

# Dataset IDs (find these by browsing opendata.cityofnewyork.us)
DATASETS = {
    'hiv_testing': '72ss-25qh',  # HIV Testing Locations
    'hiv_services': 'pwts-g83w',  # DOHMH HIV Service Directory
    # Add more dataset IDs as we find them
}


def fetch_dataset(dataset_id: str, limit: int = 10000) -> List[Dict]:
    """
    Fetch a dataset from NYC Open Data.

    Args:
        dataset_id: Socrata dataset ID (e.g., 'f7b6-v6v3')
        limit: Max records to fetch (default 10k, max 50k without pagination)

    Returns:
        List of dictionaries with results
    """
    url = f"{BASE_URL}/{dataset_id}.json"

    params = {
        '$limit': limit,
        '$order': ':id'  # Consistent ordering
    }

    print(f"📥 Fetching dataset {dataset_id}...")

    try:
        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()

        print(f"✅ Fetched {len(data)} records from {dataset_id}")
        return data

    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to fetch {dataset_id}: {e}")
        return []


def filter_sexual_health_facilities(records: List[Dict]) -> List[Dict]:
    """
    Filter facilities that likely offer sexual health services.

    Look for keywords in facility names, types, or services.
    """
    if not records:
        return []

    # Keywords that suggest sexual health services
    keywords = [
        'sexual health',
        'std',
        'sti',
        'hiv',
        'planned parenthood',
        'reproductive',
        'family planning',
        'women\'s health',
        'lgbt',
        'community health'
    ]

    filtered = []
    for record in records:
        # Check all string values in the record
        record_text = ' '.join(str(v).lower() for v in record.values() if v)

        if any(keyword in record_text for keyword in keywords):
            filtered.append(record)

    print(f"🔍 Filtered to {len(filtered)} potential sexual health facilities")
    return filtered


def normalize_record(record: Dict, source_name: str) -> Dict:
    """
    Normalize a single record to match our schema.

    Map Socrata columns to our standardized field names.
    """
    # Column mapping (Socrata -> Our schema)
    column_map = {
        'facility_name': 'name',
        'location_name': 'name',
        'address_1': 'address',
        'location': 'address',
        'phone': 'phone',
        'latitude': 'latitude',
        'longitude': 'longitude',
    }

    normalized = {}
    for old_key, value in record.items():
        new_key = column_map.get(old_key, old_key)
        normalized[new_key] = value

    normalized['data_source'] = f'NYC Open Data: {source_name}'
    return normalized


def main():
    """Fetch and process NYC Open Data health facilities."""

    all_facilities = []

    for name, dataset_id in DATASETS.items():
        print(f"\n📊 Processing {name}...")

        # Fetch dataset
        records = fetch_dataset(dataset_id)

        if not records:
            continue

        # Filter for sexual health
        records = filter_sexual_health_facilities(records)

        # Normalize each record
        for record in records:
            normalized = normalize_record(record, name)
            all_facilities.append(normalized)

    if all_facilities:
        # Save to CSV
        output_path = 'data/raw/nyc_opendata_facilities.csv'
        os.makedirs(os.path.dirname(output_path), exist_ok=True)

        # Get all unique keys across all records
        fieldnames = set()
        for record in all_facilities:
            fieldnames.update(record.keys())
        fieldnames = sorted(fieldnames)

        with open(output_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(all_facilities)

        print(f"\n✅ Saved {len(all_facilities)} facilities to {output_path}")
        print(f"\nColumns: {fieldnames}")
    else:
        print("\n⚠️ No facilities found")


if __name__ == "__main__":
    main()
