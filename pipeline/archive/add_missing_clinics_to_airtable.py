import json
import os
import re
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

AIRTABLE_TOKEN = os.getenv("AIRTABLE_TOKEN")
BASE_ID = "app2GMlVxnjw6ifzz" # From scripts/fetch-airtable.js
CLINICS_TABLE_ID = "tblx7sVpDo17Hkmmr" # From scripts/fetch-airtable.js

if not AIRTABLE_TOKEN:
    print("Error: AIRTABLE_TOKEN not found in .env. Cannot add records to Airtable.")
    exit(1)

AIRTABLE_API_URL = f"https://api.airtable.com/v0/{BASE_ID}/{CLINICS_TABLE_ID}"
HEADERS = {
    "Authorization": f"Bearer {AIRTABLE_TOKEN}",
    "Content-Type": "application/json"
}

# --- Helper functions for parsing Markdown ---
def parse_clinic_block(block_text, clinic_name_from_header):
    clinic = {'Clinic Name': clinic_name_from_header}
    
    # Core Info fields
    for field, key in [
        ("Address", "Address"),
        ("Borough", "Borough"),
        ("Phone", "Phone"),
        ("Website", "Website"),
        ("Coordinates", "Coordinates")
    ]:
        match = re.search(rf"^\s*-\s*\*\*{field}:\s*\*\*\s*(.+)", block_text, re.MULTILINE)
        if match:
            clinic[key] = match.group(1).strip()
    
    # Handle coordinates
    if 'Coordinates' in clinic and clinic['Coordinates']:
        coords = clinic['Coordinates'].split(',')
        if len(coords) == 2:
            clinic['Latitude'] = float(coords[0].strip())
            clinic['Longitude'] = float(coords[1].strip())
        del clinic['Coordinates'] # Remove raw coordinates field

    # Organization & Clinic Type
    for field, key in [
        ("Organization", "Organization"),
        ("Clinic Type", "Clinic Type")
    ]:
        match = re.search(rf"^\s*\*\*{field}:\s*\*\*\s*(.+)", block_text, re.MULTILINE)
        if match:
            clinic[key] = match.group(1).strip()

    # Services (checkboxes)
    services_section_match = re.search(r"\*\*Services:\*\*\s*\n([\s\S]+?)(?=\*\*Insurance:\*\*|\Z)", block_text, re.MULTILINE)
    if services_section_match:
        services_list = services_section_match.group(1)
        for service_label, airtable_field in [
            ("STI Testing", "STI Testing"),
            ("HIV Testing", "HIV Testing"),
            ("PrEP", "PrEP"),
            ("PEP", "PEP"),
            ("Contraception", "Contraception"),
            ("Abortion", "Abortion"),
            ("Gender-Affirming Care", "Gender-Affirming Care"),
            ("Vaccines", "Vaccines"),
            ("Pregnancy Test", "Pregnancy Test") # from H+H Harlem doc
        ]:
            if re.search(rf"^\[x\] {service_label}", services_list):
                clinic[airtable_field] = True
            elif re.search(rf"^\[ \] *{service_label}", services_list): # Handle unchecked explicitly
                 clinic[airtable_field] = False
    
    # Abortion Details
    for field, key in [
        ("Medication abortion max weeks", "Abortion Medication Max Weeks"),
        ("Procedure abortion max weeks", "Abortion Procedure Max Weeks"),
    ]:
        match = re.search(rf"^\s*-\s*\*\*{field}:\s*\*\*\s*(\d+)", block_text, re.MULTILINE)
        if match:
            clinic[key] = int(match.group(1))

    offers_late_match = re.search(r"^\s*-\s*\*\*Offers late-term \(20\+ weeks\):\*\*\s*(Yes|No)", block_text, re.MULTILINE)
    if offers_late_match:
        clinic["Offers Late-Term (20+ weeks)"] = (offers_late_match.group(1).lower() == 'yes')

    # Insurance
    insurance_section_match = re.search(r"\*\*Insurance:\*\*\s*\n([\s\S]+?)(?=\*\*Access:\*\*|\Z)", block_text, re.MULTILINE)
    if insurance_section_match:
        insurance_list = insurance_section_match.group(1)
        for insurance_label, airtable_field in [
            ("Accepts Medicaid", "Accepts Medicaid"),
            ("Accepts Medicare", "Accepts Medicare"),
            ("Sliding Scale", "Sliding Scale"),
            ("No Insurance OK", "No Insurance OK")
        ]:
            if re.search(rf"^\s*-\s*{insurance_label}: (Yes|No)", insurance_list, re.MULTILINE):
                clinic[airtable_field] = (re.search(rf"^\s*-\s*{insurance_label}: (Yes|No)", insurance_list, re.MULTILINE).group(1).lower() == 'yes')

    # Access
    access_section_match = re.search(r"\*\*Access:\*\*\s*\n([\s\S]+?)(?=\*\*Special:\*\*|\Z)", block_text, re.MULTILINE)
    if access_section_match:
        access_list = access_section_match.group(1)
        for access_label, airtable_field in [
            ("Walk-ins", "Walk-ins OK"),
            ("Appointment Required", "Appointment Only")
        ]:
             if re.search(rf"^\s*-\s*{access_label}: (Yes|No)", access_list, re.MULTILINE):
                clinic[airtable_field] = (re.search(rf"^\s*-\s*{access_label}: (Yes|No)", access_list, re.MULTILINE).group(1).lower() == 'yes')
        
        # Hours is now structured and linked, not a simple field
        hours_match = re.search(r"^\s*-\s*Hours:\s*(.+)", access_list, re.MULTILINE)
        if hours_match:
            clinic['Hours_text_legacy'] = hours_match.group(1).strip() # Store for notes or if needed later

    # Special
    special_section_match = re.search(r"\*\*Special:\*\*\s*\n([\s\S]+?)(?=\*\*Sources:\*\*|\Z)", block_text, re.MULTILINE)
    if special_section_match:
        special_list = special_section_match.group(1)
        for special_label, airtable_field in [
            ("LGBTQ+ Focused", "LGBTQ+ Focused"),
            ("Youth Friendly", "Youth Friendly"),
            ("Anonymous Testing", "Anonymous Testing")
        ]:
            if re.search(rf"^\s*-\s*{special_label}: (Yes|No)", special_list, re.MULTILINE):
                clinic[airtable_field] = (re.search(rf"^\s*-\s*{special_label}: (Yes|No)", special_list, re.MULTILINE).group(1).lower() == 'yes')

    # Notes
    notes_match = re.search(r"^\s*-\s*\*\*Notes:\*\*\s*(.+)", block_text, re.MULTILINE)
    if notes_match:
        clinic['Notes'] = notes_match.group(1).strip()
    
    # Data Sources
    data_sources_match = re.search(r"^\s*-\s*\*\*Sources:\*\*\s*\n([\s\S]+?)(?=\*\*Confidence:\*\*|\Z)", block_text, re.MULTILINE)
    if data_sources_match:
        sources_text = data_sources_match.group(1).strip()
        # Clean up bullet points to make it a readable string
        clinic['Data Sources'] = re.sub(r"^\d+\.\s*", "", sources_text, flags=re.MULTILINE).replace('\n', '; ')

    return clinic

