"""
Export geocoded clinics to GeoJSON format for ArcGIS.
"""

import csv
import json


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
            "walk_in": record.get('walk_in', '') == 'true',
            "data_source": record.get('data_source', ''),
            "notes": record.get('notes', '')
        }
    }


def main():
    """Export geocoded clinics to GeoJSON."""

    input_file = 'data/cleaned/combined_clinics_geocoded.csv'
    output_file = 'data/export/sexual_health_clinics.geojson'

    print(f"📂 Reading {input_file}...")

    # Read geocoded records
    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        records = list(reader)

    print(f"✅ Loaded {len(records)} records")

    # Convert to GeoJSON features
    features = []
    skipped = 0

    for record in records:
        feature = create_geojson_feature(record)
        if feature:
            features.append(feature)
        else:
            skipped += 1

    print(f"🗺️  Created {len(features)} features ({skipped} skipped - no coordinates)")

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
    print(f"📍 Total clinics: {len(features)}")

    # Summary by borough
    by_borough = {}
    for feature in features:
        borough = feature['properties']['borough'] or 'Unknown'
        by_borough[borough] = by_borough.get(borough, 0) + 1

    print("\n📊 By Borough:")
    for borough in sorted(by_borough.keys()):
        print(f"  - {borough}: {by_borough[borough]}")


if __name__ == "__main__":
    main()
