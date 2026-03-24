import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import zh from "@locales/zh.json";
import en from "@locales/en.json";
import { CONFIG_KEYS } from "@common/constants";
import { IConfig } from "@common/types";

const resources = {
  zh: {
    translation: zh,
  },
  en: {
    translation: en,
  },
};
export type LanguageType = keyof typeof resources;

i18n.use(initReactI18next).init({
  resources,
  lng: "zh",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export const setLanguage = (lang: LanguageType) => {
  i18n.changeLanguage(lang);
};

export const getLanguage = () => i18n.language as LanguageType;

export function updateLanguage(key: keyof IConfig, val: LanguageType) {
  if (key === CONFIG_KEYS.LANGUAGE) {
    const lang = getLanguage();
    if (lang !== val) {
      setLanguage(val);
    }
  }
}
