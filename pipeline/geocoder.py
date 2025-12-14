"""
NYC Planning Labs GeoSearch API client.

Superior to Nominatim for NYC because it returns:
- Official NYC standardized addresses
- BBL (Borough-Block-Lot) - immutable property ID, perfect for deduplication
- BIN (Building Identification Number)
- Correct borough handling (understands "New York, NY" = Manhattan)
"""

import requests
import time
import pandas as pd
import concurrent.futures
from tqdm import tqdm


def geocode_nyc_address(address_str: str) -> dict | None:
    """
    Query NYC Planning Labs GeoSearch API.

    Args:
        address_str: Raw address string (e.g., "100 Gold St, Manhattan")

    Returns:
        dict with standardized data, or None if no match found.
    """
    url = "https://geosearch.planninglabs.nyc/v2/search"

    params = {
        'text': address_str,
        'size': 1  # Best match only
    }

    try:
        response = requests.get(url, params=params, timeout=5)
        response.raise_for_status()
        data = response.json()

        if not data.get('features'):
            print(f"⚠️ No match for: {address_str}")
            return None

        best_match = data['features'][0]
        props = best_match['properties']
        geom = best_match['geometry']

        return {
            'clean_address': props.get('label'),
            'latitude': geom['coordinates'][1],
            'longitude': geom['coordinates'][0],
            'bbl': props.get('pad_bbl'),  # Borough-Block-Lot (unique property ID)
            'bin': props.get('pad_bin'),  # Building ID
            'match_type': props.get('layer')  # 'address', 'bbl', or 'place'
        }

    except requests.exceptions.RequestException as e:
        print(f"❌ Network error for {address_str}: {e}")
        return None
    except (KeyError, IndexError) as e:
        print(f"❌ Parse error for {address_str}: {e}")
        return None


def _fetch_row(row, address_col: str) -> dict:
    """Process a single row for geocoding."""
    address = row[address_col]

    if not isinstance(address, str) or not address.strip():
        return {}

    result = geocode_nyc_address(address)
    return result if result else {}


def batch_geocode_dataframe(
    df: pd.DataFrame,
    address_col: str = 'address',
    max_workers: int = 5
) -> pd.DataFrame:
    """
    Parallel geocode a dataframe.

    Args:
        df: Clinic data
        address_col: Name of address column
        max_workers: Parallel threads (keep <= 10 to be polite)

    Returns:
        Original dataframe with geodata columns attached
    """
    print(f"🌍 Geocoding {len(df)} records with {max_workers} threads...")

    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        rows = [row for _, row in df.iterrows()]

        # executor.map preserves input order
        results = list(tqdm(
            executor.map(lambda r: _fetch_row(r, address_col), rows),
            total=len(rows),
            desc="Geocoding"
        ))

    geo_df = pd.DataFrame(results)
    return pd.concat([df.reset_index(drop=True), geo_df], axis=1)


if __name__ == "__main__":
    # Test
    raw_addr = "100 gold street nyc"
    result = geocode_nyc_address(raw_addr)

    if result:
        print(f"Found: {result['clean_address']}")
        print(f"Lat/Lon: {result['latitude']}, {result['longitude']}")
        print(f"BBL (Unique ID): {result['bbl']}")
