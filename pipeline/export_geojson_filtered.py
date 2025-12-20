"""
Export only clinics with verified street addresses to GeoJSON.
Filters out records that were fuzzy-matched to wrong locations.
"""

import csv
import json


def has_street_address(address: str) -> bool:
    """Check if address contains a street number (starts with digits)."""
    if not address or not address.strip():
        return False

    first_word = address.strip().split()[0] if address.strip().split() else ''
    return any(char.isdigit() for char in first_word)


def create_geojson_feature(record: dict) -> dict:
    """Convert a clinic record to a GeoJSON feature."""

    lat = record.get('latitude', '').strip()
    lon = record.get('longitude', '').strip()

    if not lat or not lon:
        return None

    try:
        lat_float = float(lat)
        lon_float = float(lon)
    except ValueError:
        return None

    # GeoJSON feature
    return {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [lon_float, lat_float]  # GeoJSON is [lon, lat]
        },
        "properties": {
            "name": record.get('name', ''),
            "address": record.get('address', ''),
            "borough": record.get('borough', ''),
            "phone": record.get('phone', ''),
            "website": record.get('website', ''),
            "clinic_type": record.get('clinic_type', ''),
            "has_sti_testing": record.get('has_sti_testing', '') == 'true',
            "has_hiv_testing": record.get('has_hiv_testing', '') == 'true',
            "has_prep": record.get('has_prep', '') == 'true',
            "has_pep": record.get('has_pep', '') == 'true',
            "hours": record.get('hours', ''),
            "walk_in": record.get('walk_in', '') == 'true' if record.get('walk_in') else None,
            "data_source": record.get('data_source', ''),
            "notes": record.get('notes', '')
        }
    }


def main():
    """Export verified clinics to GeoJSON."""

    input_file = 'data/cleaned/combined_clinics_geocoded.csv'
    output_file = 'data/export/sexual_health_clinics_verified.geojson'

    print(f"📂 Reading {input_file}...")

    # Read geocoded records
    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        records = list(reader)

    print(f"✅ Loaded {len(records)} total records")

    # Filter to only records with street addresses
    verified = [r for r in records if has_street_address(r.get('address', ''))]

    print(f"🔍 Filtered to {len(verified)} with verified street addresses")
    print(f"   (Removed {len(records) - len(verified)} org names / fuzzy matches)\n")

    # Convert to GeoJSON features
    features = []

    for record in verified:
        feature = create_geojson_feature(record)
        if feature:
            features.append(feature)

    print(f"🗺️  Created {len(features)} GeoJSON features")

    # Create GeoJSON FeatureCollection
    geojson = {
        "type": "FeatureCollection",
        "features": features
    }

    # Write to file
    import os
    os.makedirs('data/export', exist_ok=True)

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(geojson, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Exported to {output_file}")
    print(f"📍 Total verified clinics: {len(features)}")

    # Summary by borough
    by_borough = {}
    for feature in features:
        borough = feature['properties']['borough'] or 'Unknown'
        by_borough[borough] = by_borough.get(borough, 0) + 1

    print("\n📊 By Borough:")
    for borough in sorted(by_borough.keys()):
        print(f"  - {borough}: {by_borough[borough]}")

    # Show clinic names
    print("\n📋 Verified Clinics:")
    for i, feature in enumerate(features, 1):
        name = feature['properties']['name']
        addr = feature['properties']['address']
        print(f"  {i:2d}. {name[:45]:45s} - {addr[:35]}")


if __name__ == "__main__":
    main()
