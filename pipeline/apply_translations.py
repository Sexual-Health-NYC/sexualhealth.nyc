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
        },
        "footer": {
            "about": "Acerca de",
            "privacy": "Privacidad",
            "changeLanguage": "Cambiar idioma",
            "selectLanguage": "Seleccionar idioma",
            "aboutText1": "Este directorio gratuito ayuda a los neoyorquinos a encontrar servicios de salud sexual, incluyendo pruebas de ITS, pruebas de VIH, PrEP, anticoncepción, servicios de aborto y atención de afirmación de género.",
            "aboutText2": "Construido por voluntarios. No afiliado a ninguna clínica u organización de salud.",
            "aboutDisclaimer": "Este directorio es solo para fines informativos. No somos un proveedor de atención médica. Siempre verifique la información directamente con las clínicas antes de visitarlas.",
            "privacyIntro": "Su privacidad es importante. Este sitio está diseñado para recopilar la menor cantidad de datos posible.",
            "privacyNoAccounts": "No se recopilan cuentas ni datos personales",
            "privacyAnalytics": "Análisis centrados en la privacidad (GoatCounter): sin cookies, sin seguimiento entre sitios",
            "privacyLanguage": "Preferencia de idioma almacenada localmente en su navegador únicamente",
            "privacyMaps": "Mapas proporcionados por Mapbox (su política de privacidad se aplica al uso del mapa)",
            "privacyCorrections": "Los envíos de correcciones se envían por correo electrónico a los mantenedores y luego se eliminan",
            "privacyNoCookies": "No utilizamos cookies publicitarias ni vendemos ningún dato."
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
        },
        "footer": {
            "about": "关于",
            "privacy": "隐私",
            "changeLanguage": "更改语言",
            "selectLanguage": "选择语言",
            "aboutText1": "本免费指南旨在帮助纽约人寻找性健康服务，包括性传播感染检测、艾滋病毒检测、PrEP、避孕、堕胎服务和性别肯定护理。",
            "aboutText2": "由志愿者建立。不隶属于任何诊所或医疗机构。",
            "aboutDisclaimer": "本指南仅供参考。我们并非医疗服务提供者。访问前请务必直接向诊所核实信息。",
            "privacyIntro": "您的隐私至关重要。本网站的设计宗旨是收集尽可能少的数据。",
            "privacyNoAccounts": "不收集账户或个人数据",
            "privacyAnalytics": "注重隐私的分析 (GoatCounter) — 无 Cookie，无跨站跟踪",
            "privacyLanguage": "语言偏好仅本地存储在您的浏览器中",
            "privacyMaps": "地图由 Mapbox 提供（其隐私政策适用于地图使用）",
            "privacyCorrections": "更正提交内容将通过电子邮件发送给维护者，然后删除",
            "privacyNoCookies": "我们不使用广告 Cookie，也不出售任何数据。"
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
        },
        "footer": {
            "about": "О проекте",
            "privacy": "Конфиденциальность",
            "changeLanguage": "Сменить язык",
            "selectLanguage": "Выберите язык",
            "aboutText1": "Этот бесплатный справочник помогает жителям Нью-Йорка найти услуги в области сексуального здоровья, включая тестирование на ИППП и ВИЧ, PrEP, контрацепцию, услуги по прерыванию беременности и гендерно-аффирмативную помощь.",
            "aboutText2": "Создано волонтерами. Не связано ни с одной клиникой или медицинской организацией.",
            "aboutDisclaimer": "Этот справочник предназначен только для информационных целей. Мы не являемся поставщиком медицинских услуг. Всегда проверяйте информацию непосредственно в клиниках перед посещением.",
            "privacyIntro": "Ваша конфиденциальность важна. Этот сайт разработан для сбора как можно меньшего количества данных.",
            "privacyNoAccounts": "Аккаунты или персональные данные не собираются",
            "privacyAnalytics": "Аналитика, ориентированная на конфиденциальность (GoatCounter): без файлов cookie, без отслеживания между сайтами",
            "privacyLanguage": "Языковые настройки хранятся только локально в вашем браузере",
            "privacyMaps": "Карты предоставлены Mapbox (их политика конфиденциальности применяется к использованию карт)",
            "privacyCorrections": "Запросы на исправление отправляются по электронной почте модераторам, а затем удаляются",
            "privacyNoCookies": "Мы не используем рекламные файлы cookie и не продаем данные."
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
        },
        "footer": {
            "about": "À propos",
            "privacy": "Confidentialité",
            "changeLanguage": "Changer de langue",
            "selectLanguage": "Sélectionner la langue",
            "aboutText1": "Cet annuaire gratuit aide les New-Yorkais à trouver des services de santé sexuelle, notamment le dépistage des IST et du VIH, la PrEP, la contraception, les soins liés à l'avortement et les soins d'affirmation de genre.",
            "aboutText2": "Construit par des bénévoles. Non affilié à une clinique ou à un organisme de santé.",
            "aboutDisclaimer": "Cet annuaire est fourni à titre informatif uniquement. Nous ne sommes pas un fournisseur de soins de santé. Vérifiez toujours les informations directement auprès des cliniques avant de vous déplacer.",
            "privacyIntro": "Votre vie privée est importante. Ce site est conçu pour collecter le moins de données possible.",
            "privacyNoAccounts": "Aucun compte ni donnée personnelle collectée",
            "privacyAnalytics": "Analyses axées sur la confidentialité (GoatCounter) — pas de cookies, pas de suivi intersite",
            "privacyLanguage": "Préférence linguistique stockée localement dans votre navigateur uniquement",
            "privacyMaps": "Cartes fournies par Mapbox (leur politique de confidentialité s'applique à l'utilisation des cartes)",
            "privacyCorrections": "Les demandes de correction sont envoyées par e-mail aux responsables, puis supprimées",
            "privacyNoCookies": "Nous n'utilisons pas de cookies publicitaires et ne vendons aucune donnée."
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
        },
        "footer": {
            "about": "Konsènan",
            "privacy": "Konfidansyalite",
            "changeLanguage": "Chanje lang",
            "selectLanguage": "Chwazi lang",
            "aboutText1": "Anyè gratis sa a ede moun Nouyòk jwenn sèvis sante seksyèl tankou tès STI, tès VIH, PrEP, kontrasepsyon, swen avòtman, ak swen afimasyon sèks.",
            "aboutText2": "Konstwi pa volontè. Pa afilye ak okenn klinik oswa òganizasyon swen sante.",
            "aboutDisclaimer": "Anyè sa a se pou enfòmasyon sèlman. Nou pa yon founisè swen sante. Toujou verifye enfòmasyon yo dirèkteman ak klinik yo anvan ou vizite.",
            "privacyIntro": "Konfidansyalite w enpòtan. Sit sa a fèt pou kolekte pi piti kantite done posib.",
            "privacyNoAccounts": "Pa gen kont oswa done pèsonèl yo kolekte",
            "privacyAnalytics": "Analiz konsantre sou konfidansyalite (GoatCounter) — pa gen bonbon, pa gen okenn swivi atravè sit yo",
            "privacyLanguage": "Preferans lang yo estoke lokalman nan navigatè w la sèlman",
            "privacyMaps": "Mapbox bay kat yo (politik konfidansyalite yo aplike pou itilizasyon kat yo)",
            "privacyCorrections": "Soumisyon koreksyon yo voye pa imèl bay administratè yo, apre sa yo efase yo",
            "privacyNoCookies": "Nou pa sèvi ak bonbon piblisite oswa vann okenn done."
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
            "siteTitle": "Sexual Health NYC - STI পরীক্ষা, HIV পরীক্ষা, PrEP, PEP, গর্ভনিরোধক, এবং গর্ভপাত পরিষেবার জন্য ক্লিনিক খুঁজুন"
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
        },
        "footer": {
            "about": "সম্পর্কে",
            "privacy": "গোপনীয়তা",
            "changeLanguage": "ভাষা পরিবর্তন করুন",
            "selectLanguage": "ভাষা নির্বাচন করুন",
            "aboutText1": "এই বিনামূল্যের নির্দেশিকা নিউ ইয়র্কবাসীদের যৌন স্বাস্থ্য পরিষেবা খুঁজে পেতে সাহায্য করে যার মধ্যে রয়েছে STI পরীক্ষা, HIV পরীক্ষা, PrEP, গর্ভনিরোধক, গর্ভপাত যত্ন এবং লিঙ্গ নিশ্চিতকরণ সেবা।",
            "aboutText2": "স্বেচ্ছাসেবকদের দ্বারা নির্মিত। কোনো ক্লিনিক বা স্বাস্থ্যসেবা সংস্থার সাথে অনুমোদিত নয়।",
            "aboutDisclaimer": "এই নির্দেশিকাটি শুধুমাত্র তথ্যের উদ্দেশ্যে। আমরা কোনো স্বাস্থ্যসেবা প্রদানকারী নই। পরিদর্শনের আগে সর্বদা ক্লিনিকের সাথে সরাসরি তথ্য যাচাই করুন।",
            "privacyIntro": "আপনার গোপনীয়তা গুরুত্বপূর্ণ। এই সাইটটি যতটা সম্ভব কম ডেটা সংগ্রহ করার জন্য ডিজাইন করা হয়েছে।",
            "privacyNoAccounts": "কোনো অ্যাকাউন্ট বা ব্যক্তিগত ডেটা সংগ্রহ করা হয় না",
            "privacyAnalytics": "গোপনীয়তা-কেন্দ্রিক বিশ্লেষণ (GoatCounter) - কোনো কুকি নেই, সাইট জুড়ে কোনো ট্র্যাকিং নেই",
            "privacyLanguage": "ভাষার পছন্দ শুধুমাত্র আপনার ব্রাউজারে স্থানীয়ভাবে সংরক্ষিত হয়",
            "privacyMaps": "ম্যাপবক্স (Mapbox) দ্বারা মানচিত্র সরবরাহ করা হয়েছে (মানচিত্র ব্যবহারের ক্ষেত্রে তাদের গোপনীয়তা নীতি প্রযোজ্য)",
            "privacyCorrections": "সংশোধন প্রস্তাবগুলো রক্ষণাবেক্ষণকারীদের ইমেল করা হয়, তারপর মুছে ফেলা হয়",
            "privacyNoCookies": "আমরা বিজ্ঞাপন কুকি ব্যবহার করি না বা কোনো ডেটা বিক্রি করি না।"
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
        },
        "footer": {
            "about": "حول المشروع",
            "privacy": "الخصوصية",
            "changeLanguage": "تغيير اللغة",
            "selectLanguage": "اختر اللغة",
            "aboutText1": "يساعد هذا الدليل المجاني سكان نيويورك في العثور على خدمات الصحة الجنسية بما في ذلك فحص الأمراض المنقولة جنسيًا، وفحص فيروس نقص المناعة البشرية، وPrEP، ومنع الحمل، ورعاية الإجهاض، والرعاية المؤكدة للجنس.",
            "aboutText2": "تم بناؤه من قبل متطوعين. لا يتبع أي عيادة أو منظمة رعاية صحية.",
            "aboutDisclaimer": "هذا الدليل لأغراض إعلامية فقط. نحن لسنا مزود رعاية صحية. تحقق دائمًا من المعلومات مباشرة مع العيادات قبل الزيارة.",
            "privacyIntro": "خصوصيتك تهمنا. تم تصميم هذا الموقع لجمع أقل قدر ممكن من البيانات.",
            "privacyNoAccounts": "لا يتم جمع حسابات أو بيانات شخصية",
            "privacyAnalytics": "تحليلات تركز على الخصوصية (GoatCounter) - لا توجد ملفات تعريف ارتباط، ولا يوجد تتبع عبر المواقع",
            "privacyLanguage": "يتم تخزين تفضيلات اللغة محليًا في متصفحك فقط",
            "privacyMaps": "الخرائط مقدمة من Mapbox (تنطبق سياسة الخصوصية الخاصة بهم على استخدام الخرائط)",
            "privacyCorrections": "يتم إرسال تصحيحات البيانات عبر البريد الإلكتروني إلى المسؤولين، ثم يتم حذفها",
            "privacyNoCookies": "نحن لا نستخدم ملفات تعريف الارتباط الإعلانية ولا نبيع أي بيانات."
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
        },
        "footer": {
            "about": "정보",
            "privacy": "개인정보 보호",
            "changeLanguage": "언어 변경",
            "selectLanguage": "언어 선택",
            "aboutText1": "이 무료 디렉토리는 뉴욕 시민들이 성병 검사, HIV 검사, PrEP, 피임, 낙태 케어, 성별 긍정 케어를 포함한 성 건강 서비스를 찾을 수 있도록 돕습니다.",
            "aboutText2": "자원봉사자들이 제작했습니다. 어떠한 클리닉이나 의료 기관과도 관련이 없습니다.",
            "aboutDisclaimer": "이 디렉토리는 정보 제공 목적으로만 제공됩니다. 본 서비스는 의료 제공자가 아닙니다. 방문 전 항상 클리닉에 직접 정보를 확인하십시오.",
            "privacyIntro": "귀하의 개인정보는 소중합니다. 이 사이트는 가능한 한 적은 데이터를 수집하도록 설계되었습니다.",
            "privacyNoAccounts": "계정이나 개인 데이터 수집 없음",
            "privacyAnalytics": "개인정보 보호 중심 분석 (GoatCounter) - 쿠키 없음, 사이트 간 추적 없음",
            "privacyLanguage": "언어 설정은 귀하의 브라우저에만 로컬로 저장됩니다",
            "privacyMaps": "Mapbox에서 제공하는 지도 (지도 사용 시 해당 서비스의 개인정보 처리방침이 적용됨)",
            "privacyCorrections": "수정 제출 사항은 관리자에게 이메일로 전송된 후 삭제됩니다",
            "privacyNoCookies": "광고용 쿠키를 사용하지 않으며 데이터를 판매하지 않습니다."
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
        },
        "footer": {
            "about": "Informazioni",
            "privacy": "Privacy",
            "changeLanguage": "Cambia lingua",
            "selectLanguage": "Seleziona lingua",
            "aboutText1": "Questa directory gratuita aiuta i newyorkesi a trovare servizi di salute sessuale, inclusi test STI, test HIV, PrEP, contraccezione, interruzione di gravidanza e cure per l'affermazione di genere.",
            "aboutText2": "Realizzato da volontari. Non affiliato ad alcuna clinica o organizzazione sanitaria.",
            "aboutDisclaimer": "Questa directory è solo a scopo informativo. Non siamo un fornitore di assistenza sanitaria. Verificare sempre le informazioni direttamente con le cliniche prima della visita.",
            "privacyIntro": "La tua privacy è importante. Questo sito è progettato per raccogliere meno dati possibile.",
            "privacyNoAccounts": "Nessun account o dato personale raccolto",
            "privacyAnalytics": "Analitica focalizzata sulla privacy (GoatCounter): niente cookie, niente tracciamento tra siti",
            "privacyLanguage": "Preferenza della lingua memorizzata solo localmente nel browser",
            "privacyMaps": "Mappe fornite da Mapbox (la loro politica sulla privacy si applica all'uso delle mappe)",
            "privacyCorrections": "Le segnalazioni di correzione vengono inviate via e-mail ai gestori, quindi eliminate",
            "privacyNoCookies": "Non utilizziamo cookie pubblicitari né vendiamo alcun dato."
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
        },
        "footer": {
            "about": "Tungkol sa Amin",
            "privacy": "Privacy",
            "changeLanguage": "Baguhin ang wika",
            "selectLanguage": "Pumili ng wika",
            "aboutText1": "Ang libreng direktoryo na ito ay tumutulong sa mga New Yorker na makahanap ng mga serbisyo sa kalusugang sekswal kabilang ang STI testing, HIV testing, PrEP, contraception, abortion care, at pangangalagang nagpapatibay ng kasarian.",
            "aboutText2": "Binuo ng mga boluntaryo. Hindi kaanib sa anumang klinika o organisasyong pangkalusugan.",
            "aboutDisclaimer": "Ang direktoryo na ito ay para sa layuning pang-impormasyon lamang. Hindi kami tagapagbigay ng pangangalagang pangkalusugan. Palaging i-verify ang impormasyon nang direkta sa mga klinika bago bumisita.",
            "privacyIntro": "Mahalaga ang iyong privacy. Ang site na ito ay idinisenyo upang mangolekta ng kaunting data hangga't maaari.",
            "privacyNoAccounts": "Walang mga account o personal na data na kinokolekta",
            "privacyAnalytics": "Analytics na nakatuon sa privacy (GoatCounter) - walang cookies, walang tracking sa iba't ibang site",
            "privacyLanguage": "Ang kagustuhan sa wika ay nakaimbak lamang nang lokal sa iyong browser",
            "privacyMaps": "Mga mapang ibinigay ng Mapbox (nalalapat ang kanilang patakaran sa privacy sa paggamit ng mapa)",
            "privacyCorrections": "Ang mga pagsusumite ng pagwawasto ay ipinapadala sa pamamagitan ng email sa mga maintainer, pagkatapos ay binubura",
            "privacyNoCookies": "Hindi kami gumagamit ng mga advertising cookie o nagbebenta ng anumang data."
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
        },
        "footer": {
            "about": "O nas",
            "privacy": "Prywatność",
            "changeLanguage": "Zmień język",
            "selectLanguage": "Wybierz język",
            "aboutText1": "Ten bezpłatny katalog pomaga nowojorczykom znaleźć usługi z zakresu zdrowia seksualnego, w tym testy na STI, testy na HIV, PrEP, antykoncepcję, opiekę aborcyjną i opiekę afirmującą płeć.",
            "aboutText2": "Zbudowane przez wolontariuszy. Niezwiązane z żadną kliniką ani organizacją opieki zdrowotnej.",
            "aboutDisclaimer": "Niniejszy katalog służy wyłącznie celom informacyjnym. Nie jesteśmy dostawcą opieki zdrowotnej. Przed wizytą zawsze należy zweryfikować informacje bezpośrednio w klinice.",
            "privacyIntro": "Twoja prywatność jest ważna. Ta strona została zaprojektowana tak, aby gromadzić jak najmniej danych.",
            "privacyNoAccounts": "Nie gromadzimy kont ani danych osobowych",
            "privacyAnalytics": "Analiza skupiona na prywatności (GoatCounter) - brak ciasteczek, brak śledzenia między stronami",
            "privacyLanguage": "Preferencje językowe są przechowywane wyłącznie lokalnie w Twojej przeglądarce",
            "privacyMaps": "Mapy dostarczone przez Mapbox (ich polityka prywatności ma zastosowanie do korzystania z map)",
            "privacyCorrections": "Zgłoszenia poprawek są wysyłane pocztą elektroniczną do administratorów, a następnie usuwane",
            "privacyNoCookies": "Nie używamy ciasteczek reklamowych ani nie sprzedajemy żadnych danych."
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
        },
        "footer": {
            "about": "ہمارے بارے میں",
            "privacy": "رازداری",
            "changeLanguage": "زبان تبدیل کریں",
            "selectLanguage": "زبان منتخب کریں",
            "aboutText1": "یہ مفت ڈائرکٹری نیویارک کے باسیوں کو جنسی صحت کی خدمات بشمول STI ٹیسٹنگ، HIV ٹیسٹنگ، PrEP، مانع حمل، اسقاط حمل کی دیکھ بھال، اور صنفی اثبات کی دیکھ بھال تلاش کرنے میں مدد کرتی ہے۔",
            "aboutText2": "رضاکاروں کے ذریعہ تیار کردہ۔ کسی کلینک یا صحت کی دیکھ بھال کرنے والی تنظیم سے وابستہ نہیں ہے۔",
            "aboutDisclaimer": "یہ ڈائرکٹری صرف معلوماتی مقاصد کے لیے ہے۔ ہم صحت کی دیکھ بھال فراہم کرنے والے نہیں ہیں۔ وزٹ کرنے سے پہلے ہمیشہ کلینک سے براہ راست معلومات کی تصدیق کریں۔",
            "privacyIntro": "آپ کی رازداری اہمیت رکھتی ہے۔ یہ سائٹ کم سے کم ڈیٹا جمع کرنے کے لیے ڈیزائن کی گئی ہے۔",
            "privacyNoAccounts": "کوئی اکاؤنٹ یا ذاتی ڈیٹا جمع نہیں کیا جاتا",
            "privacyAnalytics": "رازداری پر مرکوز اینالیٹکس (GoatCounter) - کوئی کوکیز نہیں، مختلف سائٹس پر کوئی ٹریکنگ نہیں",
            "privacyLanguage": "زبان کی ترجیح صرف آپ کے براؤزر میں مقامی طور پر محفوظ کی جاتی ہے",
            "privacyMaps": "نقشے میپ باکس (Mapbox) کے ذریعہ فراہم کردہ ہیں (نقشے کے استعمال پر ان کی رازداری کی پالیسی لاگو ہوتی ہے)",
            "privacyCorrections": "تصحیح کی درخواستیں منتظمین کو ای میل کی جاتی ہیں، پھر حذف کر دی جاتی ہیں",
            "privacyNoCookies": "ہم اشتہاری کوکیز استعمال نہیں کرتے اور نہ ہی کوئی ڈیٹا فروخت کرتے ہیں۔"
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
        },
        "footer": {
            "about": "Πληροφορίες",
            "privacy": "Απόρρητο",
            "changeLanguage": "Αλλαγή γλώσσας",
            "selectLanguage": "Επιλέξτε γλώσσα",
            "aboutText1": "Αυτός ο δωρεάν κατάλογος βοηθά τους Νεοϋορκέζους να βρουν υπηρεσίες σεξουαλικής υγείας, συμπεριλαμβανομένων εξετάσεων για ΣΜΝ και HIV, PrEP, αντισύλληψης, φροντίδας άμβλωσης και φροντίδας επιβεβαίωσης φύλου.",
            "aboutText2": "Δημιουργήθηκε από εθελοντές. Δεν σχετίζεται με καμία κλινική ή οργανισμό υγείας.",
            "aboutDisclaimer": "Αυτός ο κατάλογος προορίζεται μόνο για ενημερωτικούς σκοπούς. Δεν είμαστε πάροχος υγειονομικής περίθαλψης. Πάντα να επαληθεύετε τις πληροφορίες απευθείας με τις κλινικές πριν από την επίσκεψη.",
            "privacyIntro": "Το απόρρητό σας είναι σημαντικό. Αυτός ο ιστότοπος έχει σχεδιαστεί για να συλλέγει όσο το δυνατόν λιγότερα δεδομένα.",
            "privacyNoAccounts": "Δεν συλλέγονται λογαριασμοί ή προσωπικά δεδομένα",
            "privacyAnalytics": "Αναλυτικά στοιχεία με επίκεντρο το απόρρητο (GoatCounter) - χωρίς cookies, χωρίς παρακολούθηση σε ιστότοπους",
            "privacyLanguage": "Η προτίμηση γλώσσας αποθηκεύεται μόνο τοπικά στο πρόγραμμα περιήγησής σας",
            "privacyMaps": "Οι χάρτες παρέχονται από την Mapbox (η πολιτική απορρήτου τους ισχύει για τη χρήση των χαρτών)",
            "privacyCorrections": "Οι υποβολές διορθώσεων αποστέλλονται μέσω email στους διαχειριστές και στη συνέχεια διαγράφονται",
            "privacyNoCookies": "Δεν χρησιμοποιούμε διαφημιστικά cookies ούτε πουλάμε δεδομένα."
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
        },
        "footer": {
            "about": "אודות",
            "privacy": "פרטיות",
            "changeLanguage": "שינוי שפה",
            "selectLanguage": "בחירת שפה",
            "aboutText1": "מדריך חינמי זה עוזר לתושבי ניו יורק למצוא שירותי בריאות מינית הכוללים בדיקות STI, בדיקות HIV, PrEP, אמצעי מניעה, הפלות וטיפול לאישוש מגדרי.",
            "aboutText2": "נבנה על ידי מתנדבים. לא מזוהה עם אף מרפאה או ארגון בריאות.",
            "aboutDisclaimer": "מדריך זה נועד למטרות מידע בלבד. איננו ספקי שירותי בריאות. תמיד יש לוודא את המידע ישירות מול המרפאות לפני הביקור.",
            "privacyIntro": "הפרטיות שלך חשובה. אתר זה תוכנן לאסוף כמה שפחות נתונים.",
            "privacyNoAccounts": "לא נאספים חשבונות או נתונים אישיים",
            "privacyAnalytics": "אנליטיקה ממוקדת פרטיות (GoatCounter) - ללא עוגיות, ללא מעקב בין אתרים",
            "privacyLanguage": "העדפת השפה נשמרת באופן מקומי בדפדפן שלך בלבד",
            "privacyMaps": "המפות מסופקות על ידי Mapbox (מדיניות הפרטיות שלהם חלה על השימוש במפות)",
            "privacyCorrections": "הצעות לתיקון נשלחות במייל למנהלים ולאחר מכן נמחקו",
            "privacyNoCookies": "איננו משתמשים בעוגיות פרסום ואיננו מוכרים נתונים כלשהם."
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
        },
        "footer": {
            "about": "हमारे बारे में",
            "privacy": "गोपनीयता",
            "changeLanguage": "भाषा बदलें",
            "selectLanguage": "भाषा चुनें",
            "aboutText1": "यह निःशुल्क निर्देशिका न्यूयॉर्क वासियों को यौन स्वास्थ्य सेवाएं खोजने में मदद करती है, जिनमें STI परीक्षण, HIV परीक्षण, PrEP, गर्भनिरोधक, गर्भपात देखभाल और लिंग पुष्टि देखभाल शामिल हैं।",
            "aboutText2": "स्वयंसेवकों द्वारा निर्मित। किसी भी क्लिनिक या स्वास्थ्य सेवा संगठन से संबद्ध नहीं है।",
            "aboutDisclaimer": "यह निर्देशिका केवल सूचनात्मक उद्देश्यों के लिए है। हम स्वास्थ्य सेवा प्रदाता नहीं हैं। जाने से पहले हमेशा सीधे क्लीनिकों से जानकारी सत्यापित करें।",
            "privacyIntro": "आपकी गोपनीयता मायने रखती है। यह साइट यथासंभव कम डेटा एकत्र करने के लिए डिज़ाइन की गई है।",
            "privacyNoAccounts": "कोई खाता या व्यक्तिगत डेटा एकत्र नहीं किया जाता",
            "privacyAnalytics": "गोपनीयता-केंद्रित विश्लेषण (GoatCounter) - कोई कुकीज़ नहीं, साइटों पर कोई ट्रैकिंग नहीं",
            "privacyLanguage": "भाषा प्राथमिकता केवल आपके ब्राउज़र में स्थानीय रूप से संग्रहीत की जाती है",
            "privacyMaps": "Mapbox द्वारा प्रदान किए गए मानचित्र (मानचित्र उपयोग पर उनकी गोपनीयता नीति लागू होती है)",
            "privacyCorrections": "सुधार के सुझावों को ईमेल द्वारा प्रबंधकों को भेजा जाता है, फिर हटा दिया जाता है",
            "privacyNoCookies": "हम विज्ञापन कुकीज़ का उपयोग नहीं करते हैं और न ही कोई डेटा बेचते हैं।"
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
        },
        "footer": {
            "about": "プロジェクトについて",
            "privacy": "プライバシー",
            "changeLanguage": "言語を変更",
            "selectLanguage": "言語を選択",
            "aboutText1": "この無料のディレクトリは、ニューヨーク市民がSTI検査、HIV検査、PrEP、避妊、中絶ケア、ジェンダーアファミングケアなどの性健康サービスを見つけるのに役立ちます。",
            "aboutText2": "ボランティアによって作成されました。特定のクリニックや医療機関とは一切関係ありません。",
            "aboutDisclaimer": "このディレクトリは情報提供のみを目的としています。私たちは医療提供者ではありません。訪問前に必ずクリニックに直接情報を確認してください。",
            "privacyIntro": "あなたのプライバシーは重要です。このサイトは、収集するデータを最小限に抑えるように設計されています。",
            "privacyNoAccounts": "アカウントや個人データの収集はありません",
            "privacyAnalytics": "プライバシー重視の分析 (GoatCounter) — クッキーなし、サイト間追跡なし",
            "privacyLanguage": "言語設定はブラウザにのみローカルに保存されます",
            "privacyMaps": "Mapbox提供の地図（地図の使用にはMapboxのプライバシーポリシーが適用されます）",
            "privacyCorrections": "修正の送信内容は管理者にメールで送られ、その後削除されます",
            "privacyNoCookies": "広告用クッキーの使用やデータの販売は行っておりません。"
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
        },
        "footer": {
            "about": "וועגן אונדז",
            "privacy": "פּריוואַטקייט",
            "changeLanguage": "טוישן שפּראַך",
            "selectLanguage": "קלייַבן שפּראַך",
            "aboutText1": "דער פרייער דירעקטארי העלפט ניו יארקער געפינען סעקסואל געזונט סערוויסעס אריינגערעכנט STI טעסטינג, היוו טעסטינג, PrEP, קאנטראַסעפּשאַן, אַבאָרשאַן זאָרגן, און דזשענדער אַפערמינג קער.",
            "aboutText2": "געבויט דורך וואָלונטירן. נישט פארבונדן מיט קיין קליניק אדער געזונט ארגאניזאציע.",
            "aboutDisclaimer": "דער דירעקטארי איז בלויז פאר אינפארמאציע צוועקן. מיר זענען נישט קיין געזונט פארזארגער. שטענדיק באַשטעטיקן אינפֿאָרמאַציע גלייך מיט קליניקס איידער איר באַזוכן.",
            "privacyIntro": "דיין פּריוואַטקייט איז וויכטיק. דער פּלאַץ איז דיזיינד צו זאַמלען ווי ווייניק דאַטן ווי מעגלעך.",
            "privacyNoAccounts": "קיין אַקאַונץ אָדער פערזענלעכע דאַטן געזאמלט",
            "privacyAnalytics": "פּריוואַטקייט-פאָוקיסט אַנאַליטיקס (GoatCounter) - קיין קוקיז, קיין טראַקינג אַריבער זייטלעך",
            "privacyLanguage": "שפּראַך ייבערהאַנט סטאָרד בלויז לאָקאַל אין דיין בלעטערער",
            "privacyMaps": "מאַפּס צוגעשטעלט דורך Mapbox (זייער פּריוואַטקייט פּאָליטיק אַפּלייז צו מאַפּע באַניץ)",
            "privacyCorrections": "קערעקשאַן סאַבמישאַנז זענען אימעילד צו מיינטיינערז, דעמאָלט אויסגעמעקט",
            "privacyNoCookies": "מיר נוצן נישט גאַנצע קוקיז אָדער פאַרקויפן קיין דאַטן."
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
        },
        "footer": {
            "about": "Sobre",
            "privacy": "Privacidade",
            "changeLanguage": "Alterar idioma",
            "selectLanguage": "Selecionar idioma",
            "aboutText1": "Este diretório gratuito ajuda os nova-iorquinos a encontrar serviços de saúde sexual, incluindo testes de IST, testes de HIV, PrEP, contracepção, cuidados de aborto e cuidados de afirmação de gênero.",
            "aboutText2": "Construído por voluntários. Não afiliado a nenhuma clínica ou organização de saúde.",
            "aboutDisclaimer": "Este diretório é apenas para fins informativos. Não somos um provedor de saúde. Sempre verifique as informações diretamente com as clínicas antes de visitar.",
            "privacyIntro": "Sua privacidade é importante. Este site foi projetado para coletar o mínimo de dados possível.",
            "privacyNoAccounts": "Nenhuma conta ou dado pessoal coletado",
            "privacyAnalytics": "Análise focada na privacidade (GoatCounter): sem cookies, sem rastreamento entre sites",
            "privacyLanguage": "Preferência de idioma armazenada apenas localmente no seu navegador",
            "privacyMaps": "Mapas fornecidos pela Mapbox (a política de privacidade deles se aplica ao uso do mapa)",
            "privacyCorrections": "Os envios de correção são enviados por e-mail aos mantenedores e, em seguida, excluídos",
            "privacyNoCookies": "Não usamos cookies de publicidade nem vendemos quaisquer dados."
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
        },
        "footer": {
            "about": "Giới thiệu",
            "privacy": "Quyền riêng tư",
            "changeLanguage": "Thay đổi ngôn ngữ",
            "selectLanguage": "Chọn ngôn ngữ",
            "aboutText1": "Danh bạ miễn phí này giúp người dân New York tìm thấy các dịch vụ sức khỏe tình dục bao gồm xét nghiệm STI, xét nghiệm HIV, PrEP, tránh thai, chăm sóc phá thai và chăm sóc khẳng định giới tính.",
            "aboutText2": "Được xây dựng bởi các tình nguyện viên. Không liên kết với bất kỳ phòng khám hoặc tổ chức y tế nào.",
            "aboutDisclaimer": "Danh bạ này chỉ dành cho mục đích thông tin. Chúng tôi không phải là nhà cung cấp dịch vụ y tế. Luôn xác minh thông tin trực tiếp với các phòng khám trước khi đến.",
            "privacyIntro": "Quyền riêng tư của bạn rất quan trọng. Trang web này được thiết kế để thu thập ít dữ liệu nhất có thể.",
            "privacyNoAccounts": "Không thu thập tài khoản hoặc dữ liệu cá nhân",
            "privacyAnalytics": "Phân tích tập trung vào quyền riêng tư (GoatCounter) - không có cookie, không theo dõi trên các trang web",
            "privacyLanguage": "Sở thích ngôn ngữ chỉ được lưu trữ cục bộ trong trình duyệt của bạn",
            "privacyMaps": "Bản đồ do Mapbox cung cấp (chính sách quyền riêng tư của họ áp dụng cho việc sử dụng bản đồ)",
            "privacyCorrections": "Các bản sửa lỗi được gửi qua email cho người quản trị, sau đó sẽ bị xóa",
            "privacyNoCookies": "Chúng tôi không sử dụng cookie quảng cáo hoặc bán bất kỳ dữ liệu nào."
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
