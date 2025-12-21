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

// Import Italian translations
import itServices from "./locales/it/services.json";
import itInsurance from "./locales/it/insurance.json";
import itSections from "./locales/it/sections.json";
import itActions from "./locales/it/actions.json";
import itMessages from "./locales/it/messages.json";
import itLocations from "./locales/it/locations.json";
import itGestational from "./locales/it/gestational.json";
import itForms from "./locales/it/forms.json";

// Import Tagalog translations
import tlServices from "./locales/tl/services.json";
import tlInsurance from "./locales/tl/insurance.json";
import tlSections from "./locales/tl/sections.json";
import tlActions from "./locales/tl/actions.json";
import tlMessages from "./locales/tl/messages.json";
import tlLocations from "./locales/tl/locations.json";
import tlGestational from "./locales/tl/gestational.json";
import tlForms from "./locales/tl/forms.json";

// Import Polish translations
import plServices from "./locales/pl/services.json";
import plInsurance from "./locales/pl/insurance.json";
import plSections from "./locales/pl/sections.json";
import plActions from "./locales/pl/actions.json";
import plMessages from "./locales/pl/messages.json";
import plLocations from "./locales/pl/locations.json";
import plGestational from "./locales/pl/gestational.json";
import plForms from "./locales/pl/forms.json";

// Import Urdu translations
import urServices from "./locales/ur/services.json";
import urInsurance from "./locales/ur/insurance.json";
import urSections from "./locales/ur/sections.json";
import urActions from "./locales/ur/actions.json";
import urMessages from "./locales/ur/messages.json";
import urLocations from "./locales/ur/locations.json";
import urGestational from "./locales/ur/gestational.json";
import urForms from "./locales/ur/forms.json";

// Import Greek translations
import elServices from "./locales/el/services.json";
import elInsurance from "./locales/el/insurance.json";
import elSections from "./locales/el/sections.json";
import elActions from "./locales/el/actions.json";
import elMessages from "./locales/el/messages.json";
import elLocations from "./locales/el/locations.json";
import elGestational from "./locales/el/gestational.json";
import elForms from "./locales/el/forms.json";

// Import Hebrew translations
import heServices from "./locales/he/services.json";
import heInsurance from "./locales/he/insurance.json";
import heSections from "./locales/he/sections.json";
import heActions from "./locales/he/actions.json";
import heMessages from "./locales/he/messages.json";
import heLocations from "./locales/he/locations.json";
import heGestational from "./locales/he/gestational.json";
import heForms from "./locales/he/forms.json";

// Import Hindi translations
import hiServices from "./locales/hi/services.json";
import hiInsurance from "./locales/hi/insurance.json";
import hiSections from "./locales/hi/sections.json";
import hiActions from "./locales/hi/actions.json";
import hiMessages from "./locales/hi/messages.json";
import hiLocations from "./locales/hi/locations.json";
import hiGestational from "./locales/hi/gestational.json";
import hiForms from "./locales/hi/forms.json";

// Import Japanese translations
import jaServices from "./locales/ja/services.json";
import jaInsurance from "./locales/ja/insurance.json";
import jaSections from "./locales/ja/sections.json";
import jaActions from "./locales/ja/actions.json";
import jaMessages from "./locales/ja/messages.json";
import jaLocations from "./locales/ja/locations.json";
import jaGestational from "./locales/ja/gestational.json";
import jaForms from "./locales/ja/forms.json";

// Import Yiddish translations
import yiServices from "./locales/yi/services.json";
import yiInsurance from "./locales/yi/insurance.json";
import yiSections from "./locales/yi/sections.json";
import yiActions from "./locales/yi/actions.json";
import yiMessages from "./locales/yi/messages.json";
import yiLocations from "./locales/yi/locations.json";
import yiGestational from "./locales/yi/gestational.json";
import yiForms from "./locales/yi/forms.json";

// Import Portuguese translations
import ptServices from "./locales/pt/services.json";
import ptInsurance from "./locales/pt/insurance.json";
import ptSections from "./locales/pt/sections.json";
import ptActions from "./locales/pt/actions.json";
import ptMessages from "./locales/pt/messages.json";
import ptLocations from "./locales/pt/locations.json";
import ptGestational from "./locales/pt/gestational.json";
import ptForms from "./locales/pt/forms.json";

// Import Vietnamese translations
import viServices from "./locales/vi/services.json";
import viInsurance from "./locales/vi/insurance.json";
import viSections from "./locales/vi/sections.json";
import viActions from "./locales/vi/actions.json";
import viMessages from "./locales/vi/messages.json";
import viLocations from "./locales/vi/locations.json";
import viGestational from "./locales/vi/gestational.json";
import viForms from "./locales/vi/forms.json";

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
  it: {
    services: itServices,
    insurance: itInsurance,
    sections: itSections,
    actions: itActions,
    messages: itMessages,
    locations: itLocations,
    gestational: itGestational,
    forms: itForms,
  },
  tl: {
    services: tlServices,
    insurance: tlInsurance,
    sections: tlSections,
    actions: tlActions,
    messages: tlMessages,
    locations: tlLocations,
    gestational: tlGestational,
    forms: tlForms,
  },
  pl: {
    services: plServices,
    insurance: plInsurance,
    sections: plSections,
    actions: plActions,
    messages: plMessages,
    locations: plLocations,
    gestational: plGestational,
    forms: plForms,
  },
  ur: {
    services: urServices,
    insurance: urInsurance,
    sections: urSections,
    actions: urActions,
    messages: urMessages,
    locations: urLocations,
    gestational: urGestational,
    forms: urForms,
  },
  el: {
    services: elServices,
    insurance: elInsurance,
    sections: elSections,
    actions: elActions,
    messages: elMessages,
    locations: elLocations,
    gestational: elGestational,
    forms: elForms,
  },
  he: {
    services: heServices,
    insurance: heInsurance,
    sections: heSections,
    actions: heActions,
    messages: heMessages,
    locations: heLocations,
    gestational: heGestational,
    forms: heForms,
  },
  hi: {
    services: hiServices,
    insurance: hiInsurance,
    sections: hiSections,
    actions: hiActions,
    messages: hiMessages,
    locations: hiLocations,
    gestational: hiGestational,
    forms: hiForms,
  },
  ja: {
    services: jaServices,
    insurance: jaInsurance,
    sections: jaSections,
    actions: jaActions,
    messages: jaMessages,
    locations: jaLocations,
    gestational: jaGestational,
    forms: jaForms,
  },
  yi: {
    services: yiServices,
    insurance: yiInsurance,
    sections: yiSections,
    actions: yiActions,
    messages: yiMessages,
    locations: yiLocations,
    gestational: yiGestational,
    forms: yiForms,
  },
  pt: {
    services: ptServices,
    insurance: ptInsurance,
    sections: ptSections,
    actions: ptActions,
    messages: ptMessages,
    locations: ptLocations,
    gestational: ptGestational,
    forms: ptForms,
  },
  vi: {
    services: viServices,
    insurance: viInsurance,
    sections: viSections,
    actions: viActions,
    messages: viMessages,
    locations: viLocations,
    gestational: viGestational,
    forms: viForms,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "es", "zh", "ru", "bn", "ht", "fr", "ar", "ko", "it", "tl", "pl", "ur", "el", "he", "hi", "ja", "yi", "pt", "vi"],
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
