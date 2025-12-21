import os
import re
import json
import glob

# Configuration
SRC_DIR = 'src'
LOCALES_DIR = 'public/locales'
LANGUAGES = [
    "en", "es", "zh", "ru", "bn", "ht", "fr", "ar", "ko", "it", 
    "tl", "pl", "ur", "el", "he", "hi", "ja", "yi", "pt", "vi"
]
NAMESPACES = ['actions', 'dynamic', 'filters', 'forms', 'gestational', 'insurance', 'locations', 'messages', 'sections', 'services']
DEFAULT_NS = 'messages'

def load_json(path):
    if not os.path.exists(path):
        return {}
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {path}: {e}")
        return {}

def flatten_keys(data, prefix=""):
    keys = set()
    if isinstance(data, dict):
        for k, v in data.items():
            full_key = f"{prefix}.{k}" if prefix else k
            if isinstance(v, dict):
                keys.update(flatten_keys(v, full_key))
            else:
                keys.add(full_key)
    return keys

def find_keys_in_code(src_dir):
    # Regex to capture t('key') or t("key")
    # Also handles t('ns:key')
    # Use simple capture group for quote to ensure matching
    # Matches t("...") or t('...')
    regex = re.compile(r'''t\((['"])([a-zA-Z0-9_.:\-]+)\1\)''')
    
    found_keys = set()
    file_count = 0
    
    print(f"Scanning {src_dir}...")
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith('.jsx') or file.endswith('.js'):
                file_count += 1
                path = os.path.join(root, file)
                # print(f"Checking {path}")
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    matches = regex.findall(content)
                    if matches:
                         # print(f"  Found {len(matches)} matches in {file}")
                         pass
                    for match in matches:
                        # match is a tuple: (quote_char, key)
                        found_keys.add(match[1])
    
    print(f"Scanned {file_count} files.")
    # Test regex
    test_str = 't("services:stiTesting")'
    if not regex.search(test_str):
        print("❌ Regex test failed on: " + test_str)
    else:
        print("✅ Regex test passed.")
        
    return found_keys

def check_missing_translations():
    print("🔍 Checking static translations...")
    
    # 1. Load English keys (Source of Truth)
    en_data = {}
    en_keys_by_ns = {}
    
    for ns in NAMESPACES:
        path = os.path.join(LOCALES_DIR, 'en', f'{ns}.json')
        data = load_json(path)
        en_data[ns] = data
        en_keys_by_ns[ns] = flatten_keys(data)

    # 2. Find keys used in code
    code_keys = find_keys_in_code(SRC_DIR)
    print(f"found {len(code_keys)} keys in code usage (approximate).")

    # 3. Check if code keys exist in English
    missing_in_en = []
    for key in code_keys:
        if ':' in key:
            ns, k = key.split(':', 1)
        else:
            ns = DEFAULT_NS
            k = key
        
        if ns not in NAMESPACES:
             # Might be a dynamic namespace or invalid
             # print(f"Warning: Unknown namespace '{ns}' in key '{key}'")
             continue
             
        if k not in en_keys_by_ns[ns]:
            # Try to see if it's a nested key access that matches a parent object
            # (sometimes t('parent') returns an object, though rare in this codebase style)
            # Or if it was flattened correctly.
            missing_in_en.append(key)

    if missing_in_en:
        print(f"\n❌ Found {len(missing_in_en)} keys used in code but missing in English files:")
        for k in sorted(missing_in_en):
            print(f"  - {k}")
    else:
        print("\n✅ All keys found in code exist in English files (or could not be verified due to regex limitations).")

    # 4. Check other languages against English keys
    print("\n🌍 Checking missing translations in other languages...")
    total_missing = 0
    
    missing_report = {}

    for lang in LANGUAGES:
        if lang == 'en': continue
        
        missing_count = 0
        for ns in NAMESPACES:
            path = os.path.join(LOCALES_DIR, lang, f'{ns}.json')
            lang_data = load_json(path)
            lang_keys = flatten_keys(lang_data)
            
            # Check every key in English NS against this lang
            for en_key in en_keys_by_ns[ns]:
                if en_key not in lang_keys:
                    missing_count += 1
                    if lang not in missing_report:
                        missing_report[lang] = []
                    missing_report[lang].append(f"{ns}:{en_key}")

        if missing_count > 0:
            print(f"  - {lang}: {missing_count} missing keys")
            total_missing += missing_count
    
    if total_missing == 0:
        print("✅ All languages are fully synced with English!")
    else:
        print(f"\n❌ Total {total_missing} missing translations across all languages.")
        
        # Save report
        with open('pipeline/missing_static_translations.json', 'w', encoding='utf-8') as f:
            json.dump(missing_report, f, indent=2)
        print("💾 Saved detailed report to pipeline/missing_static_translations.json")

if __name__ == "__main__":
    check_missing_translations()
