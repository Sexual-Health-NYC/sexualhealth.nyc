import json

def load_geojson(path):
    with open(path, 'r') as f:
        return json.load(f)

def check_cpc():
    try:
        geojson = load_geojson('public/clinics.geojson')
    except FileNotFoundError:
        print("❌ public/clinics.geojson not found.")
        return

    # List of known CPC keywords and names
    cpc_list = [
        "Visitation Mission",
        "Avail NYC",
        "Good Counsel",
        "CompassCare",
        "TilmaCare",
        "Catholic Guardian",
        "New Beginnings",
        "Pregnancy Care Center",
        "EMC",
        "Expectant Mother",
        "Bridge to Life",
        "Life Center",
        "Crisis Pregnancy",
        "Resource Center", # Generic, but suspicious if not a known provider
        "AAA" # Often used to appear first in directories
    ]

    print(f"📊 Scanning {len(geojson['features'])} clinics for potential CPCs...")
    
    suspicious_count = 0
    for feature in geojson['features']:
        name = feature['properties']['name']
        address = feature['properties'].get('address', '')
        
        for cpc in cpc_list:
            if cpc.lower() in name.lower():
                print(f"  ⚠️  SUSPICIOUS: '{name}' matches '{cpc}'")
                suspicious_count += 1
                break # Only report once per clinic

    if suspicious_count == 0:
        print("✅ No obvious CPC names found in the database.")
    else:
        print(f"\nFound {suspicious_count} potential matches. Please verify manually.")

if __name__ == "__main__":
    check_cpc()
