import json
import os

updates = {
    'es': {
        "genderAffirmingCare": "Atención de afirmación de género",
        "genderAffirmingYouth": "Jóvenes (menores de 19)",
        "genderAffirmingHormones": "Terapia hormonal",
        "genderAffirmingSurgery": "Cirugía",
        "prepServices": "Servicios de PrEP",
        "prepStarter": "Inicio inmediato (Express)",
        "prepPrescriber": "Prescriptor continuo",
        "prepAP": "PrEP-AP (Ayuda financiera)",
        "virtualTelehealth": "Virtual / Telesalud",
        "clearAllFilters": "Borrar todos los filtros",
        "closeFilters": "Cerrar filtros"
    },
    'zh': {
        "genderAffirmingCare": "性别肯定护理",
        "genderAffirmingYouth": "青少年（19岁以下）",
        "genderAffirmingHormones": "激素治疗",
        "genderAffirmingSurgery": "手术",
        "prepServices": "PrEP 服务",
        "prepStarter": "立即开始 (快速)",
        "prepPrescriber": "持续处方",
        "prepAP": "PrEP-AP (经济援助)",
        "virtualTelehealth": "虚拟 / 远程医疗",
        "clearAllFilters": "清除所有筛选器",
        "closeFilters": "关闭筛选器"
    },
    'ru': {
        "genderAffirmingCare": "Гендерно-подтверждающий уход",
        "genderAffirmingYouth": "Молодежь (до 19 лет)",
        "genderAffirmingHormones": "Гормональная терапия",
        "genderAffirmingSurgery": "Операция",
        "prepServices": "Услуги PrEP",
        "prepStarter": "Немедленное начало (Экспресс)",
        "prepPrescriber": "Постоянный назначивший врач",
        "prepAP": "PrEP-AP (Финансовая помощь)",
        "virtualTelehealth": "Виртуальный / Телемедицина",
        "clearAllFilters": "Очистить все фильтры",
        "closeFilters": "Закрыть фильтры"
    },
    'bn': {
        "genderAffirmingCare": "লিঙ্গ নিশ্চিতকরণ যত্ন",
        "genderAffirmingYouth": "যুবক (১৯ বছরের নিচে)",
        "genderAffirmingHormones": "হরমোন থেরাপি",
        "genderAffirmingSurgery": "অস্ত্রোপচার",
        "prepServices": "PrEP পরিষেবা",
        "prepStarter": "তাৎক্ষণিক শুরু (এক্সপ্রেস)",
        "prepPrescriber": "চলমান প্রেসক্রাইবার",
        "prepAP": "PrEP-AP (আর্থিক সহায়তা)",
        "virtualTelehealth": "ভার্চুয়াল / টেলিহেলথ",
        "clearAllFilters": "সব ফিল্টার মুছুন",
        "closeFilters": "ফিল্টার বন্ধ করুন"
    },
    'ht': {
        "genderAffirmingCare": "Swen Afime Sèks",
        "genderAffirmingYouth": "Jèn (Mwens pase 19)",
        "genderAffirmingHormones": "Terapi Omonal",
        "genderAffirmingSurgery": "Operasyon",
        "prepServices": "Sèvis PrEP",
        "prepStarter": "Kòmansman Imedya (Ekspres)",
        "prepPrescriber": "Preskriptè Kontini",
        "prepAP": "PrEP-AP (Èd Finansyè)",
        "virtualTelehealth": "Vityèl / Telesante",
        "clearAllFilters": "Efase tout filtè",
        "closeFilters": "Fèmen filtè"
    },
    'fr': {
        "genderAffirmingCare": "Soins d'affirmation de genre",
        "genderAffirmingYouth": "Jeunes (moins de 19 ans)",
        "genderAffirmingHormones": "Thérapie hormonale",
        "genderAffirmingSurgery": "Chirurgie",
        "prepServices": "Services de PrEP",
        "prepStarter": "Démarrage immédiat (Express)",
        "prepPrescriber": "Prescripteur continu",
        "prepAP": "PrEP-AP (Aide financière)",
        "virtualTelehealth": "Virtuel / Télésanté",
        "clearAllFilters": "Effacer tous les filtres",
        "closeFilters": "Fermer les filtres"
    },
    'ar': {
        "genderAffirmingCare": "رعاية تأكيد الجنس",
        "genderAffirmingYouth": "الشباب (تحت 19)",
        "genderAffirmingHormones": "العلاج الهرموني",
        "genderAffirmingSurgery": "الجراحة",
        "prepServices": "خدمات PrEP",
        "prepStarter": "بدء فوري (سريع)",
        "prepPrescriber": "واصف مستمر",
        "prepAP": "PrEP-AP (مساعدة مالية)",
        "virtualTelehealth": "افتراضي / رعاية صحية عن بعد",
        "clearAllFilters": "مسح جميع الفلاتر",
        "closeFilters": "إغلاق الفلاتر"
    },
    'ko': {
        "genderAffirmingCare": "성별 확인 케어",
        "genderAffirmingYouth": "청소년 (19세 미만)",
        "genderAffirmingHormones": "호르몬 요법",
        "genderAffirmingSurgery": "수술",
        "prepServices": "PrEP 서비스",
        "prepStarter": "즉시 시작 (급행)",
        "prepPrescriber": "지속 처방",
        "prepAP": "PrEP-AP (재정 지원)",
        "virtualTelehealth": "가상 / 원격 의료",
        "clearAllFilters": "모든 필터 지우기",
        "closeFilters": "필터 닫기"
    },
    'it': {
        "genderAffirmingCare": "Cura di affermazione di genere",
        "genderAffirmingYouth": "Giovani (sotto i 19 anni)",
        "genderAffirmingHormones": "Terapia ormonale",
        "genderAffirmingSurgery": "Chirurgia",
        "prepServices": "Servizi PrEP",
        "prepStarter": "Inizio Immediato (Express)",
        "prepPrescriber": "Prescrittore continuo",
        "prepAP": "PrEP-AP (Aiuto finanziario)",
        "virtualTelehealth": "Virtuale / Telemedicina",
        "clearAllFilters": "Cancella tutti i filtri",
        "closeFilters": "Chiudi filtri"
    },
    'tl': {
        "genderAffirmingCare": "Pangangalaga sa Pagpapatunay ng Kasarian",
        "genderAffirmingYouth": "Kabataan (Wala pang 19)",
        "genderAffirmingHormones": "Hormone Therapy",
        "genderAffirmingSurgery": "Operasyon",
        "prepServices": "Mga Serbisyo ng PrEP",
        "prepStarter": "Agarang Pagsisimula (Express)",
        "prepPrescriber": "Patuloy na Prescriber",
        "prepAP": "PrEP-AP (Pinansyal na Tulong)",
        "virtualTelehealth": "Virtual / Telehealth",
        "clearAllFilters": "I-clear ang Lahat ng Filter",
        "closeFilters": "Isara ang Mga Filter"
    },
    'pl': {
        "genderAffirmingCare": "Opieka afirmacji płci",
        "genderAffirmingYouth": "Młodzież (poniżej 19 lat)",
        "genderAffirmingHormones": "Terapia hormonalna",
        "genderAffirmingSurgery": "Chirurgia",
        "prepServices": "Usługi PrEP",
        "prepStarter": "Natychmiastowe rozpoczęcie (Express)",
        "prepPrescriber": "Ciągły lekarz przepisujący",
        "prepAP": "PrEP-AP (Pomoc finansowa)",
        "virtualTelehealth": "Wirtualne / Telemedycyna",
        "clearAllFilters": "Wyczyść wszystkie filtry",
        "closeFilters": "Zamknij filtry"
    },
    'ur': {
        "genderAffirmingCare": "جینڈر افارمنگ کیئر",
        "genderAffirmingYouth": "نوجوان (19 سال سے کم)",
        "genderAffirmingHormones": "ہارمون تھراپی",
        "genderAffirmingSurgery": "سرجری",
        "prepServices": "PrEP خدمات",
        "prepStarter": "فوری آغاز (ایکسپریس)",
        "prepPrescriber": "مسلسل تجویز کرنے والا",
        "prepAP": "PrEP-AP (مالی امداد)",
        "virtualTelehealth": "ورچوئل / ٹیلی ہیلتھ",
        "clearAllFilters": "تمام فلٹرز صاف کریں",
        "closeFilters": "فلٹرز بند کریں"
    },
    'el': {
        "genderAffirmingCare": "Φροντίδα Επιβεβαίωσης Φύλου",
        "genderAffirmingYouth": "Νέοι (κάτω των 19)",
        "genderAffirmingHormones": "Ορμονοθεραπεία",
        "genderAffirmingSurgery": "Χειρουργείο",
        "prepServices": "Υπηρεσίες PrEP",
        "prepStarter": "Άμεση Έναρξη (Express)",
        "prepPrescriber": "Συνεχής Συνταγογράφος",
        "prepAP": "PrEP-AP (Οικονομική Βοήθεια)",
        "virtualTelehealth": "Εικονική / Τηλεϊατρική",
        "clearAllFilters": "Εκκαθάριση όλων των φίλτρων",
        "closeFilters": "Κλείσιμο φίλτρων"
    },
    'he': {
        "genderAffirmingCare": "טיפול להתאמה מגדרית",
        "genderAffirmingYouth": "נוער (מתחת לגיל 19)",
        "genderAffirmingHormones": "טיפול הורמונלי",
        "genderAffirmingSurgery": "ניתוח",
        "prepServices": "שירותי PrEP",
        "prepStarter": "התחלה מיידית (אקספרס)",
        "prepPrescriber": "רושם קבוע",
        "prepAP": "PrEP-AP (סיוע כלכלי)",
        "virtualTelehealth": "וירטואלי / טלה-רפואה",
        "clearAllFilters": "נקה את כל המסננים",
        "closeFilters": "סגור מסננים"
    },
    'hi': {
        "genderAffirmingCare": "लिंग-पुष्टि देखभाल",
        "genderAffirmingYouth": "युवा (19 से कम)",
        "genderAffirmingHormones": "हार्मोन थेरेपी",
        "genderAffirmingSurgery": "सर्जरी",
        "prepServices": "PrEP सेवाएं",
        "prepStarter": "तत्काल प्रारंभ (एक्सप्रेस)",
        "prepPrescriber": "जारी रखने वाला",
        "prepAP": "PrEP-AP (वित्तीय सहायता)",
        "virtualTelehealth": "वर्चुअल / टेलीहेल्थ",
        "clearAllFilters": "सभी फिल्टर साफ करें",
        "closeFilters": "फिल्टर बंद करें"
    },
    'ja': {
        "genderAffirmingCare": "性別肯定医療",
        "genderAffirmingYouth": "若年層（19歳未満）",
        "genderAffirmingHormones": "ホルモン療法",
        "genderAffirmingSurgery": "手術",
        "prepServices": "PrEPサービス",
        "prepStarter": "即時開始（エクスプレス）",
        "prepPrescriber": "継続処方者",
        "prepAP": "PrEP-AP（経済的支援）",
        "virtualTelehealth": "バーチャル／遠隔医療",
        "clearAllFilters": "すべてのフィルターをクリア",
        "closeFilters": "フィルターを閉じる"
    },
    'yi': {
        "genderAffirmingCare": "גענדער אַפירמינג קער",
        "genderAffirmingYouth": "יוגנט (אונטער 19)",
        "genderAffirmingHormones": "האָרמאָן טעראַפּיע",
        "genderAffirmingSurgery": "אָפּעראַציע",
        "prepServices": "PrEP סערוויסעס",
        "prepStarter": "גלייך אָנהייב (עקספּרעסס)",
        "prepPrescriber": "קעסיידערדיק פּרעסקריבער",
        "prepAP": "PrEP-AP (פינאַנציעל הילף)",
        "virtualTelehealth": "ווירטואַל / טעלעהעלטה",
        "clearAllFilters": "ריין אַלע פילטערס",
        "closeFilters": "שליסן פילטערס"
    },
    'pt': {
        "genderAffirmingCare": "Cuidados de Afirmação de Gênero",
        "genderAffirmingYouth": "Jovens (menores de 19 anos)",
        "genderAffirmingHormones": "Terapia Hormonal",
        "genderAffirmingSurgery": "Cirurgia",
        "prepServices": "Serviços de PrEP",
        "prepStarter": "Início Imediato (Express)",
        "prepPrescriber": "Prescritor Contínuo",
        "prepAP": "PrEP-AP (Apoio Financeiro)",
        "virtualTelehealth": "Virtual / Telessaúde",
        "clearAllFilters": "Limpar todos os filtros",
        "closeFilters": "Fechar filtros"
    },
    'vi': {
        "genderAffirmingCare": "Chăm sóc xác nhận giới tính",
        "genderAffirmingYouth": "Thanh thiếu niên (dưới 19 tuổi)",
        "genderAffirmingHormones": "Liệu pháp hormone",
        "genderAffirmingSurgery": "Phẫu thuật",
        "prepServices": "Dịch vụ PrEP",
        "prepStarter": "Bắt đầu ngay lập tức (Express)",
        "prepPrescriber": "Người kê đơn liên tục",
        "prepAP": "PrEP-AP (Hỗ trợ tài chính)",
        "virtualTelehealth": "Ảo / Y tế từ xa",
        "clearAllFilters": "Xóa tất cả bộ lọc",
        "closeFilters": "Đóng bộ lọc"
    }
}

for lang, messages in updates.items():
    path = f'public/locales/{lang}/filters.json'
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        data.update(messages)
        
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Updated {lang}")
    else:
        print(f"Skipped {lang} - file not found")
