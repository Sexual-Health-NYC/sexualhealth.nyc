import os
import requests
from dotenv import load_dotenv

load_dotenv()

AIRTABLE_TOKEN = os.getenv("AIRTABLE_TOKEN")
BASE_ID = "app2GMlVxnjw6ifzz"
CLINICS_TABLE_ID = "tblx7sVpDo17Hkmmr"

if not AIRTABLE_TOKEN:
    print("Error: AIRTABLE_TOKEN not found.")
    exit(1)

def delete_record(record_id):
    url = f"https://api.airtable.com/v0/{BASE_ID}/{CLINICS_TABLE_ID}/{record_id}"
    headers = {
        "Authorization": f"Bearer {AIRTABLE_TOKEN}"
    }
    
    print(f"Deleting record {record_id}...")
    response = requests.delete(url, headers=headers)
    
    if response.status_code == 200:
        print(f"✅ Successfully deleted record {record_id}")
        return True
    else:
        print(f"❌ Failed to delete record. Status: {response.status_code}")
        print(response.text)
        return False

if __name__ == "__main__":
    # Mobilization for Justice, Inc.
    record_id_to_delete = "recU5F677vGQdr3CO" 
    delete_record(record_id_to_delete)