def add_clinic_to_airtable(clinic_data):
    print(f"Attempting to add: {clinic_data.get('Clinic Name', 'Unknown Clinic')}")
    
    # Construct fields for Airtable
    fields = {}
    for key, value in clinic_data.items():
        if key == 'Clinic Name' and not value: continue # Must have a name
        
        # Checkboxes are booleans, numbers are ints/floats
        if key in ["STI Testing", "HIV Testing", "PrEP", "PEP", "Contraception", "Abortion", 
                   "Gender-Affirming Care", "Vaccines", "Pregnancy Test",
                   "Medication Abortion", "In-Clinic Abortion", "Offers Late-Term (20+ weeks)",
                   "Accepts Medicaid", "Accepts Medicare", "Sliding Scale", "No Insurance OK",
                   "Walk-ins OK", "Appointment Only", "LGBTQ+ Focused", "Youth Friendly", "Anonymous Testing"]:
            fields[key] = bool(value)
        elif key in ["Abortion Medication Max Weeks", "Abortion Procedure Max Weeks", "Latitude", "Longitude"]:
            fields[key] = float(value) if isinstance(value, (int, float)) else None # Ensure number type
        elif key == "Notes":
            # Append Hours_text_legacy to Notes if it exists
            notes_val = value
            if 'Hours_text_legacy' in clinic_data and clinic_data['Hours_text_legacy']:
                notes_val += f" (Legacy Hours Text: {clinic_data['Hours_text_legacy']})"
            fields[key] = notes_val
        elif key == 'Hours_text_legacy': # Don't add directly, it's merged into notes
            pass
        elif value is not None and value != '': # General string/other fields
            fields[key] = str(value)
    
    if not fields.get('Clinic Name'):
        print(f"  Skipping record due to missing Clinic Name: {clinic_data}")
        return

    # Airtable API expects { "records": [ { "fields": { ... } } ] }
    payload = {
        "records": [
            {
                "fields": fields
            }
        ]
    }

    try:
        response = requests.post(AIRTABLE_API_URL, headers=HEADERS, json=payload)
        response.raise_for_status() # Raise an exception for HTTP errors
        print(f"  ✅ Successfully added: {clinic_data.get('Clinic Name')} (ID: {response.json()['records'][0]['id']})")
        return response.json()['records'][0]['id']
    except requests.exceptions.RequestException as e:
        print(f"  ❌ Error adding {clinic_data.get('Clinic Name')}: {e}")
        if e.response:
            print(f"    Response: {e.response.text}")
        return None

