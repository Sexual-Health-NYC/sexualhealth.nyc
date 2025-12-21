import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

AIRTABLE_TOKEN = os.getenv("AIRTABLE_TOKEN")
BASE_ID = "app2GMlVxnjw6ifzz"
HOURS_TABLE_ID = "tblp2gxzk6xGeDtnI" # From scripts/fetch-airtable.js

if not AIRTABLE_TOKEN:
    print("Error: AIRTABLE_TOKEN not found.")
    exit(1)

def add_hours(clinic_id, days, open_time, close_time, department="General"):
    url = f"https://api.airtable.com/v0/{BASE_ID}/{HOURS_TABLE_ID}"
    headers = {
        "Authorization": f"Bearer {AIRTABLE_TOKEN}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "records": [
            {
                "fields": {
                    "Clinic": [clinic_id], # Link to clinic
                    "Days of Week": days,
                    "Open Time": open_time,
                    "Close Time": close_time,
                    "Department": department,
                    "All Day": False
                }
            }
        ]
    }
    
    print(f"Adding hours for clinic {clinic_id}...")
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        print(f"✅ Successfully added hours record: {response.json()['records'][0]['id']}")
        return True
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to add hours. Status: {e.response.status_code if e.response else 'Unknown'}")
        print(e.response.text if e.response else str(e))
        return False

if __name__ == "__main__":
    # Ryan Chelsea-Clinton Community Health Center
    CLINIC_ID = "recdHRE6efIR8vQJ5" 
    
    schedules = [
        {
            "days": ["Mon", "Tue", "Thu"],
            "open": "08:30",
            "close": "19:00"
        },
        {
            "days": ["Wed", "Fri"],
            "open": "08:30",
            "close": "16:30"
        },
        {
            "days": ["Sat"],
            "open": "09:30",
            "close": "13:00"
        }
    ]
    
    for s in schedules:
        add_hours(CLINIC_ID, s["days"], s["open"], s["close"])
