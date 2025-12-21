import json
import os

LANGUAGES = [
    "es", "zh", "ru", "bn", "ht", "fr", 
    "ar", "ko", "it", "tl", "pl", "ur", 
    "el", "he", "hi", "ja", "yi", "pt", "vi"
]

# Complete translations for all 20 languages
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
            "searchByName": "Buscar por nombre de clínica...",
            "siteTitle": "Sexual Health NYC - Encuentre clínicas para pruebas de ITS, pruebas de VIH, PrEP, PEP, anticoncepción y servicios de aborto"
        },
        "sections": {
            "telehealthDescription": "Reciba píldoras abortivas por correo — no se requiere visita en persona",
            "telehealthOptions": "Opciones de telesalud"
        },
        "services": {
            "genderAffirmingCare": "Atención de afirmación de género"
        },
        "actions": {
            "cancelCorrection": "Cancelar corrección"
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
            "searchByName": "按诊所名称搜索...",
            "siteTitle": "Sexual Health NYC - 查找性传播感染检测、艾滋病检测、PrEP、PEP、避孕和堕胎服务的诊所"
        },
        "sections": {
            "telehealthDescription": "邮寄堕胎药给您 — 无需亲自就诊",
            "telehealthOptions": "远程医疗选项"
        },
        "services": {
            "genderAffirmingCare": "性别肯定护理"
        },
        "actions": {
            "cancelCorrection": "取消更正"
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
            "searchByName": "Поиск по названию клиники...",
            "siteTitle": "Sexual Health NYC - Найдите клиники для тестирования на ИППП, ВИЧ, PrEP, PEP, контрацепции и услуг по прерыванию беременности"
        },
        "sections": {
            "telehealthDescription": "Получите таблетки для прерывания беременности по почте — личный визит не требуется",
            "telehealthOptions": "Варианты телемедицины"
        },
        "services": {
            "genderAffirmingCare": "Гендерно-аффирмативная помощь"
        },
        "actions": {
            "cancelCorrection": "Отменить исправление"
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
            "searchByName": "Rechercher par nom de clinique...",
            "siteTitle": "Sexual Health NYC - Trouvez des cliniques pour le dépistage des IST, le dépistage du VIH, la PrEP, la PEP, la contraception et les services d'avortement"
        },
        "sections": {
            "telehealthDescription": "Recevez des pilules abortives par courrier — aucune visite en personne requise",
            "telehealthOptions": "Options de télésanté"
        },
        "services": {
            "genderAffirmingCare": "Soins d'affirmation de genre"
        },
        "actions": {
            "cancelCorrection": "Annuler la correction"
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
            "searchByName": "Chèche pa non klinik...",
            "siteTitle": "Sexual Health NYC - Jwenn klinik pou tès STI, tès HIV, PrEP, PEP, kontrasepsyon, ak sèvis avòtman"
        },
        "sections": {
            "telehealthDescription": "Resevwa grenn avòtman pa lapòs — pa bezwen vizit an pèsòn",
            "telehealthOptions": "Opsyon telesante"
        },
        "services": {
            "genderAffirmingCare": "Swen Afimasyon Sèks"
        },
        "actions": {
            "cancelCorrection": "Anile koreksyon"
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
            "searchByName": "ক্লিনিকের নাম দিয়ে অনুসন্ধান করুন...",
            "siteTitle": "Sexual Health NYC - STI পরীক্ষা, HIV পরীক্ষা, PrEP, PEP, গর্ভनिरোধक, এবং গর্ভপাত পরিষেবার জন্য ক্লিনিক খুঁজুন"
        },
        "sections": {
            "telehealthDescription": "ডাকে গর্ভপাতের বড়ি পান — সশরীরে উপস্থিত হওয়ার প্রয়োজন নেই",
            "telehealthOptions": "টেলিহেলথ বিকল্প"
        },
        "services": {
            "genderAffirmingCare": "লিঙ্গ নিশ্চিতকরণ সেবা"
        },
        "actions": {
            "cancelCorrection": "সংশোধন বাতিল করুন"
        }
    },
    "ar": {
        "filters": {
            "borough": "حي",
            "services": "خدمات",
            "availability": "التوفر",
            "filters": "مرشحات",
            "insuranceAndCost": "التأمين والتكلفة"
        },
        "messages": {
            "search": "بحث",
            "selectBus": "اختر خطوط الحافلات",
            "selectSubway": "اختر خطوط المترو",
            "hours": "ساعات العمل",
            "searchByName": "البحث حسب اسم العيادة...",
            "siteTitle": "Sexual Health NYC - اعثر على عيادات لفحص الأمراض المنقولة جنسياً، وفحص فيروس نقص المناعة البشرية، وPrEP، وPEP، ومنع الحمل، وخدمات الإجهاض"
        },
        "sections": {
            "telehealthDescription": "احصل على حبوب الإجهاض بالبريد — لا حاجة لزيارة شخصية",
            "telehealthOptions": "خيارات الرعاية عن بعد"
        },
        "services": {
            "genderAffirmingCare": "الرعاية المؤكدة للجنس"
        },
        "actions": {
            "cancelCorrection": "إلغاء التصحيح"
        }
    },
    "ko": {
        "filters": {
            "borough": "자치구",
            "services": "서비스",
            "availability": "이용 가능 여부",
            "filters": "필터",
            "insuranceAndCost": "보험 및 비용"
        },
        "messages": {
            "search": "검색",
            "selectBus": "버스 노선 선택",
            "selectSubway": "지하철 노선 선택",
            "hours": "운영 시간",
            "searchByName": "병원 이름으로 검색...",
            "siteTitle": "Sexual Health NYC - STI 검사, HIV 검사, PrEP, PEP, 피임 및 낙태 서비스를 위한 클리닉 찾기"
        },
        "sections": {
            "telehealthDescription": "우편으로 낙태약을 받으세요 — 직접 방문할 필요 없음",
            "telehealthOptions": "원격 진료 옵션"
        },
        "services": {
            "genderAffirmingCare": "성별 긍정 치료"
        },
        "actions": {
            "cancelCorrection": "수정 취소"
        }
    },
    "it": {
        "filters": {
            "borough": "Quartiere",
            "services": "Servizi",
            "availability": "Disponibilità",
            "filters": "Filtri",
            "insuranceAndCost": "Assicurazione e Costi"
        },
        "messages": {
            "search": "Cerca",
            "selectBus": "Seleziona linee autobus",
            "selectSubway": "Seleziona linee metropolitana",
            "hours": "Orari",
            "searchByName": "Cerca per nome della clinica...",
            "siteTitle": "Sexual Health NYC - Trova cliniche per test STI, test HIV, PrEP, PEP, contraccezione e servizi di aborto"
        },
        "sections": {
            "telehealthDescription": "Ricevi pillole abortive per posta — nessuna visita di persona richiesta",
            "telehealthOptions": "Opzioni di telemedicina"
        },
        "services": {
            "genderAffirmingCare": "Cure per l'affermazione di genere"
        },
        "actions": {
            "cancelCorrection": "Annulla correzione"
        }
    },
    "tl": {
        "filters": {
            "borough": "Purok",
            "services": "Mga Serbisyo",
            "availability": "Pagkakaroon",
            "filters": "Mga Filter",
            "insuranceAndCost": "Seguro at Gastos"
        },
        "messages": {
            "search": "Maghanap",
            "selectBus": "Pumili ng mga ruta ng bus",
            "selectSubway": "Pumili ng mga linya ng tren",
            "hours": "Oras",
            "searchByName": "Maghanap gamit ang pangalan ng klinika...",
            "siteTitle": "Sexual Health NYC - Maghanap ng mga Klinika para sa STI Testing, HIV Testing, PrEP, PEP, Contraception, at Abortion Services"
        },
        "sections": {
            "telehealthDescription": "Tumanggap ng mga tableta sa pagpapalaglag sa pamamagitan ng koreo — hindi kailangan ng personal na pagbisita",
            "telehealthOptions": "Mga Opsyon sa Telehealth"
        },
        "services": {
            "genderAffirmingCare": "Pangangalagang Nagpapatibay ng Kasarian"
        },
        "actions": {
            "cancelCorrection": "Kanselahin ang pagwawasto"
        }
    },
    "pl": {
        "filters": {
            "borough": "Dzielnica",
            "services": "Usługi",
            "availability": "Dostępność",
            "filters": "Filtry",
            "insuranceAndCost": "Ubezpieczenie i koszty"
        },
        "messages": {
            "search": "Szukaj",
            "selectBus": "Wybierz linie autobusowe",
            "selectSubway": "Wybierz linie metra",
            "hours": "Godziny otwarcia",
            "searchByName": "Szukaj według nazwy kliniki...",
            "siteTitle": "Sexual Health NYC - Znajdź kliniki oferujące testy na STI, testy na HIV, PrEP, PEP, antykoncepcję i usługi aborcyjne"
        },
        "sections": {
            "telehealthDescription": "Otrzymaj tabletki poronne pocztą — wizyta osobista nie jest wymagana",
            "telehealthOptions": "Opcje telemedycyny"
        },
        "services": {
            "genderAffirmingCare": "Opieka afirmująca płeć"
        },
        "actions": {
            "cancelCorrection": "Anuluj korektę"
        }
    },
    "ur": {
        "filters": {
            "borough": "بورو",
            "services": "خدمات",
            "availability": "دستیابی",
            "filters": "فلٹرز",
            "insuranceAndCost": "انشورنس اور قیمت"
        },
        "messages": {
            "search": "تلاش کریں",
            "selectBus": "بس کے راستے منتخب کریں",
            "selectSubway": "سب وے لائنیں منتخب کریں",
            "hours": "اوقات",
            "searchByName": "کلینک کے نام سے تلاش کریں...",
            "siteTitle": "Sexual Health NYC - STI ٹیسٹنگ، HIV ٹیسٹنگ، PrEP، PEP، مانع حمل، اور اسقاط حمل کی خدمات کے لیے کلینک تلاش کریں"
        },
        "sections": {
            "telehealthDescription": "اسقاط حمل کی گولیاں بذریعہ ڈاک حاصل کریں — ذاتی دورے کی ضرورت نہیں",
            "telehealthOptions": "ٹیلی ہیلتھ کے اختیارات"
        },
        "services": {
            "genderAffirmingCare": "صنفی اثبات کی دیکھ بھال"
        },
        "actions": {
            "cancelCorrection": "تصحیح منسوخ کریں"
        }
    },
    "el": {
        "filters": {
            "borough": "Δήμος",
            "services": "Υπηρεσίες",
            "availability": "Διαθεσιμότητα",
            "filters": "Φίλτρα",
            "insuranceAndCost": "Ασφάλιση και Κόστος"
        },
        "messages": {
            "search": "Αναζήτηση",
            "selectBus": "Επιλέξτε διαδρομές λεωφορείων",
            "selectSubway": "Επιλέξτε γραμμές μετρό",
            "hours": "Ώρες λειτουργίας",
            "searchByName": "Αναζήτηση με όνομα κλινικής...",
            "siteTitle": "Sexual Health NYC - Βρείτε κλινικές για εξετάσεις ΣΜΝ, εξετάσεις HIV, PrEP, PEP, αντισύλληψη και υπηρεσίες άμβλωσης"
        },
        "sections": {
            "telehealthDescription": "Λάβετε χάπια άμβλωσης ταχυδρομικώς — δεν απαιτείται επίσκεψη",
            "telehealthOptions": "Επιλογές Τηλεϊατρικής"
        },
        "services": {
            "genderAffirmingCare": "Φροντίδα Επιβεβαίωσης Φύλου"
        },
        "actions": {
            "cancelCorrection": "Ακύρωση διόρθωσης"
        }
    },
    "he": {
        "filters": {
            "borough": "רובע",
            "services": "שירותים",
            "availability": "זמינות",
            "filters": "מסננים",
            "insuranceAndCost": "ביטוח ועלות"
        },
        "messages": {
            "search": "חיפוש",
            "selectBus": "בחר קווי אוטובוס",
            "selectSubway": "בחר קווי רכבת תחתית",
            "hours": "שעות פעילות",
            "searchByName": "חפש לפי שם המרפאה...",
            "siteTitle": "Sexual Health NYC - מצא מרפאות לבדיקות STI, בדיקות HIV, PrEP, PEP, אמצעי מניעה ושירותי הפלה"
        },
        "sections": {
            "telehealthDescription": "קבלי כדורי הפלה בדואר — אין צורך בביקור אישי",
            "telehealthOptions": "אפשרויות רפואה מרחוק"
        },
        "services": {
            "genderAffirmingCare": "טיפול לאישוש מגדרי"
        },
        "actions": {
            "cancelCorrection": "ביטול תיקון"
        }
    },
    "hi": {
        "filters": {
            "borough": "बोरो (Borough)",
            "services": "सेवाएं",
            "availability": "उपलब्धता",
            "filters": "फिल्टर",
            "insuranceAndCost": "बीमा और लागत"
        },
        "messages": {
            "search": "खोजें",
            "selectBus": "बस मार्ग चुनें",
            "selectSubway": "सबवे लाइनें चुनें",
            "hours": "समय",
            "searchByName": "क्लिनिक के नाम से खोजें...",
            "siteTitle": "Sexual Health NYC - STI परीक्षण, HIV परीक्षण, PrEP, PEP, गर्भनिरोधक और गर्भपात सेवाओं के लिए क्लीनिक खोजें"
        },
        "sections": {
            "telehealthDescription": "डाक द्वारा गर्भपात की गोलियां प्राप्त करें — व्यक्तिगत रूप से जाने की आवश्यकता नहीं",
            "telehealthOptions": "टेलीहेल्थ विकल्प"
        },
        "services": {
            "genderAffirmingCare": "लिंग पुष्टि देखभाल"
        },
        "actions": {
            "cancelCorrection": "सुधार रद्द करें"
        }
    },
    "ja": {
        "filters": {
            "borough": "地区",
            "services": "サービス",
            "availability": "空き状況",
            "filters": "フィルター",
            "insuranceAndCost": "保険と費用"
        },
        "messages": {
            "search": "検索",
            "selectBus": "バス路線を選択",
            "selectSubway": "地下鉄路線を選択",
            "hours": "営業時間",
            "searchByName": "クリニック名で検索...",
            "siteTitle": "Sexual Health NYC - STI検査、HIV検査、PrEP、PEP、避妊、中絶サービスのためのクリニックを探す"
        },
        "sections": {
            "telehealthDescription": "経口中絶薬を郵送で受け取る — 来院不要",
            "telehealthOptions": "遠隔医療オプション"
        },
        "services": {
            "genderAffirmingCare": "ジェンダーアファミングケア"
        },
        "actions": {
            "cancelCorrection": "修正をキャンセル"
        }
    },
    "yi": {
        "filters": {
            "borough": "באָראָ",
            "services": "דינסטן",
            "availability": "פאַראַנען",
            "filters": "פילטערס",
            "insuranceAndCost": "אינשורענס און קאָסטן"
        },
        "messages": {
            "search": "זוכן",
            "selectBus": "קלייַבן באַס רוטס",
            "selectSubway": "קלייַבן סאַבוויי ליינס",
            "hours": "שעהן",
            "searchByName": "זוכן דורך קליניק נאָמען...",
            "siteTitle": "Sexual Health NYC - געפֿינען קליניקס פֿאַר STI טעסטינג, היוו טעסטינג, PrEP, PEP, קאַנטראַסעפּשאַן און אַבאָרשאַן באַדינונגס"
        },
        "sections": {
            "telehealthDescription": "באַקומען אַבאָרשאַן פּילז דורך פּאָסט — קיין פערזענלעכע באַזוכן נייטיק",
            "telehealthOptions": "טעלעהעלטה אָפּציעס"
        },
        "services": {
            "genderAffirmingCare": "דזשענדער אַפערמינג קער"
        },
        "actions": {
            "cancelCorrection": "באָטל מאַכן קערעקשאַן"
        }
    },
    "pt": {
        "filters": {
            "borough": "Distrito",
            "services": "Serviços",
            "availability": "Disponibilidade",
            "filters": "Filtros",
            "insuranceAndCost": "Seguro e Custo"
        },
        "messages": {
            "search": "Pesquisar",
            "selectBus": "Selecionar rotas de ônibus",
            "selectSubway": "Selecionar linhas de metrô",
            "hours": "Horário",
            "searchByName": "Pesquisar por nome da clínica...",
            "siteTitle": "Sexual Health NYC - Encontre clínicas para testes de IST, testes de HIV, PrEP, PEP, contracepção e serviços de aborto"
        },
        "sections": {
            "telehealthDescription": "Receba pílulas abortivas pelo correio — não é necessária visita presencial",
            "telehealthOptions": "Opções de telessaúde"
        },
        "services": {
            "genderAffirmingCare": "Cuidados de afirmação de gênero"
        },
        "actions": {
            "cancelCorrection": "Cancelar correção"
        }
    },
    "vi": {
        "filters": {
            "borough": "Quận",
            "services": "Dịch vụ",
            "availability": "Tình trạng sẵn có",
            "filters": "Bộ lọc",
            "insuranceAndCost": "Bảo hiểm & Chi phí"
        },
        "messages": {
            "search": "Tìm kiếm",
            "selectBus": "Chọn tuyến xe buýt",
            "selectSubway": "Chọn tuyến tàu điện ngầm",
            "hours": "Giờ làm việc",
            "searchByName": "Tìm kiếm theo tên phòng khám...",
            "siteTitle": "Sexual Health NYC - Tìm phòng khám xét nghiệm STI, xét nghiệm HIV, PrEP, PEP, tránh thai và dịch vụ phá thai"
        },
        "sections": {
            "telehealthDescription": "Nhận thuốc phá thai qua đường bưu điện — không cần đến trực tiếp",
            "telehealthOptions": "Tùy chọn khám từ xa"
        },
        "services": {
            "genderAffirmingCare": "Chăm sóc khẳng định giới tính"
        },
        "actions": {
            "cancelCorrection": "Hủy sửa đổi"
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