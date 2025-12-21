import json
from collections import Counter

def load_geojson(path):
    with open(path, 'r') as f:
        return json.load(f)

def analyze_completeness():
    try:
        geojson = load_geojson('public/clinics.geojson')
    except FileNotFoundError:
        print("❌ public/clinics.geojson not found.")
        return

    features = geojson['features']
    total_clinics = len(features)
    
    print(f"📊 Analyzing {total_clinics} clinics...\n")

    missing_phones = []
    missing_hours = []
    missing_website = []
    missing_insurance = [] # Based on insurance_plans or verified status if available
    
    # Track verification status if available
    verification_status = Counter()

    for f in features:
        props = f['properties']
        name = props.get('name', 'Unknown')
        
        # Check Phone
        if not props.get('phone'):
            missing_phones.append(name)
            
        # Check Website
        if not props.get('website'):
            missing_website.append(name)
            
        # Check Hours (Structured or Text)
        has_structured_hours = props.get('hours') and len(props.get('hours')) > 0
        has_text_hours = props.get('hours_text') and len(props.get('hours_text')) > 0
        
        if not has_structured_hours and not has_text_hours:
            missing_hours.append(name)

        # Check Insurance (Naive check: accepts_medicaid/medicare are booleans, so always present)
        # We can check if insurance_plans array is empty, though that might just mean "accepts all" or "unknown"
        # Better: check "insurance_verified" field if it exists? 
        # Looking at schema: insurance_verified is a field.
        
        v_status = props.get('last_verified', 'Unverified') # or similar field?
        # Re-checking schema from fetch-airtable.js: last_verified is mapped.
        if not props.get('last_verified'):
             verification_status['Never Verified'] += 1
        else:
             verification_status['Verified'] += 1

    # Report
    print(f"📞 Missing Phone: {len(missing_phones)} ({len(missing_phones)/total_clinics:.1%})")
    if missing_phones:
        print(f"   Examples: {', '.join(missing_phones[:3])}...\n")

    print(f"\n🌐 Missing Website: {len(missing_website)} ({len(missing_website)/total_clinics:.1%})")
    
    print(f"\n⏰ Missing Hours: {len(missing_hours)} ({len(missing_hours)/total_clinics:.1%})")
    if missing_hours:
        print(f"   Examples: {', '.join(missing_hours[:3])}...\n")

    print(f"\n✅ Verification Status:")
    for status, count in verification_status.items():
        print(f"   - {status}: {count}")

    # Prioritization for Volunteers
    print("\n📋 Volunteer Focus Areas:")
    if len(missing_hours) > 0:
        print(f"   1. Call {len(missing_hours)} clinics to get operating hours (Highest Priority).")
    if len(missing_phones) > 0:
        print(f"   2. Find phone numbers for {len(missing_phones)} clinics (Critical for access).")
    
    print("\n🔍 Generating 'docs/VOLUNTEER_CALL_LIST.md'...")
    
    generate_call_list(missing_hours, missing_phones, features)

def generate_call_list(missing_hours, missing_phones, features):
    # Combine lists and unique
    targets = set(missing_hours + missing_phones)
    
    # Sort by name
    sorted_targets = sorted(list(targets))
    
    with open('docs/VOLUNTEER_CALL_LIST.md', 'w') as f:
        f.write("# Volunteer Call List\n\n")
        f.write("The following clinics have missing critical information (Hours or Phone). Please prioritize verifying these.\n\n")
        
        f.write("## 🚨 Missing Hours or Phone\n")
        for name in sorted_targets:
            # Find feature
            clinic = next((f for f in features if f['properties']['name'] == name), None)
            if not clinic: continue
            
            props = clinic['properties']
            phone = props.get('phone', '**MISSING**')
            website = props.get('website', 'N/A')
            
            f.write(f"### {name}\n")
            f.write(f"- **Phone:** {phone}\n")
            f.write(f"- **Website:** {website}\n")
            f.write(f"- **Missing:** ")
            issues = []
            if name in missing_hours: issues.append("Hours")
            if name in missing_phones: issues.append("Phone Number")
            f.write(", ".join(issues) + "\n\n")
            
            f.write(f"**Script:** \"Hi, I'm verifying information for a free NYC health directory. Could you please confirm your current operating hours?\"\n\n")
            f.write("---\n")

if __name__ == "__main__":
    analyze_completeness()
