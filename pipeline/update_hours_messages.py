import json
import os

updates = {
    'zh': {
        "openClosesAt": "营业中 · {{time}} 关闭",
        "opensToday": "今天 {{time}} 开门",
        "closedOpensDay": "已关闭 · {{day}} {{time}} 开门",
        "closedOpens": "已关闭 · {{day}} 开门",
        "holidayHoursWarning": "{{holiday}} - 营业时间可能有所不同",
        "allDay": "全天"
    },
    'ru': {
        "openClosesAt": "Открыто · Закроется в {{time}}",
        "opensToday": "Откроется сегодня в {{time}}",
        "closedOpensDay": "Закрыто · Откроется {{day}} в {{time}}",
        "closedOpens": "Закрыто · Откроется {{day}}",
        "holidayHoursWarning": "{{holiday}} - часы работы могут меняться",
        "allDay": "Весь день"
    },
    'bn': {
        "openClosesAt": "খোলা · {{time}}-এ বন্ধ হবে",
        "opensToday": "আজ {{time}}-এ খুলবে",
        "closedOpensDay": "বন্ধ · {{day}} {{time}}-এ খুলবে",
        "closedOpens": "বন্ধ · {{day}} খুলবে",
        "holidayHoursWarning": "{{holiday}} - সময়সূচী পরিবর্তিত হতে পারে",
        "allDay": "সারাদিন"
    },
    'ht': {
        "openClosesAt": "Louvri · Fèmen a {{time}}",
        "opensToday": "Louvri jodi a a {{time}}",
        "closedOpensDay": "Fèmen · Louvri {{day}} a {{time}}",
        "closedOpens": "Fèmen · Louvri {{day}}",
        "holidayHoursWarning": "{{holiday}} - lè yo ka varye",
        "allDay": "Tout jounen"
    },
    'fr': {
        "openClosesAt": "Ouvert · Ferme à {{time}}",
        "opensToday": "Ouvre aujourd'hui à {{time}}",
        "closedOpensDay": "Fermé · Ouvre {{day}} à {{time}}",
        "closedOpens": "Fermé · Ouvre {{day}}",
        "holidayHoursWarning": "{{holiday}} - les horaires peuvent varier",
        "allDay": "Toute la journée"
    },
    'ar': {
        "openClosesAt": "مفتوح · يغلق في {{time}}",
        "opensToday": "يفتح اليوم في {{time}}",
        "closedOpensDay": "مغلق · يفتح {{day}} في {{time}}",
        "closedOpens": "مغلق · يفتح {{day}}",
        "holidayHoursWarning": "{{holiday}} - قد تختلف الساعات",
        "allDay": "طوال اليوم"
    },
    'ko': {
        "openClosesAt": "영업 중 · {{time}}에 종료",
        "opensToday": "오늘 {{time}}에 개점",
        "closedOpensDay": "영업 종료 · {{day}} {{time}}에 개점",
        "closedOpens": "영업 종료 · {{day}}에 개점",
        "holidayHoursWarning": "{{holiday}} - 운영 시간이 다를 수 있음",
        "allDay": "하루 종일"
    },
    'it': {
        "openClosesAt": "Aperto · Chiude alle {{time}}",
        "opensToday": "Apre oggi alle {{time}}",
        "closedOpensDay": "Chiuso · Apre {{day}} alle {{time}}",
        "closedOpens": "Chiuso · Apre {{day}}",
        "holidayHoursWarning": "{{holiday}} - gli orari possono variare",
        "allDay": "Tutto il giorno"
    },
    'tl': {
        "openClosesAt": "Bukas · Magsasara sa {{time}}",
        "opensToday": "Magbubukas ngayong {{time}}",
        "closedOpensDay": "Sarado · Magbubukas sa {{day}} nang {{time}}",
        "closedOpens": "Sarado · Magbubukas sa {{day}}",
        "holidayHoursWarning": "{{holiday}} - maaaring mag-iba ang oras",
        "allDay": "Buong araw"
    },
    'pl': {
        "openClosesAt": "Otwarte · Zamyka się o {{time}}",
        "opensToday": "Otwiera się dzisiaj o {{time}}",
        "closedOpensDay": "Zamknięte · Otwiera się {{day}} o {{time}}",
        "closedOpens": "Zamknięte · Otwiera się {{day}}",
        "holidayHoursWarning": "{{holiday}} - godziny mogą się różnić",
        "allDay": "Cały dzień"
    },
    'ur': {
        "openClosesAt": "کھلا ہے · {{time}} پر بند ہوگا",
        "opensToday": "آج {{time}} پر کھلے گا",
        "closedOpensDay": "بند ہے · {{day}} کو {{time}} پر کھلے گا",
        "closedOpens": "بند ہے · {{day}} کو کھلے گا",
        "holidayHoursWarning": "{{holiday}} - اوقات مختلف ہو سکتے ہیں",
        "allDay": "پورا دن"
    },
    'el': {
        "openClosesAt": "Ανοιχτό · Κλείνει στις {{time}}",
        "opensToday": "Ανοίγει σήμερα στις {{time}}",
        "closedOpensDay": "Κλειστό · Ανοίγει {{day}} στις {{time}}",
        "closedOpens": "Κλειστό · Ανοίγει {{day}}",
        "holidayHoursWarning": "{{holiday}} - οι ώρες μπορεί να διαφέρουν",
        "allDay": "Όλη μέρα"
    },
    'he': {
        "openClosesAt": "פתוח · נסגר ב-{{time}}",
        "opensToday": "נפתח היום ב-{{time}}",
        "closedOpensDay": "סגור · נפתח ב-{{day}} ב-{{time}}",
        "closedOpens": "סגור · נפתח ב-{{day}}",
        "holidayHoursWarning": "{{holiday}} - השעות עשויות להשתנות",
        "allDay": "כל היום"
    },
    'hi': {
        "openClosesAt": "खुला है · {{time}} पर बंद होगा",
        "opensToday": "आज {{time}} पर खुलेगा",
        "closedOpensDay": "बंद है · {{day}} को {{time}} पर खुलेगा",
        "closedOpens": "बंद है · {{day}} को खुलेगा",
        "holidayHoursWarning": "{{holiday}} - समय अलग हो सकता है",
        "allDay": "पूरे दिन"
    },
    'ja': {
        "openClosesAt": "営業中 · {{time}} 閉店",
        "opensToday": "本日 {{time}} 開店",
        "closedOpensDay": "閉店 · {{day}} {{time}} 開店",
        "closedOpens": "閉店 · {{day}} 開店",
        "holidayHoursWarning": "{{holiday}} - 時間が変更される可能性があります",
        "allDay": "終日"
    },
    'yi': {
        "openClosesAt": "אפן · שליסט ביי {{time}}",
        "opensToday": "עפנט היינט ביי {{time}}",
        "closedOpensDay": "פארמאכט · עפנט {{day}} ביי {{time}}",
        "closedOpens": "פארמאכט · עפנט {{day}}",
        "holidayHoursWarning": "{{holiday}} - שעה קענען בייטן",
        "allDay": "גאנצן טאג"
    },
    'pt': {
        "openClosesAt": "Aberto · Fecha às {{time}}",
        "opensToday": "Abre hoje às {{time}}",
        "closedOpensDay": "Fechado · Abre {{day}} às {{time}}",
        "closedOpens": "Fechado · Abre {{day}}",
        "holidayHoursWarning": "{{holiday}} - horário pode variar",
        "allDay": "Todo o dia"
    },
    'vi': {
        "openClosesAt": "Mở cửa · Đóng lúc {{time}}",
        "opensToday": "Mở cửa hôm nay lúc {{time}}",
        "closedOpensDay": "Đóng cửa · Mở {{day}} lúc {{time}}",
        "closedOpens": "Đóng cửa · Mở {{day}}",
        "holidayHoursWarning": "{{holiday}} - giờ có thể thay đổi",
        "allDay": "Cả ngày"
    }
}

for lang, messages in updates.items():
    path = f'public/locales/{lang}/messages.json'
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        data.update(messages)
        
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Updated {lang}")
    else:
        print(f"Skipped {lang} - file not found")
