import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    ns: [
      "actions",
      "dynamic",
      "filters",
      "footer",
      "forms",
      "gestational",
      "insurance",
      "locations",
      "messages",
      "sections",
      "services",
    ],
    defaultNS: "messages",
    supportedLngs: [
      "en",
      "es",
      "zh",
      "ru",
      "bn",
      "ht",
      "fr",
      "ar",
      "ko",
      "it",
      "tl",
      "pl",
      "ur",
      "el",
      "he",
      "hi",
      "ja",
      "yi",
      "pt",
      "vi",
    ],
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false, // React already escapes
    },
    react: {
      useSuspense: true,
    },
  });

export default i18n;
