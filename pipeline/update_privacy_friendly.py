import json
import os

updates = {
    'es': "respetuoso con la privacidad",
    'zh': "隐私友好",
    'ru': "конфиденциально",
    'bn': "গোপনীয়তা-বান্ধব",
    'ht': "respekte vi prive",
    'fr': "respectueux de la vie privée",
    'ar': "صديق للخصوصية",
    'ko': "개인정보 보호",
    'it': "rispettoso della privacy",
    'tl': "iginalagalang ang privacy",
    'pl': "przyjazny dla prywatności",
    'ur': "رازداری کے لیے موزوں",
    'el': "φιλικό προς το απόρρητο",
    'he': "שומר על פרטיות",
    'hi': "गोपनीयता के अनुकूल",
    'ja': "プライバシー配慮",
    'yi': "פּריוואַטקייט-פרייַנדלעך",
    'pt': "respeita a privacidade",
    'vi': "thân thiện với quyền riêng tư"
}

def main():
    for lang, translation in updates.items():
        path = f'public/locales/{lang}/actions.json'
        if os.path.exists(path):
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            if "privacyFriendly" in data:
                print(f"Updating {lang}: {data['privacyFriendly']} -> {translation}")
                data["privacyFriendly"] = translation
            else:
                 print(f"Warning: privacyFriendly key missing in {lang}")
                 data["privacyFriendly"] = translation
            
            with open(path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
        else:
            print(f"Skipped {lang} - file not found")

if __name__ == "__main__":
    main()
