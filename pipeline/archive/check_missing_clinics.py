import json

def load_geojson(path):
    with open(path, 'r') as f:
        return json.load(f)

def check_missing():
    try:
        geojson = load_geojson('public/clinics.geojson')
    except FileNotFoundError:
        print("❌ public/clinics.geojson not found.")
        return

    # Normalize names for fuzzy checking
    existing_names = [f['properties']['name'].lower() for f in geojson['features']]
    
    # Scrape names from GEMINI-RESEARCH.md
    research_names = []
    try:
        with open('docs/GEMINI-RESEARCH.md', 'r') as f:
            content = f.read()
            # Split by ### to find headers, crude but effective given the messy formatting
            parts = content.split('### ')
            for part in parts[1:]: # Skip preamble
                # Taking the first line of the split part as the name
                name = part.split('\n')[0].strip()
                if len(name) < 100: # Sanity check length
                    research_names.append(name)
    except FileNotFoundError:
        print("⚠️ docs/GEMINI-RESEARCH.md not found.")

    print(f"📄 Found {len(research_names)} clinics in research doc.")

    missing_count = 0
    print("\n🔍 Cross-referencing Research Doc vs Database:")
    for target in research_names:
        # Simple fuzzy match
        match = next((name for name in existing_names if target.lower() in name.lower() or name.lower() in target.lower()), None)
        if not match:
            print(f"  ❌ MISSING: {target}")
            missing_count += 1
        # else:
        #     print(f"  ✅ Found: {target}")

    print(f"\nSummary: {missing_count} clinics from research doc are missing in the database.")

if __name__ == "__main__":
    check_missing()
