import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

import enTranslation from "../locales/en/translation.json";
import esTranslation from "../locales/es/translation.json";
import frTranslation from "../locales/fr/translation.json";
import deTranslation from "../locales/de/translation.json";
import jaTranslation from "../locales/ja/translation.json";
import zhTranslation from "../locales/zh/translation.json";

export const supportedLngs: { [key: string]: { name: string; locale: string } } = {
    en: {
        name: "English",
        locale: "en-US"
    },
    es: {
        name: "Español",
        locale: "es-ES"
    },
    fr: {
        name: "Français",
        locale: "fr-FR"
    },
    de: {
        name: "Deutsch",
        locale: "de-DE"
    },
    ja: {
        name: "日本語",
        locale: "ja-JP"
    },
    zh: {
        name: "中文",
        locale: "zh-CN"
    }
};

i18next
    .use(HttpApi)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: enTranslation },
            es: { translation: esTranslation },
            fr: { translation: frTranslation },
            de: { translation: deTranslation },
            ja: { translation: jaTranslation },
            zh: { translation: zhTranslation }
        },
        fallbackLng: "en",
        supportedLngs: Object.keys(supportedLngs),
        debug: import.meta.env.DEV,
        interpolation: {
            escapeValue: false
        }
    });

export default i18next;
