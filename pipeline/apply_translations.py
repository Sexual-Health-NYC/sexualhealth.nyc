import json
import os

LANGUAGES = [
    "es", "zh", "ru", "bn", "ht", "fr", 
    "ar", "ko", "it", "tl", "pl", "ur", 
    "el", "he", "hi", "ja", "yi", "pt", "vi"
]

# Manual translations for the identified missing keys
# Core NYC languages covered. Others will default to English for now to prevent errors, 
# or can be extended later.
TRANSLATIONS = {
    "es": {
        "filters": {
            "borough": "Condado",
            "services": "Servicios",
            "availability": "Disponibilidad",
            "filters": "Filtros",
            "insuranceAndCost": "Seguro y Costo"
        },
        "messages": {
            "search": "Buscar",
            "selectBus": "Seleccionar rutas de autobús",
            "selectSubway": "Seleccionar líneas de metro",
            "hours": "Horario",
            "searchByName": "Buscar por nombre de clínica..."
        },
        "sections": {
            "telehealthDescription": "Reciba píldoras abortivas por correo — no se requiere visita en persona",
            "telehealthOptions": "Opciones de telesalud"
        },
        "services": {
            "genderAffirmingCare": "Atención de afirmación de género"
        }
    },
    "zh": {
        "filters": {
            "borough": "行政区",
            "services": "服务",
            "availability": "可用性",
            "filters": "筛选",
            "insuranceAndCost": "保险与费用"
        },
        "messages": {
            "search": "搜索",
            "selectBus": "选择公交路线",
            "selectSubway": "选择地铁线路",
            "hours": "营业时间",
            "searchByName": "按诊所名称搜索..."
        },
        "sections": {
            "telehealthDescription": "邮寄堕胎药给您 — 无需亲自就诊",
            "telehealthOptions": "远程医疗选项"
        },
        "services": {
            "genderAffirmingCare": "性别肯定护理"
        }
    },
    "ru": {
        "filters": {
            "borough": "Район",
            "services": "Услуги",
            "availability": "Доступность",
            "filters": "Фильтры",
            "insuranceAndCost": "Страхование и стоимость"
        },
        "messages": {
            "search": "Поиск",
            "selectBus": "Выберите маршруты автобусов",
            "selectSubway": "Выберите линии метро",
            "hours": "Часы работы",
            "searchByName": "Поиск по названию клиники..."
        },
        "sections": {
            "telehealthDescription": "Получите таблетки для прерывания беременности по почте — личный визит не требуется",
            "telehealthOptions": "Варианты телемедицины"
        },
        "services": {
            "genderAffirmingCare": "Гендерно-аффирмативная помощь"
        }
    },
    "fr": {
        "filters": {
            "borough": "Arrondissement",
            "services": "Services",
            "availability": "Disponibilité",
            "filters": "Filtres",
            "insuranceAndCost": "Assurance et Coût"
        },
        "messages": {
            "search": "Rechercher",
            "selectBus": "Sélectionner les lignes de bus",
            "selectSubway": "Sélectionner les lignes de métro",
            "hours": "Horaires",
            "searchByName": "Rechercher par nom de clinique..."
        },
        "sections": {
            "telehealthDescription": "Recevez des pilules abortives par courrier — aucune visite en personne requise",
            "telehealthOptions": "Options de télésanté"
        },
        "services": {
            "genderAffirmingCare": "Soins d'affirmation de genre"
        }
    },
    "ht": {
        "filters": {
            "borough": "Bwouk",
            "services": "Sèvis",
            "availability": "Disponibilite",
            "filters": "Filtè",
            "insuranceAndCost": "Asirans ak Pri"
        },
        "messages": {
            "search": "Chèche",
            "selectBus": "Chwazi wout otobis yo",
            "selectSubway": "Chwazi liy tren yo",
            "hours": "Lè travay",
            "searchByName": "Chèche pa non klinik..."
        },
        "sections": {
            "telehealthDescription": "Resevwa grenn avòtman pa lapòs — pa bezwen vizit an pèsòn",
            "telehealthOptions": "Opsyon telesante"
        },
        "services": {
            "genderAffirmingCare": "Swen Afimasyon Sèks"
        }
    },
    "bn": {
        "filters": {
            "borough": "এলাকা",
            "services": "পরিষেবা",
            "availability": "প্রাপ্যতা",
            "filters": "ফিল্টার",
            "insuranceAndCost": "বিমা এবং খরচ"
        },
        "messages": {
            "search": "অনুসন্ধান",
            "selectBus": "বাস রুট নির্বাচন করুন",
            "selectSubway": "সাবওয়ে লাইন নির্বাচন করুন",
            "hours": "সময়সূচী",
            "searchByName": "ক্লিনিকের নাম দিয়ে অনুসন্ধান করুন..."
        },
        "sections": {
            "telehealthDescription": "ডাকে গর্ভপাতের বড়ি পান — সশরীরে উপস্থিত হওয়ার প্রয়োজন নেই",
            "telehealthOptions": "টেলিহেলথ বিকল্প"
        },
        "services": {
            "genderAffirmingCare": "লিঙ্গ নিশ্চিতকরণ সেবা"
        }
    }
}

LOCALES_DIR = 'public/locales'

def load_json(path):
    if not os.path.exists(path):
        return {}
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {path}: {e}")
        return {}

def save_json(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def update_translations():
    print("🚀 Applying manual translations...")
    
    for lang in LANGUAGES:
        if lang == 'en': continue
        
        # Get translations for this language, or skip if not ready
        # For languages not in our manual map, we could fallback to English or leave as is
        # For now, we only update if we have data
        lang_trans = TRANSLATIONS.get(lang)
        if not lang_trans:
            print(f"⚠️  Skipping {lang} (no manual translations defined)")
            continue

        print(f"📝 Updating {lang}...")
        
        for ns, keys in lang_trans.items():
            file_path = os.path.join(LOCALES_DIR, lang, f'{ns}.json')
            
            # Load existing
            data = load_json(file_path)
            
            # Update
            updated = False
            for key, val in keys.items():
                if key not in data or data[key] != val:
                    data[key] = val
                    updated = True
            
            # Save
            if updated:
                save_json(file_path, data)
                print(f"   - Updated {ns}.json")
            else:
                print(f"   - {ns}.json already up to date")

if __name__ == "__main__":
    update_translations()
