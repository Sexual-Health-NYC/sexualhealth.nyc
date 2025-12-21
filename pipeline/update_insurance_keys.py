import json
import os

updates = {
    'es': {
        "medicaidStraight": "Medicaid Directo",
        "medicaidManaged": "Medicaid Administrado",
        "medicaidBoth": "Medicaid Directo y Administrado",
        "medicaidMcos": "Planes: {{mcos}}",
        "medicaidCallToVerify": "(llamar para verificar)"
    },
    'zh': {
        "medicaidStraight": "直接 Medicaid",
        "medicaidManaged": "Medicaid 管理式医疗",
        "medicaidBoth": "直接和管理式 Medicaid",
        "medicaidMcos": "计划: {{mcos}}",
        "medicaidCallToVerify": "(致电核实)"
    },
    'ru': {
        "medicaidStraight": "Прямой Medicaid",
        "medicaidManaged": "Управляемый Medicaid",
        "medicaidBoth": "Прямой и управляемый Medicaid",
        "medicaidMcos": "Планы: {{mcos}}",
        "medicaidCallToVerify": "(позвоните для уточнения)"
    },
    'bn': {
        "medicaidStraight": "সরাসরি Medicaid",
        "medicaidManaged": "ম্যানেজড Medicaid",
        "medicaidBoth": "সরাসরি এবং ম্যানেজড Medicaid",
        "medicaidMcos": "প্ল্যান: {{mcos}}",
        "medicaidCallToVerify": "(যাচাই করতে কল করুন)"
    },
    'ht': {
        "medicaidStraight": "Medicaid Dirèk",
        "medicaidManaged": "Medicaid Jere",
        "medicaidBoth": "Medicaid Dirèk ak Jere",
        "medicaidMcos": "Plan: {{mcos}}",
        "medicaidCallToVerify": "(rele pou verifye)"
    },
    'fr': {
        "medicaidStraight": "Medicaid direct",
        "medicaidManaged": "Medicaid géré",
        "medicaidBoth": "Medicaid direct et géré",
        "medicaidMcos": "Plans : {{mcos}}",
        "medicaidCallToVerify": "(appelez pour vérifier)"
    },
    'ar': {
        "medicaidStraight": "Medicaid المباشر",
        "medicaidManaged": "Medicaid المدار",
        "medicaidBoth": "Medicaid المباشر والمدار",
        "medicaidMcos": "الخطط: {{mcos}}",
        "medicaidCallToVerify": "(اتصل للتحقق)"
    },
    'ko': {
        "medicaidStraight": "일반 Medicaid",
        "medicaidManaged": "관리형 Medicaid",
        "medicaidBoth": "일반 및 관리형 Medicaid",
        "medicaidMcos": "플랜: {{mcos}}",
        "medicaidCallToVerify": "(전화 확인 요망)"
    },
    'it': {
        "medicaidStraight": "Medicaid diretto",
        "medicaidManaged": "Medicaid gestito",
        "medicaidBoth": "Medicaid diretto e gestito",
        "medicaidMcos": "Piani: {{mcos}}",
        "medicaidCallToVerify": "(chiama per verificare)"
    },
    'tl': {
        "medicaidStraight": "Direktang Medicaid",
        "medicaidManaged": "Managed na Medicaid",
        "medicaidBoth": "Direkta at Managed na Medicaid",
        "medicaidMcos": "Mga Plano: {{mcos}}",
        "medicaidCallToVerify": "(tumawag upang i-verify)"
    },
    'pl': {
        "medicaidStraight": "Bezpośredni Medicaid",
        "medicaidManaged": "Zarządzany Medicaid",
        "medicaidBoth": "Bezpośredni i zarządzany Medicaid",
        "medicaidMcos": "Plany: {{mcos}}",
        "medicaidCallToVerify": "(zadzwoń, aby sprawdzić)"
    },
    'ur': {
        "medicaidStraight": "براہ راست Medicaid",
        "medicaidManaged": "مینیجڈ Medicaid",
        "medicaidBoth": "براہ راست اور مینیجڈ Medicaid",
        "medicaidMcos": "منصوبے: {{mcos}}",
        "medicaidCallToVerify": "(تصدیق کے لیے کال کریں)"
    },
    'el': {
        "medicaidStraight": "Απευθείας Medicaid",
        "medicaidManaged": "Διαχειριζόμενο Medicaid",
        "medicaidBoth": "Απευθείας και Διαχειριζόμενο Medicaid",
        "medicaidMcos": "Σχέδια: {{mcos}}",
        "medicaidCallToVerify": "(καλέστε για επαλήθευση)"
    },
    'he': {
        "medicaidStraight": "Medicaid ישיר",
        "medicaidManaged": "Medicaid מנוהל",
        "medicaidBoth": "Medicaid ישיר ומנוהל",
        "medicaidMcos": "תוכניות: {{mcos}}",
        "medicaidCallToVerify": "(התקשר לאימות)"
    },
    'hi': {
        "medicaidStraight": "सीधा Medicaid",
        "medicaidManaged": "प्रबंधित Medicaid",
        "medicaidBoth": "सीधा और प्रबंधित Medicaid",
        "medicaidMcos": "योजनाएं: {{mcos}}",
        "medicaidCallToVerify": "(सत्यापन के लिए कॉल करें)"
    },
    'ja': {
        "medicaidStraight": "直接Medicaid",
        "medicaidManaged": "管理型Medicaid",
        "medicaidBoth": "直接および管理型Medicaid",
        "medicaidMcos": "プラン: {{mcos}}",
        "medicaidCallToVerify": "(電話で確認)"
    },
    'yi': {
        "medicaidStraight": "דירעקט Medicaid",
        "medicaidManaged": "מאַנאַדזשד Medicaid",
        "medicaidBoth": "דירעקט און מאַנאַדזשד Medicaid",
        "medicaidMcos": "פּלענער: {{mcos}}",
        "medicaidCallToVerify": "(רופן צו באַשטעטיקן)"
    },
    'pt': {
        "medicaidStraight": "Medicaid Direto",
        "medicaidManaged": "Medicaid Gerido",
        "medicaidBoth": "Medicaid Direto e Gerido",
        "medicaidMcos": "Planos: {{mcos}}",
        "medicaidCallToVerify": "(ligue para verificar)"
    },
    'vi': {
        "medicaidStraight": "Medicaid Trực tiếp",
        "medicaidManaged": "Medicaid Được quản lý",
        "medicaidBoth": "Medicaid Trực tiếp & Được quản lý",
        "medicaidMcos": "Các gói: {{mcos}}",
        "medicaidCallToVerify": "(gọi để xác minh)"
    }
}

for lang, new_keys in updates.items():
    path = f'public/locales/{lang}/insurance.json'
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        data.update(new_keys)
        
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Updated {lang}")
    else:
        print(f"Skipped {lang} - file not found")
