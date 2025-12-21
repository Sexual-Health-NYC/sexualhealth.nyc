import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

AIRTABLE_TOKEN = os.getenv("AIRTABLE_TOKEN")
BASE_ID = "app2GMlVxnjw6ifzz"
CLINICS_TABLE_ID = "tblx7sVpDo17Hkmmr"

if not AIRTABLE_TOKEN:
    print("Error: AIRTABLE_TOKEN not found.")
    exit(1)

HEADERS = {
    "Authorization": f"Bearer {AIRTABLE_TOKEN}",
    "Content-Type": "application/json"
}

def fetch_all_records():
    records = []
    offset = None
    while True:
        url = f"https://api.airtable.com/v0/{BASE_ID}/{CLINICS_TABLE_ID}?pageSize=100"
        if offset:
            url += f"&offset={offset}"
        response = requests.get(url, headers=HEADERS)
        data = response.json()
        records.extend(data.get('records', []))
        offset = data.get('offset')
        if not offset:
            break
    return records

def update_record(record_id, fields):
    url = f"https://api.airtable.com/v0/{BASE_ID}/{CLINICS_TABLE_ID}/{record_id}"
    response = requests.patch(url, headers=HEADERS, json={"fields": fields})
    if response.status_code == 200:
        print(f"✅ Updated {record_id}")
    else:
        # Ignore errors if field doesn't exist yet (user hasn't added schema)
        if "UNKNOWN_FIELD_NAME" in response.text:
            print(f"⚠️  Skipping {record_id} - Field missing in Airtable schema")
        else:
            print(f"❌ Failed to update {record_id}: {response.text}")

def main():
    records = fetch_all_records()
    print(f"Processing {len(records)} records...")

    for record in records:
        f = record['fields']
        name = f.get('Clinic Name', '')
        org = f.get('Organization', '')
        updates = {}

        # 1. PrEP-AP Registered
        # Known PrEP-AP providers (broad categories)
        is_prep_ap = False
        prep_ap_keywords = [
            "Callen-Lorde", "Planned Parenthood", "Community Healthcare Network", "CHN",
            "Housing Works", "Apicha", "Institute for Family Health", "Ryan", 
            "Charles B. Wang", "GMHC", "Mount Sinai", "NYC Health + Hospitals",
            "Harlem United", "Betances", "Damian", "Pride Health Center"
        ]
        
        if any(k.lower() in name.lower() or k.lower() in org.lower() for k in prep_ap_keywords):
            is_prep_ap = True
        
        # Private/Commercial likely NO
        if any(k in name for k in ["Parkmed", "Abortion", "Gynecology", "Labtek", "Early Options"]):
            is_prep_ap = False

        if is_prep_ap:
            updates["PrEP-AP Registered"] = True

        # 2. Gender Affirming Care (Youth)
        # Specific known youth providers
        is_youth_gac = False
        if any(k in name for k in ["HOTT", "The Door", "Adolescent", "Lincoln (Teen", "Judson", "Jacobi"]):
            is_youth_gac = True
        
        if is_youth_gac:
            updates["Gender Affirming Care (Youth)"] = True

        # 3. Gender Affirming Surgery
        is_surgery = False
        if any(k in name for k in ["Lincoln", "Metropolitan", "Mount Sinai CTMS", "NYU Langone"]):
             is_surgery = True
        
        if is_surgery:
            updates["Gender Affirming Surgery"] = True

        # 4. Gender Affirming Hormones
        # If they have "Gender-Affirming Care" checked, assume Hormones is the baseline
        if f.get("Gender-Affirming Care"):
            updates["Gender Affirming Hormones"] = True

        # Apply updates if any
        if updates:
            update_record(record['id'], updates)

if __name__ == "__main__":
    main()
