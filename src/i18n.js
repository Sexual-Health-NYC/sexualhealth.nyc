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

// Import Chinese translations
import zhServices from "./locales/zh/services.json";
import zhInsurance from "./locales/zh/insurance.json";
import zhSections from "./locales/zh/sections.json";
import zhActions from "./locales/zh/actions.json";
import zhMessages from "./locales/zh/messages.json";
import zhLocations from "./locales/zh/locations.json";
import zhGestational from "./locales/zh/gestational.json";
import zhForms from "./locales/zh/forms.json";

// Import Russian translations
import ruServices from "./locales/ru/services.json";
import ruInsurance from "./locales/ru/insurance.json";
import ruSections from "./locales/ru/sections.json";
import ruActions from "./locales/ru/actions.json";
import ruMessages from "./locales/ru/messages.json";
import ruLocations from "./locales/ru/locations.json";
import ruGestational from "./locales/ru/gestational.json";
import ruForms from "./locales/ru/forms.json";

// Import Bengali translations
import bnServices from "./locales/bn/services.json";
import bnInsurance from "./locales/bn/insurance.json";
import bnSections from "./locales/bn/sections.json";
import bnActions from "./locales/bn/actions.json";
import bnMessages from "./locales/bn/messages.json";
import bnLocations from "./locales/bn/locations.json";
import bnGestational from "./locales/bn/gestational.json";
import bnForms from "./locales/bn/forms.json";

// Import Haitian Creole translations
import htServices from "./locales/ht/services.json";
import htInsurance from "./locales/ht/insurance.json";
import htSections from "./locales/ht/sections.json";
import htActions from "./locales/ht/actions.json";
import htMessages from "./locales/ht/messages.json";
import htLocations from "./locales/ht/locations.json";
import htGestational from "./locales/ht/gestational.json";
import htForms from "./locales/ht/forms.json";

// Import French translations
import frServices from "./locales/fr/services.json";
import frInsurance from "./locales/fr/insurance.json";
import frSections from "./locales/fr/sections.json";
import frActions from "./locales/fr/actions.json";
import frMessages from "./locales/fr/messages.json";
import frLocations from "./locales/fr/locations.json";
import frGestational from "./locales/fr/gestational.json";
import frForms from "./locales/fr/forms.json";

// Import Arabic translations
import arServices from "./locales/ar/services.json";
import arInsurance from "./locales/ar/insurance.json";
import arSections from "./locales/ar/sections.json";
import arActions from "./locales/ar/actions.json";
import arMessages from "./locales/ar/messages.json";
import arLocations from "./locales/ar/locations.json";
import arGestational from "./locales/ar/gestational.json";
import arForms from "./locales/ar/forms.json";

// Import Korean translations
import koServices from "./locales/ko/services.json";
import koInsurance from "./locales/ko/insurance.json";
import koSections from "./locales/ko/sections.json";
import koActions from "./locales/ko/actions.json";
import koMessages from "./locales/ko/messages.json";
import koLocations from "./locales/ko/locations.json";
import koGestational from "./locales/ko/gestational.json";
import koForms from "./locales/ko/forms.json";

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
  zh: {
    services: zhServices,
    insurance: zhInsurance,
    sections: zhSections,
    actions: zhActions,
    messages: zhMessages,
    locations: zhLocations,
    gestational: zhGestational,
    forms: zhForms,
  },
  ru: {
    services: ruServices,
    insurance: ruInsurance,
    sections: ruSections,
    actions: ruActions,
    messages: ruMessages,
    locations: ruLocations,
    gestational: ruGestational,
    forms: ruForms,
  },
  bn: {
    services: bnServices,
    insurance: bnInsurance,
    sections: bnSections,
    actions: bnActions,
    messages: bnMessages,
    locations: bnLocations,
    gestational: bnGestational,
    forms: bnForms,
  },
  ht: {
    services: htServices,
    insurance: htInsurance,
    sections: htSections,
    actions: htActions,
    messages: htMessages,
    locations: htLocations,
    gestational: htGestational,
    forms: htForms,
  },
  fr: {
    services: frServices,
    insurance: frInsurance,
    sections: frSections,
    actions: frActions,
    messages: frMessages,
    locations: frLocations,
    gestational: frGestational,
    forms: frForms,
  },
  ar: {
    services: arServices,
    insurance: arInsurance,
    sections: arSections,
    actions: arActions,
    messages: arMessages,
    locations: arLocations,
    gestational: arGestational,
    forms: arForms,
  },
  ko: {
    services: koServices,
    insurance: koInsurance,
    sections: koSections,
    actions: koActions,
    messages: koMessages,
    locations: koLocations,
    gestational: koGestational,
    forms: koForms,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "es", "zh", "ru", "bn", "ht", "fr", "ar", "ko"],
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