def main():
    if not AIRTABLE_TOKEN:
        print("Error: AIRTABLE_TOKEN not found. Exiting.")
        return

    try:
        with open('docs/MISSING_CLINICS.md', 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print("Error: docs/MISSING_CLINICS.md not found. Ensure the file exists.")
        return

    # Split the markdown by clinic entry header (e.g., "## 1. Clinic Name")
    # This will give a list where the first element is preamble, and subsequent are clinic blocks
    clinic_blocks = re.split(r"^\s*##\s*\d+\.\s*.+\n\s*\*(Status: Ready to Add|Status: Needs Research)\*\s*\n*", content, flags=re.MULTILINE)
    
    # The first element is usually preamble before the first clinic, so skip it.
    # The split also captures the status line, so blocks will be alternating clinic details and then status.
    
    clinics_to_process = []
    
    # Iterate through the split parts to reconstruct proper clinic blocks
    # split result: [preamble, "1. Apicha\n*Status: Ready to Add*\n", "block content", "2. CHCR\n*Status: Ready to Add*\n", "block content", ...]
    # So we want to process every other item starting from index 1.
    
    # Iterate through the blocks, assuming the structure is: [preamble, title_and_status_block_1, clinic_details_block_1, title_and_status_block_2, clinic_details_block_2, ...]
    # My re.split was not quite right.
    
    # Let's use a simpler regex to find each clinic's full text block
    clinic_entries_raw = re.findall(r"(^\s*##\s*\d+\.\s*.+?)(?=(^\s*##\s*\d+\.|\Z))", content, re.MULTILINE | re.DOTALL)
    
    # Each entry will be a tuple like (full_block_text, next_header_or_empty)
    # I need to extract the full block content.
    
    # Split the markdown by clinic entry header (e.g., "## 1. Apicha...")
    clinic_entries_raw = re.split(r"^\s*##\s*\d+\.\s*", content, flags=re.MULTILINE)
    # The first element will be the preamble, discard it
    clinic_entries_raw = [block.strip() for block in clinic_entries_raw if block.strip()]

    print(f"Found {len(clinic_entries_raw)} clinic entries in MISSING_CLINICS.md.")

    added_count = 0

    for clinic_block_text in clinic_entries_raw:
        # Extract clinic name from the first line of the block (which is the title)
        clinic_title_match = re.match(r"(.+?)\n", clinic_block_text)
        clinic_title = clinic_title_match.group(1).strip() if clinic_title_match else "Unknown Clinic"
        
        status_match = re.search(r"^\s*\*(Status: Ready to Add)\*", clinic_block_text, re.MULTILINE)

        if status_match:
            print(f"\nProcessing: {clinic_title} ({status_match.group(1)})")
            
            clinic_data = parse_clinic_block(clinic_block_text, clinic_title) 
            if clinic_data.get('Clinic Name'):
                airtable_record_id = add_clinic_to_airtable(clinic_data)
                if airtable_record_id:
                    added_count += 1
            else:
                print(f"  Skipping '{clinic_title}' due to parsing error (Clinic Name missing in parsed data).")
        else:
            print(f"\nSkipping: {clinic_title} (Status: Needs Research)")


    print(f"\n--- Script Finished ---")
    print(f"Attempted to add {added_count} clinics to Airtable.")

if __name__ == "__main__":
    main()
