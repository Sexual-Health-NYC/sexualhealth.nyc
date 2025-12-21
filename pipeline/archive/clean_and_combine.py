"""
Clean and combine clinic data from multiple sources.

Inputs:
- data/raw/nyc_opendata_facilities.csv (124 records)
- data/seed_clinics.csv (8 DOH clinics)

Output:
- data/cleaned/combined_clinics.csv
"""

import csv
import json
from typing import List, Dict

# Standard field names for our schema
STANDARD_FIELDS = [
    'name', 'address', 'borough', 'latitude', 'longitude',
    'phone', 'website', 'clinic_type',
    'has_sti_testing', 'has_hiv_testing', 'has_prep', 'has_pep',
    'hours', 'walk_in', 'data_source', 'notes'
]


def read_csv_to_dicts(filepath: str) -> List[Dict]:
    """Read CSV file into list of dictionaries."""
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        return list(reader)


def normalize_nyc_opendata_record(record: Dict) -> Dict:
    """Normalize NYC Open Data record to our schema."""

    # Extract name from multiple possible fields
    name = (record.get('facilityname') or
            record.get('agency_name') or
            'Unknown Facility').strip()

    # Combine address if split
    address = record.get('address', '').strip()

    # Get coordinates
    lat = record.get('latitude', '').strip()
    lon = record.get('longitude', '').strip()

    # Phone from multiple possible fields
    phone = (record.get('phone_number') or
             record.get('contact_phone') or
             record.get('organization_phone', '')).strip()

    # Borough
    borough = record.get('borough', '').strip().title()

    # Build hours string from day columns
    hours_parts = []
    days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    for day in days:
        day_hours = record.get(f'hours_{day}', '').strip()
        if day_hours and day_hours.upper() not in ['', 'CLOSED', 'N/A']:
            hours_parts.append(f"{day.title()}: {day_hours}")

    hours = '; '.join(hours_parts) if hours_parts else ''

    # Service flags - infer from record content
    record_text = ' '.join(str(v).lower() for v in record.values() if v)
    has_hiv = 'hiv' in record_text or 'aids' in record_text
    has_sti = 'sti' in record_text or 'std' in record_text
    has_prep = 'prep' in record_text
    has_pep = 'pep' in record_text

    return {
        'name': name,
        'address': address,
        'borough': borough,
        'latitude': lat,
        'longitude': lon,
        'phone': phone,
        'website': record.get('website', '').strip(),
        'clinic_type': 'HIV Testing' if has_hiv else 'Sexual Health',
        'has_sti_testing': str(has_sti).lower(),
        'has_hiv_testing': str(has_hiv).lower(),
        'has_prep': str(has_prep).lower(),
        'has_pep': str(has_pep).lower(),
        'hours': hours,
        'walk_in': '',  # Not in this dataset
        'data_source': record.get('data_source', 'NYC Open Data'),
        'notes': record.get('additional_information', '').strip()
    }


def normalize_seed_record(record: Dict) -> Dict:
    """Normalize seed clinics to our schema."""
    return {
        'name': record.get('name', '').strip(),
        'address': record.get('address', '').strip(),
        'borough': record.get('borough', '').strip(),
        'latitude': '',  # Will geocode later
        'longitude': '',
        'phone': record.get('phone', '').strip(),
        'website': record.get('website', '').strip(),
        'clinic_type': record.get('clinic_type', 'DOH'),
        'has_sti_testing': 'true',  # DOH clinics all offer this
        'has_hiv_testing': 'true',
        'has_prep': 'true',
        'has_pep': 'true',
        'hours': '',  # Need to add manually
        'walk_in': 'true',  # Most DOH clinics are walk-in
        'data_source': record.get('data_source', 'Manual'),
        'notes': ''
    }


def main():
    """Combine and clean all data sources."""

    print("📂 Reading data sources...")

    # Read NYC Open Data
    opendata_records = read_csv_to_dicts('data/raw/nyc_opendata_facilities.csv')
    print(f"  - NYC Open Data: {len(opendata_records)} records")

    # Read seed clinics
    seed_records = read_csv_to_dicts('data/seed_clinics.csv')
    print(f"  - Seed clinics: {len(seed_records)} records")

    # Normalize all records
    print("\n🧹 Normalizing records...")
    normalized = []

    for record in opendata_records:
        normalized.append(normalize_nyc_opendata_record(record))

    for record in seed_records:
        normalized.append(normalize_seed_record(record))

    # Remove records with no name or address
    cleaned = [r for r in normalized if r['name'] and r['address']]
    print(f"  - Cleaned: {len(cleaned)} records (removed {len(normalized) - len(cleaned)} incomplete)")

    # Simple deduplication by name + address
    seen = set()
    deduplicated = []
    for record in cleaned:
        key = f"{record['name'].lower()}|{record['address'].lower()}"
        if key not in seen:
            seen.add(key)
            deduplicated.append(record)

    removed_dupes = len(cleaned) - len(deduplicated)
    print(f"  - Deduplicated: {len(deduplicated)} records (removed {removed_dupes} duplicates)")

    # Sort by borough, then name
    deduplicated.sort(key=lambda r: (r['borough'], r['name']))

    # Write output
    import os
    os.makedirs('data/cleaned', exist_ok=True)
    output_path = 'data/cleaned/combined_clinics.csv'

    with open(output_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=STANDARD_FIELDS)
        writer.writeheader()
        writer.writerows(deduplicated)

    print(f"\n✅ Saved {len(deduplicated)} clinics to {output_path}")

    # Summary by borough
    by_borough = {}
    for record in deduplicated:
        borough = record['borough'] or 'Unknown'
        by_borough[borough] = by_borough.get(borough, 0) + 1

    print("\n📊 By Borough:")
    for borough in sorted(by_borough.keys()):
        print(f"  - {borough}: {by_borough[borough]}")


if __name__ == "__main__":
    main()
