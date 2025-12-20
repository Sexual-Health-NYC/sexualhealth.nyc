# Airtable Data Cleanup Instructions

## Overview

We're building a sexual health clinic finder for NYC. Clinic data is stored in Airtable as the canonical database. The data has been loaded but needs cleaning, deduplication, and geocoding.

## Airtable Access

```
Base ID: app2GMlVxnjw6ifzz
Table ID: tblx7sVpDo17Hkmmr
Table Name: Clinics
Token: stored in .env as AIRTABLE_TOKEN
```

Load token with:

```python
TOKEN = open("/Users/neil/personal/sexualhealth.nyc/.env").read().split("=")[1].strip()
```

## Current State

- **159 total records** loaded from:

  - NYC Open Data (HIV testing locations, DOH clinics)
  - Planned Parenthood Project xlsx (detailed service/insurance data)

- **Data quality issues:**
  - 62 records have bad addresses (org name repeated instead of street address)
  - Only 65 records have lat/long coordinates
  - Many duplicates by name (e.g., "Community Healthcare Network" 16x)
  - Only 106 have phone numbers

## Cleanup Tasks

### 1. Delete Bad Address Records

62 records have the organization name in the address field instead of a real street address. These are useless without geocodable addresses.

**How to identify:**

```python
# Bad address = clinic name appears within the address field
name = record["fields"].get("Clinic Name", "").strip().lower()
addr = record["fields"].get("Address", "").strip().lower()
is_bad = name and name in addr
```

**Delete via API:**

```python
import requests

headers = {"Authorization": f"Bearer {TOKEN}"}
url = f"https://api.airtable.com/v0/{BASE_ID}/{TABLE_ID}/{record_id}"
requests.delete(url, headers=headers)
```

Airtable allows batch delete of up to 10 records:

```python
url = f"https://api.airtable.com/v0/{BASE_ID}/{TABLE_ID}"
params = {"records[]": [id1, id2, ...]}  # max 10
requests.delete(url, headers=headers, params=params)
```

### 2. Deduplicate Records

After removing bad addresses, dedupe remaining records.

**Deduplication keys (in priority order):**

1. **Phone number** - most reliable, normalize to E.164 first
2. **Address** - after geocoding, use BBL (Borough-Block-Lot)
3. **Name + Borough** - fuzzy match within same borough

**Strategy:**

- Group by phone number, merge records with same phone
- For records without phone, group by normalized address
- When merging, keep the record with more fields populated

### 3. Geocode Missing Coordinates

~30 records have real addresses but no lat/long.

**Use NYC Planning Labs GeoSearch (free, no API key):**

```python
import requests

def geocode(address):
    url = f"https://geosearch.planninglabs.nyc/v2/search"
    params = {"text": address}
    r = requests.get(url, params=params)
    data = r.json()
    if data.get("features"):
        feat = data["features"][0]
        coords = feat["geometry"]["coordinates"]  # [lng, lat]
        props = feat["properties"]
        return {
            "longitude": coords[0],
            "latitude": coords[1],
            "bbl": props.get("addendum", {}).get("pad", {}).get("bbl"),
            "normalized_address": props.get("label")
        }
    return None
```

**Update Airtable record:**

```python
url = f"https://api.airtable.com/v0/{BASE_ID}/{TABLE_ID}/{record_id}"
payload = {
    "fields": {
        "Latitude": lat,
        "Longitude": lng,
        "Borough-Block-Lot": bbl,
        "Address": normalized_address  # optional: replace with standardized
    }
}
requests.patch(url, headers=headers, json=payload)
```

### 4. Get BBL for All Records

BBL (Borough-Block-Lot) is NYC's unique property identifier. Use it for final deduplication - if two records have the same BBL, they're at the same building.

Run geocoder on all records that have addresses but no BBL.

### 5. Final Dedup by BBL

After all records have BBL:

```python
# Group by BBL
by_bbl = {}
for rec in records:
    bbl = rec["fields"].get("Borough-Block-Lot")
    if bbl:
        by_bbl.setdefault(bbl, []).append(rec)

# Merge duplicates
for bbl, recs in by_bbl.items():
    if len(recs) > 1:
        # Merge into one, delete others
        pass
```

## Airtable Schema Reference

Key fields to populate:

| Field             | Type   | Notes                                                   |
| ----------------- | ------ | ------------------------------------------------------- |
| Clinic Name       | text   | Primary field                                           |
| Address           | text   | Street address                                          |
| Borough           | select | Manhattan, Brooklyn, Queens, Bronx, Staten Island       |
| Phone             | phone  | E.164 format preferred                                  |
| Website           | url    |                                                         |
| Latitude          | number | 8 decimal precision                                     |
| Longitude         | number | 8 decimal precision                                     |
| Borough-Block-Lot | text   | NYC property ID from geocoder                           |
| Organization      | select | Planned Parenthood, Callen-Lorde, NYC Health Dept, etc. |
| Data Sources      | text   | Track provenance                                        |

Service checkboxes: STI Testing, HIV Testing, PrEP, PEP, Contraception, Abortion, Gender-Affirming Care, Vaccines

Insurance: Accepts Medicaid, Accepts Medicare, Sliding Scale, No Insurance OK, Insurance Plans Accepted (multiselect with 45 options)

## API Examples

**Fetch all records:**

```python
import requests

headers = {"Authorization": f"Bearer {TOKEN}"}
url = f"https://api.airtable.com/v0/{BASE_ID}/{TABLE_ID}"

all_records = []
offset = None
while True:
    params = {"pageSize": 100}
    if offset:
        params["offset"] = offset
    r = requests.get(url, headers=headers, params=params)
    data = r.json()
    all_records.extend(data.get("records", []))
    offset = data.get("offset")
    if not offset:
        break
```

**Update a record:**

```python
url = f"https://api.airtable.com/v0/{BASE_ID}/{TABLE_ID}/{record_id}"
payload = {"fields": {"Latitude": 40.7128, "Longitude": -74.0060}}
requests.patch(url, headers=headers, json=payload)
```

**Batch update (max 10):**

```python
url = f"https://api.airtable.com/v0/{BASE_ID}/{TABLE_ID}"
payload = {
    "records": [
        {"id": "rec123", "fields": {"Latitude": 40.71}},
        {"id": "rec456", "fields": {"Latitude": 40.72}},
    ]
}
requests.patch(url, headers=headers, json=payload)
```

**Delete records:**

```python
# Single
requests.delete(f"{url}/{record_id}", headers=headers)

# Batch (max 10) - use query params
params = {"records[]": ["rec123", "rec456"]}
requests.delete(url, headers=headers, params=params)
```

## Expected Outcome

After cleanup:

- ~50-80 unique, verified clinic records
- All records have lat/long coordinates
- All records have BBL for deduplication
- No duplicate clinics
- Clean, geocoded addresses

## Files

- `.env` - Airtable token
- `docs/PLAN.md` - Full project spec with data schema
- `pipeline/geocoder.py` - Existing geocoding code (uses NYC GeoSearch)
- `data/cleaned/combined_clinics_geocoded.csv` - Source CSV data
- `~/Desktop/Planned Parenthood Project.xlsx` - Source xlsx with detailed PP data
