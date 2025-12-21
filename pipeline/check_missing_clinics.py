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

    # List of "Missing" clinics from research docs (now more comprehensive)
    target_clinics = [
        "Kings County", "Elmhurst", "Queens Hospital", "Harlem Hospital", "Coney Island",
        "South Brooklyn Health", "North Central Bronx", "Manhattan Women's Health",
        "Ambulatory Surgical Center", "SAGE", "Ali Forney", "Hetrick-Martin",
        "Planned Parenthood - Manhattan", "Margaret Sanger",
        # New from GEMINI-GENDER-AFFIRMING.md
        "Mount Sinai CTMS", "NYU Langone Health Transgender Health Program",
        "BronxCare Hospital Center", "Montefiore Medical Center (Center for Positive Living)",
        "Brookdale Hospital", "The Brooklyn Hospital Center", "Mount Sinai Beth Israel",
        "Mount Sinai Hospital"
    ]

    print(f"📊 Analyzing {len(existing_names)} existing clinics...")
    
    found_count = 0
    print("\n🔍 Checking for Priority Targets (from all research docs):")
    for target in target_clinics:
        match = next((name for name in existing_names if target.lower() in name.lower() or name.lower() in target.lower()), None)
        if match:
            print(f"  ✅ Found: {target} (matched '{match}')")
            found_count += 1
        else:
            print(f"  ❌ MISSING: {target}")

    print(f"\nSummary: Found {found_count} of {len(target_clinics)} targets.")

if __name__ == "__main__":
    check_missing()
