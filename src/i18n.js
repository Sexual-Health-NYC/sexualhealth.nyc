import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import English translations
import enServices from "./locales/en/services.json";
import enInsurance from "./locales/en/insurance.json";
import enSections from "./locales/en/sections.json";
import enActions from "./locales/en/actions.json";
import enMessages from "./locales/en/messages.json";
import enLocations from "./locales/en/locations.json";
import enGestational from "./locales/en/gestational.json";
import enForms from "./locales/en/forms.json";

// Import Spanish translations
import esServices from "./locales/es/services.json";
import esInsurance from "./locales/es/insurance.json";
import esSections from "./locales/es/sections.json";
import esActions from "./locales/es/actions.json";
import esMessages from "./locales/es/messages.json";
import esLocations from "./locales/es/locations.json";
import esGestational from "./locales/es/gestational.json";
import esForms from "./locales/es/forms.json";

const resources = {
  en: {
    services: enServices,
    insurance: enInsurance,
    sections: enSections,
    actions: enActions,
    messages: enMessages,
    locations: enLocations,
    gestational: enGestational,
    forms: enForms,
  },
  es: {
    services: esServices,
    insurance: esInsurance,
    sections: esSections,
    actions: esActions,
    messages: esMessages,
    locations: esLocations,
    gestational: esGestational,
    forms: esForms,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "es"],
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
