import json
import os

LANGUAGES = [
    "es", "zh", "ru", "bn", "ht", "fr", 
    "ar", "ko", "it", "tl", "pl", "ur", 
    "el", "he", "hi", "ja", "yi", "pt", "vi"
]

# Manual translations for the missing keys across all 20 languages
TRANSLATIONS = {
    "es": {
        "dynamic": {
            "Appointment-based. 4487 Third Ave, 4th Floor. Call (718) 960-9000": "Basado en citas. 4487 Third Ave, 4to piso. Llame al (718) 960-9000",
            "Appointment-based. Call (212) 434-2000 for HIV services": "Basado en citas. Llame al (212) 434-2000 para servicios de VIH",
            "Appointment-based. Part of One Brooklyn Health. Call (718) 604-5000": "Basado en citas. Parte de One Brooklyn Health. Llame al (718) 604-5000",
            "HIV Services": "Servicios de VIH",
            "Pathways Center (HIV/AIDS Services)": "Centro Pathways (Servicios de VIH/SIDA)",
            "STAR Health Center (HIV Services)": "Centro de Salud STAR (Servicios de VIH)",
            "Thu 1:30pm-5pm only; 1st Wed extended to 8pm. starprogram.nyc": "Jue 1:30pm-5pm solamente; 1er Mié extendido hasta las 8pm. starprogram.nyc",
            "Express": "Rápido (Express)"
        }
    },
    "zh": {
        "dynamic": {
            "Appointment-based. 4487 Third Ave, 4th Floor. Call (718) 960-9000": "预约制。4487 Third Ave, 4楼。致电 (718) 960-9000",
            "Appointment-based. Call (212) 434-2000 for HIV services": "预约制。致电 (212) 434-2000 获取艾滋病毒服务",
            "Appointment-based. Part of One Brooklyn Health. Call (718) 604-5000": "预约制。One Brooklyn Health 成员。致电 (718) 604-5000",
            "HIV Services": "艾滋病毒服务",
            "Pathways Center (HIV/AIDS Services)": "Pathways 中心 (艾滋病毒/艾滋病服务)",
            "STAR Health Center (HIV Services)": "STAR 健康中心 (艾滋病毒服务)",
            "Thu 1:30pm-5pm only; 1st Wed extended to 8pm. starprogram.nyc": "仅周四下午 1:30-5:00；首个周三延长至晚上 8 点。starprogram.nyc",
            "Express": "快速服务 (Express)"
        }
    },
    "ru": {
        "dynamic": {
            "Appointment-based. 4487 Third Ave, 4th Floor. Call (718) 960-9000": "По записи. 4487 Third Ave, 4-й этаж. Звоните (718) 960-9000",
            "Appointment-based. Call (212) 434-2000 for HIV services": "По записи. Звоните (212) 434-2000 для услуг по ВИЧ",
            "Appointment-based. Part of One Brooklyn Health. Call (718) 604-5000": "По записи. Часть One Brooklyn Health. Звоните (718) 604-5000",
            "HIV Services": "Услуги по ВИЧ",
            "Pathways Center (HIV/AIDS Services)": "Центр Pathways (Услуги по ВИЧ/СПИДу)",
            "STAR Health Center (HIV Services)": "Центр здоровья STAR (Услуги по ВИЧ)",
            "Thu 1:30pm-5pm only; 1st Wed extended to 8pm. starprogram.nyc": "Только Чт 13:30-17:00; 1-я Ср продлена до 20:00. starprogram.nyc",
            "Express": "Экспресс"
        }
    },
    "fr": {
        "dynamic": {
            "Appointment-based. 4487 Third Ave, 4th Floor. Call (718) 960-9000": "Sur rendez-vous. 4487 Third Ave, 4e étage. Appelez le (718) 960-9000",
            "Appointment-based. Call (212) 434-2000 for HIV services": "Sur rendez-vous. Appelez le (212) 434-2000 pour les services VIH",
            "Appointment-based. Part of One Brooklyn Health. Call (718) 604-5000": "Sur rendez-vous. Fait partie de One Brooklyn Health. Appelez le (718) 604-5000",
            "HIV Services": "Services VIH",
            "Pathways Center (HIV/AIDS Services)": "Centre Pathways (Services VIH/SIDA)",
            "STAR Health Center (HIV Services)": "Centre de santé STAR (Services VIH)",
            "Thu 1:30pm-5pm only; 1st Wed extended to 8pm. starprogram.nyc": "Jeu 13h30-17h00 uniquement ; 1er Mer prolongé jusqu'à 20h. starprogram.nyc",
            "Express": "Express"
        }
    },
    "ht": {
        "dynamic": {
            "Appointment-based. 4487 Third Ave, 4th Floor. Call (718) 960-9000": "Sou randevou. 4487 Third Ave, 4yèm etaj. Rele (718) 960-9000",
            "Appointment-based. Call (212) 434-2000 for HIV services": "Sou randevou. Rele (212) 434-2000 pou sèvis VIH",
            "Appointment-based. Part of One Brooklyn Health. Call (718) 604-5000": "Sou randevou. Pati nan One Brooklyn Health. Rele (718) 604-5000",
            "HIV Services": "Sèvis VIH",
            "Pathways Center (HIV/AIDS Services)": "Sant Pathways (Sèvis VIH/SIDA)",
            "STAR Health Center (HIV Services)": "Sant Sante STAR (Sèvis VIH)",
            "Thu 1:30pm-5pm only; 1st Wed extended to 8pm. starprogram.nyc": "Jedi 1:30pm-5pm sèlman; 1ye Mèkredi pwolonje jiska 8pm. starprogram.nyc",
            "Express": "Eksprès"
        }
    },
    "bn": {
        "dynamic": {
            "Appointment-based. 4487 Third Ave, 4th Floor. Call (718) 960-9000": "অ্যাপয়েন্টমেন্ট ভিত্তিক। 4487 Third Ave, ৪র্থ তলা। কল করুন (718) 960-9000",
            "Appointment-based. Call (212) 434-2000 for HIV services": "অ্যাপয়েন্টমেন্ট ভিত্তিক। HIV পরিষেবার জন্য কল করুন (212) 434-2000",
            "Appointment-based. Part of One Brooklyn Health. Call (718) 604-5000": "অ্যাপয়েন্টমেন্ট ভিত্তিক। ওয়ান ব্রুকলিন হেলথের অংশ। কল করুন (718) 604-5000",
            "HIV Services": "HIV পরিষেবা",
            "Pathways Center (HIV/AIDS Services)": "পাথওয়েজ সেন্টার (HIV/AIDS পরিষেবা)",
            "STAR Health Center (HIV Services)": "স্টার হেলথ সেন্টার (HIV পরিষেবা)",
            "Thu 1:30pm-5pm only; 1st Wed extended to 8pm. starprogram.nyc": "শুধুমাত্র বৃহস্পতি ১:৩০-৫টা; ১ম বুধ রাত ৮টা পর্যন্ত। starprogram.nyc",
            "Express": "এক্সপ্রেস (Express)"
        }
    },
    "ar": {
        "dynamic": {
            "Appointment-based. 4487 Third Ave, 4th Floor. Call (718) 960-9000": "بموعد مسبق. 4487 Third Ave, الطابق الرابع. اتصل بـ (718) 960-9000",
            "Appointment-based. Call (212) 434-2000 for HIV services": "بموعد مسبق. اتصل بـ (212) 434-2000 لخدمات فيروس نقص المناعة البشرية",
            "Appointment-based. Part of One Brooklyn Health. Call (718) 604-5000": "بموعد مسبق. جزء من One Brooklyn Health. اتصل بـ (718) 604-5000",
            "HIV Services": "خدمات فيروس نقص المناعة البشرية",
            "Pathways Center (HIV/AIDS Services)": "مركز Pathways (خدمات فيروس نقص المناعة البشرية/الإيدز)",
            "STAR Health Center (HIV Services)": "مركز STAR الصحي (خدمات فيروس نقص المناعة البشرية)",
            "Thu 1:30pm-5pm only; 1st Wed extended to 8pm. starprogram.nyc": "الخميس 1:30-5:00 مساءً فقط؛ أول أربعاء يمتد حتى 8:00 مساءً. starprogram.nyc",
            "Express": "سريع (Express)"
        }
    },
    "ko": {
        "dynamic": {
            "Appointment-based. 4487 Third Ave, 4th Floor. Call (718) 960-9000": "예약제. 4487 Third Ave, 4층. (718) 960-9000 전화",
            "Appointment-based. Call (212) 434-2000 for HIV services": "예약제. HIV 서비스는 (212) 434-2000 전화",
            "Appointment-based. Part of One Brooklyn Health. Call (718) 604-5000": "예약제. One Brooklyn Health 소속. (718) 604-5000 전화",
            "HIV Services": "HIV 서비스",
            "Pathways Center (HIV/AIDS Services)": "Pathways 센터 (HIV/AIDS 서비스)",
            "STAR Health Center (HIV Services)": "STAR 건강 센터 (HIV 서비스)",
            "Thu 1:30pm-5pm only; 1st Wed extended to 8pm. starprogram.nyc": "목요일 오후 1:30-5:00만; 첫 번째 수요일 오후 8시까지 연장. starprogram.nyc",
            "Express": "익스프레스 (Express)"
        }
    },
    "it": {
        "dynamic": {
            "Appointment-based. 4487 Third Ave, 4th Floor. Call (718) 960-9000": "Su appuntamento. 4487 Third Ave, 4° piano. Chiama (718) 960-9000",
            "Appointment-based. Call (212) 434-2000 for HIV services": "Su appuntamento. Chiama (212) 434-2000 per servizi HIV",
            "Appointment-based. Part of One Brooklyn Health. Call (718) 604-5000": "Su appuntamento. Parte di One Brooklyn Health. Chiama (718) 604-5000",
            "HIV Services": "Servizi HIV",
            "Pathways Center (HIV/AIDS Services)": "Centro Pathways (Servizi HIV/AIDS)",
            "STAR Health Center (HIV Services)": "Centro Salute STAR (Servizi HIV)",
            "Thu 1:30pm-5pm only; 1st Wed extended to 8pm. starprogram.nyc": "Solo Gio 13:30-17:00; 1° Mer fino alle 20:00. starprogram.nyc",
            "Express": "Espresso"
        }
    },
    "tl": {
        "dynamic": {
            "Appointment-based. 4487 Third Ave, 4th Floor. Call (718) 960-9000": "Sa appointment. 4487 Third Ave, 4th Floor. Tumawag sa (718) 960-9000",
            "Appointment-based. Call (212) 434-2000 for HIV services": "Sa appointment. Tumawag sa (212) 434-2000 para sa serbisyo sa HIV",
            "Appointment-based. Part of One Brooklyn Health. Call (718) 604-5000": "Sa appointment. Bahagi ng One Brooklyn Health. Tumawag sa (718) 604-5000",
            "HIV Services": "Serbisyo sa HIV",
            "Pathways Center (HIV/AIDS Services)": "Pathways Center (Serbisyo sa HIV/AIDS)",
            "STAR Health Center (HIV Services)": "STAR Health Center (Serbisyo sa HIV)",
            "Thu 1:30pm-5pm only; 1st Wed extended to 8pm. starprogram.nyc": "Huwebes 1:30pm-5pm lang; ika-1 Miyerkules hanggang 8pm. starprogram.nyc",
            "Express": "Express"
        }
    },
    "pl": {
        "dynamic": {
            "Appointment-based. 4487 Third Ave, 4th Floor. Call (718) 960-9000": "Na umówienie. 4487 Third Ave, 4. piętro. Zadzwoń (718) 960-9000",
            "Appointment-based. Call (212) 434-2000 for HIV services": "Na umówienie. Zadzwoń (212) 434-2000 w sprawie usług HIV",
            "Appointment-based. Part of One Brooklyn Health. Call (718) 604-5000": "Na umówienie. Część One Brooklyn Health. Zadzwoń (718) 604-5000",
            "HIV Services": "Usługi HIV",
            "Pathways Center (HIV/AIDS Services)": "Centrum Pathways (Usługi HIV/AIDS)",
            "STAR Health Center (HIV Services)": "Centrum Zdrowia STAR (Usługi HIV)",
            "Thu 1:30pm-5pm only; 1st Wed extended to 8pm. starprogram.nyc": "Tylko czw 13:30-17:00; 1. śr do 20:00. starprogram.nyc",
            "Express": "Ekspresowe"
        }
    },
    "ur": {
        "dynamic": {
            "Appointment-based. 4487 Third Ave, 4th Floor. Call (718) 960-9000": "اپوائنٹمنٹ کی بنیاد پر۔ 4487 Third Ave، چوتھی منزل۔ (718) 960-9000 پر کال کریں",
            "Appointment-based. Call (212) 434-2000 for HIV services": "اپوائنٹمنٹ کی بنیاد پر۔ ایچ آئی وی خدمات کے لیے (212) 434-2000 پر کال کریں",
            "Appointment-based. Part of One Brooklyn Health. Call (718) 604-5000": "اپوائنٹمنٹ کی بنیاد پر۔ ون بروکلین ہیلتھ کا حصہ۔ (718) 604-5000 پر کال کریں",
            "HIV Services": "ایچ آئی وی (HIV) کی خدمات",
            "Pathways Center (HIV/AIDS Services)": "پاتھ ویز سینٹر (HIV/AIDS خدمات)",
            "STAR Health Center (HIV Services)": "اسٹار ہیلتھ سینٹر (HIV خدمات)",
            "Thu 1:30pm-5pm only; 1st Wed extended to 8pm. starprogram.nyc": "صرف جمعرات 1:30-5 بجے؛ پہلا بدھ 8 بجے تک۔ starprogram.nyc",
            "Express": "ایکسپریس (Express)"
        }
    },
    "el": {
        "dynamic": {
            "Appointment-based. 4487 Third Ave, 4th Floor. Call (718) 960-9000": "Με ραντεβού. 4487 Third Ave, 4ος όροφος. Καλέστε (718) 960-9000",
            "Appointment-based. Call (212) 434-2000 for HIV services": "Με ραντεβού. Καλέστε (212) 434-2000 για υπηρεσίες HIV",
            "Appointment-based. Part of One Brooklyn Health. Call (718) 604-5000": "Με ραντεβού. Μέρος του One Brooklyn Health. Καλέστε (718) 604-5000",
            "HIV Services": "Υπηρεσίες HIV",
            "Pathways Center (HIV/AIDS Services)": "Κέντρο Pathways (Υπηρεσίες HIV/AIDS)",
            "STAR Health Center (HIV Services)": "Κέντρο Υγείας STAR (Υπηρεσίες HIV)",
            "Thu 1:30pm-5pm only; 1st Wed extended to 8pm. starprogram.nyc": "Πέμ 1:30μμ-5μμ μόνο; 1η Τετ έως 8μμ. starprogram.nyc",
            "Express": "Εξπρές (Express)"
        }
    },
    "he": {
        "dynamic": {
            "Appointment-based. 4487 Third Ave, 4th Floor. Call (718) 960-9000": "בתיאום מראש. 4487 Third Ave, קומה 4. התקשרו (718) 960-9000",
            "Appointment-based. Call (212) 434-2000 for HIV services": "בתיאום מראש. התקשרו (212) 434-2000 לשירותי HIV",
            "Appointment-based. Part of One Brooklyn Health. Call (718) 604-5000": "בתיאום מראש. חלק מ-One Brooklyn Health. התקשרו (718) 604-5000",
            "HIV Services": "שירותי HIV",
            "Pathways Center (HIV/AIDS Services)": "מרכז Pathways (שירותי HIV/איידס)",
            "STAR Health Center (HIV Services)": "מרכז בריאות STAR (שירותי HIV)",
            "Thu 1:30pm-5pm only; 1st Wed extended to 8pm. starprogram.nyc": "יום ה' 13:30-17:00 בלבד; יום ד' הראשון עד 20:00. starprogram.nyc",
            "Express": "אקספרס (Express)"
        }
    },
    "hi": {
        "dynamic": {
            "Appointment-based. 4487 Third Ave, 4th Floor. Call (718) 960-9000": "अपॉइंटमेंट आधारित। 4487 थर्ड एवेन्यू, चौथी मंजिल। (718) 960-9000 पर कॉल करें",
            "Appointment-based. Call (212) 434-2000 for HIV services": "अपॉइंटमेंट आधारित। HIV सेवाओं के लिए (212) 434-2000 पर कॉल करें",
            "Appointment-based. Part of One Brooklyn Health. Call (718) 604-5000": "अपॉइंटमेंट आधारित। वन ब्रुकलिन हेल्थ का हिस्सा। (718) 604-5000 पर कॉल करें",
            "HIV Services": "HIV सेवाएं",
            "Pathways Center (HIV/AIDS Services)": "पाथवे सेंटर (HIV/AIDS सेवाएं)",
            "STAR Health Center (HIV Services)": "स्टार हेल्थ सेंटर (HIV सेवाएं)",
            "Thu 1:30pm-5pm only; 1st Wed extended to 8pm. starprogram.nyc": "केवल गुरु 1:30-5 बजे; पहला बुध 8 बजे तक। starprogram.nyc",
            "Express": "एक्सप्रेस (Express)"
        }
    },
    "ja": {
        "dynamic": {
            "Appointment-based. 4487 Third Ave, 4th Floor. Call (718) 960-9000": "予約制。4487 Third Ave, 4階。電話 (718) 960-9000",
            "Appointment-based. Call (212) 434-2000 for HIV services": "予約制。HIVサービスについては (212) 434-2000 に電話",
            "Appointment-based. Part of One Brooklyn Health. Call (718) 604-5000": "予約制。One Brooklyn Healthの一部。電話 (718) 604-5000",
            "HIV Services": "HIVサービス",
            "Pathways Center (HIV/AIDS Services)": "Pathways センター (HIV/AIDSサービス)",
            "STAR Health Center (HIV Services)": "STAR ヘルスセンター (HIVサービス)",
            "Thu 1:30pm-5pm only; 1st Wed extended to 8pm. starprogram.nyc": "木曜 13:30-17:00 のみ; 第1水曜は20:00まで延長。 starprogram.nyc",
            "Express": "エクスプレス (Express)"
        }
    },
    "yi": {
        "dynamic": {
            "Appointment-based. 4487 Third Ave, 4th Floor. Call (718) 960-9000": "אויף אַפּוינטמאַנט. 4487 Third Ave, 4טער שטאָק. רופט (718) 960-9000",
            "Appointment-based. Call (212) 434-2000 for HIV services": "אויף אַפּוינטמאַנט. רופט (212) 434-2000 פֿאַר היוו סערוויסעס",
            "Appointment-based. Part of One Brooklyn Health. Call (718) 604-5000": "אויף אַפּוינטמאַנט. טייל פון One Brooklyn Health. רופט (718) 604-5000",
            "HIV Services": "היוו (HIV) סערוויסעס",
            "Pathways Center (HIV/AIDS Services)": "Pathways צענטער (היוו/עידס סערוויסעס)",
            "STAR Health Center (HIV Services)": "STAR געזונט צענטער (היוו סערוויסעס)",
            "Thu 1:30pm-5pm only; 1st Wed extended to 8pm. starprogram.nyc": "דאנערשטאג בלויז 1:30-5; 1טער מיטוואך ביז 8. starprogram.nyc",
            "Express": "עקספּרעס (Express)"
        }
    },
    "pt": {
        "dynamic": {
            "Appointment-based. 4487 Third Ave, 4th Floor. Call (718) 960-9000": "Com hora marcada. 4487 Third Ave, 4º andar. Ligue (718) 960-9000",
            "Appointment-based. Call (212) 434-2000 for HIV services": "Com hora marcada. Ligue (212) 434-2000 para serviços de HIV",
            "Appointment-based. Part of One Brooklyn Health. Call (718) 604-5000": "Com hora marcada. Parte da One Brooklyn Health. Ligue (718) 604-5000",
            "HIV Services": "Serviços de HIV",
            "Pathways Center (HIV/AIDS Services)": "Centro Pathways (Serviços de HIV/AIDS)",
            "STAR Health Center (HIV Services)": "Centro de Saúde STAR (Serviços de HIV)",
            "Thu 1:30pm-5pm only; 1st Wed extended to 8pm. starprogram.nyc": "Apenas Qui 13:30-17:00; 1ª Qua até às 20h. starprogram.nyc",
            "Express": "Expresso"
        }
    },
    "vi": {
        "dynamic": {
            "Appointment-based. 4487 Third Ave, 4th Floor. Call (718) 960-9000": "Theo lịch hẹn. 4487 Third Ave, Tầng 4. Gọi (718) 960-9000",
            "Appointment-based. Call (212) 434-2000 for HIV services": "Theo lịch hẹn. Gọi (212) 434-2000 cho dịch vụ HIV",
            "Appointment-based. Part of One Brooklyn Health. Call (718) 604-5000": "Theo lịch hẹn. Thuộc One Brooklyn Health. Gọi (718) 604-5000",
            "HIV Services": "Dịch vụ HIV",
            "Pathways Center (HIV/AIDS Services)": "Trung tâm Pathways (Dịch vụ HIV/AIDS)",
            "STAR Health Center (HIV Services)": "Trung tâm Sức khỏe STAR (Dịch vụ HIV)",
            "Thu 1:30pm-5pm only; 1st Wed extended to 8pm. starprogram.nyc": "Chỉ Thứ 5 1:30-5h chiều; Thứ 4 đầu tiên đến 8h tối. starprogram.nyc",
            "Express": "Nhanh (Express)"
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
                # print(f"   - {ns}.json already up to date")
                pass

if __name__ == "__main__":
    update_translations()
