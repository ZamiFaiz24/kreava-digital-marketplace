import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enAuth from './en/auth.json';
import enCommon from './en/common.json';
import enDashboard from './en/dashboard.json';
import enLanding from './en/landing.json';
import enMarketplace from './en/marketplace.json';
import idAuth from './id/auth.json';
import idCommon from './id/common.json';
import idDashboard from './id/dashboard.json';
import idLanding from './id/landing.json';
import idMarketplace from './id/marketplace.json';

export const supportedLanguages = ['en', 'id'] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];

const DEFAULT_LANGUAGE: SupportedLanguage = 'en';
const LANGUAGE_STORAGE_KEY = 'kreava.language';

export const resources = {
    en: {
        translation: {
            ...enCommon,
            ...enLanding,
            ...enMarketplace,
            ...enAuth,
            ...enDashboard,
        },
    },
    id: {
        translation: {
            ...idCommon,
            ...idLanding,
            ...idMarketplace,
            ...idAuth,
            ...idDashboard,
        },
    },
};

function isSupportedLanguage(language: string | null | undefined): language is SupportedLanguage {
    return supportedLanguages.some((supported) => supported === language);
}

export function getInitialLanguage(): SupportedLanguage {
    if (typeof window === 'undefined') {
        return DEFAULT_LANGUAGE;
    }

    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

    return isSupportedLanguage(storedLanguage) ? storedLanguage : DEFAULT_LANGUAGE;
}

const initialLanguage = getInitialLanguage();

void i18n.use(initReactI18next).init({
    resources,
    lng: initialLanguage,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: [...supportedLanguages],
    defaultNS: 'translation',
    ns: ['translation'],
    interpolation: {
        escapeValue: false,
    },
    returnNull: false,
});

if (typeof document !== 'undefined') {
    document.documentElement.lang = initialLanguage;
}

i18n.on('languageChanged', (language) => {
    const resolvedLanguage = isSupportedLanguage(language) ? language : DEFAULT_LANGUAGE;

    if (typeof window !== 'undefined') {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, resolvedLanguage);
    }

    if (typeof document !== 'undefined') {
        document.documentElement.lang = resolvedLanguage;
    }
});

export function changeLanguage(language: SupportedLanguage) {
    return i18n.changeLanguage(language);
}

export default i18n;
