"""
Geocode clinics missing coordinates using NYC GeoSearch API.
"""

import csv
import sys
from geocoder import geocode_nyc_address

def main():
    """Geocode all clinics missing coordinates."""

    input_file = 'data/cleaned/combined_clinics.csv'
    output_file = 'data/cleaned/combined_clinics_geocoded.csv'

    print(f"📂 Reading {input_file}...")

    # Read all records
    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        records = list(reader)
        fieldnames = reader.fieldnames

    print(f"✅ Loaded {len(records)} records")

    # Count missing coordinates
    missing = [r for r in records if not r.get('latitude') or not r.get('longitude')]
    print(f"🌍 Need to geocode {len(missing)} records\n")

    geocoded_count = 0
    failed_count = 0

    for i, record in enumerate(records, 1):
        # Skip if already has coordinates
        if record.get('latitude') and record.get('longitude'):
            continue

        address = record.get('address', '').strip()
        if not address:
            print(f"⚠️  [{i}/{len(records)}] {record.get('name', 'Unknown')} - No address")
            failed_count += 1
            continue

        # Add borough to address for better matching
        borough = record.get('borough', '').strip()
        if borough:
            full_address = f"{address}, {borough}, NY"
        else:
            full_address = f"{address}, New York, NY"

        print(f"🔍 [{i}/{len(records)}] Geocoding: {record.get('name', 'Unknown')[:40]}...")

        result = geocode_nyc_address(full_address)

        if result:
            record['latitude'] = str(result['latitude'])
            record['longitude'] = str(result['longitude'])

            # Update address to standardized version if we got one
            if result.get('clean_address'):
                print(f"   ✅ Found: {result['clean_address']}")

            # Store BBL if available (for deduplication later)
            if result.get('bbl') and 'bbl' in fieldnames:
                record['bbl'] = result['bbl']

            geocoded_count += 1
        else:
            failed_count += 1

    print(f"\n📊 Geocoding complete:")
    print(f"   ✅ Success: {geocoded_count}")
    print(f"   ❌ Failed: {failed_count}")

    # Write output
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(records)

    print(f"\n✅ Saved to {output_file}")

    # Final count
    with_coords = sum(1 for r in records if r.get('latitude') and r.get('longitude'))
    print(f"📍 Total with coordinates: {with_coords}/{len(records)}")

if __name__ == "__main__":
    main()
