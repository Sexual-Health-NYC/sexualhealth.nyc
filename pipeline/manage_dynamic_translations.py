import json
import os
import sys
from dotenv import load_dotenv

load_dotenv()

# Supported languages
LANGUAGES = [
    'en', 'es', 'zh', 'ru', 'bn', 'ht', 'fr', 'ar', 'ko', 
    'it', 'tl', 'pl', 'ur', 'el', 'he', 'hi', 'ja', 'yi', 'pt', 'vi'
]

TARGET_FIELDS = [
    'clinic_type',
    'abortion_medication_limit',
    'abortion_procedure_limit',
    'nearest_subway',
    'nearest_bus'
]

def load_geojson(path):
    with open(path, 'r') as f:
        return json.load(f)

def load_translations(lang):
    path = f'src/locales/{lang}/dynamic.json'
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return {}
    return {}

def save_translations(lang, data):
    path = f'src/locales/{lang}/dynamic.json'
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def extract_strings(geojson):
    strings = set()
    for feature in geojson['features']:
        props = feature['properties']
        for field in TARGET_FIELDS:
            val = props.get(field)
            if val and isinstance(val, str) and val.strip():
                strings.add(val.strip())
        
        # Special handling for structured hours
        hours = props.get('hours')
        if hours and isinstance(hours, list):
            for h in hours:
                dept = h.get('department')
                if dept and dept.strip():
                    strings.add(dept.strip())
                note = h.get('notes')
                if note and note.strip():
                    strings.add(note.strip())
    return strings

def main():
    print("🔍 Harvesting dynamic strings from public/clinics.geojson...")
    try:
        geojson = load_geojson('public/clinics.geojson')
    except FileNotFoundError:
        print("❌ public/clinics.geojson not found. Run 'npm run fetch-data' first.")
        return

    current_strings = extract_strings(geojson)
    print(f"✅ Found {len(current_strings)} unique strings in target fields.")
    
    # Load English (source of truth for keys)
    en_translations = load_translations('en')
    
    # Identify missing in English (new strings)
    missing = []
    for s in current_strings:
        if s not in en_translations:
            missing.append(s)
            
    print(f"📊 Missing translations (new): {len(missing)}")
    
    if not missing:
        # Check other languages for completeness
        print("  Checking coverage for other languages...")
        for lang in LANGUAGES:
            if lang == 'en': continue
            t = load_translations(lang)
            missing_in_lang = [s for s in current_strings if s not in t]
            if missing_in_lang:
                print(f"  ⚠️  {lang}: missing {len(missing_in_lang)} strings")
            else:
                pass # print(f"  ✅ {lang}: complete")
        return

    print("\n📝 New strings found:")
    for s in missing:
        print(f"  - {s[:50]}..." if len(s) > 50 else f"  - {s}")
        
    # Update English immediately
    print("\nupdating English dictionary...")
    for s in missing:
        en_translations[s] = s
    save_translations('en', en_translations)
    
    # Placeholder for LLM translation
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        print("\n⚠️ ANTHROPIC_API_KEY not found. Skipping automatic translation for other languages.")
        print("To translate, add the key to .env.")
    else:
        print("🚀 Starting translation process (Not implemented in this demo script yet")

if __name__ == "__main__":
    main()
