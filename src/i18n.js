import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Dynamically load all locale files
const modules = import.meta.glob('./locales/*/*.json', { eager: true });

const resources = {};

for (const path in modules) {
  // path is like "./locales/en/services.json"
  const parts = path.split('/');
  const lang = parts[2]; // "en"
  const filename = parts[3]; // "services.json"
  const namespace = filename.replace('.json', ''); // "services"

  if (!resources[lang]) {
    resources[lang] = {};
  }

  // Vite JSON imports are the default export
  resources[lang][namespace] = modules[path].default || modules[path];
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: Object.keys(resources),
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false, // React already escapes
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;