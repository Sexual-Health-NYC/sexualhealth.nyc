import json
import os

updates = {
    'es': {
        "upTo24": "Hasta 24 semanas (límite de NY)",
        "lateTerm": "Más de 24 semanas"
    },
    'zh': {
        "upTo24": "24周以内 (纽约州限制)",
        "lateTerm": "超过24周"
    },
    'ru': {
        "upTo24": "До 24 недель (лимит штата)",
        "lateTerm": "Более 24 недель"
    },
    'bn': {
        "upTo24": "২৪ সপ্তাহ পর্যন্ত (NY সীমা)",
        "lateTerm": "২৪ সপ্তাহের বেশি"
    },
    'ht': {
        "upTo24": "Jiska 24 semèn (limit NY)",
        "lateTerm": "Pi lwen pase 24 semèn"
    },
    'fr': {
        "upTo24": "Jusqu'à 24 semaines (limite NY)",
        "lateTerm": "Au-delà de 24 semaines"
    },
    'ar': {
        "upTo24": "حتى 24 أسبوعاً (حد نيويورك)",
        "lateTerm": "بعد 24 أسبوعاً"
    },
    'ko': {
        "upTo24": "24주까지 (NY 제한)",
        "lateTerm": "24주 이후"
    },
    'it': {
        "upTo24": "Fino a 24 settimane (limite NY)",
        "lateTerm": "Oltre le 24 settimane"
    },
    'tl': {
        "upTo24": "Hanggang 24 na linggo (limitasyon ng NY)",
        "lateTerm": "Lampas sa 24 na linggo"
    },
    'pl': {
        "upTo24": "Do 24 tygodni (limit NY)",
        "lateTerm": "Powyżej 24 tygodni"
    },
    'ur': {
        "upTo24": "24 ہفتوں تک (NY کی حد)",
        "lateTerm": "24 ہفتوں سے زیادہ"
    },
    'el': {
        "upTo24": "Έως 24 εβδομάδες (όριο NY)",
        "lateTerm": "Πέρα από 24 εβδομάδες"
    },
    'he': {
        "upTo24": "עד 24 שבועות (מגבלת NY)",
        "lateTerm": "מעבר ל-24 שבועות"
    },
    'hi': {
        "upTo24": "24 सप्ताह तक (NY सीमा)",
        "lateTerm": "24 सप्ताह से आगे"
    },
    'ja': {
        "upTo24": "24週まで（NY州の上限）",
        "lateTerm": "24週以降"
    },
    'yi': {
        "upTo24": "ביז 24 וואָכן (NY גרענעץ)",
        "lateTerm": "איבער 24 וואָכן"
    },
    'pt': {
        "upTo24": "Até 24 semanas (limite de NY)",
        "lateTerm": "Além das 24 semanas"
    },
    'vi': {
        "upTo24": "Đến 24 tuần (giới hạn NY)",
        "lateTerm": "Hơn 24 tuần"
    }
}

for lang, messages in updates.items():
    path = f'public/locales/{lang}/gestational.json'
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        data.update(messages)
        
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Updated {lang}")
    else:
        print(f"Skipped {lang} - file not found")
