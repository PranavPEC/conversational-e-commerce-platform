import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar'],
    ns: ['common', 'auth', 'home', 'profile', 'orders', 'seller', 'admin', 'legal', 'checkout', 'settings', 'cart', 'errors','product','wishlist'],
    defaultNS: 'common',
    backend: { loadPath: '/locales/{{lng}}/{{ns}}.json' },
    detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'] },
    interpolation: { escapeValue: false },
  });

// ── Apply text direction to <html> ──
// Runs once on initial load, and again every time the language changes.
const applyDirection = (lng) => {
  document.documentElement.dir = i18n.dir(lng);
  document.documentElement.setAttribute('lang', lng);
};

i18n.on('languageChanged', applyDirection);
i18n.on('initialized', () => applyDirection(i18n.language));

export default i18n;