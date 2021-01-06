import i18n from 'i18next';
import HttpApi from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

// TODO: make sure multilingual still works

i18n
  .use(HttpApi)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    lng: 'en',
    supportedLngs: ['en', 'fr'],

    debug: process.env.NODE_ENV !== 'production',

    interpolation: {
        escapeValue: false, // not needed for react!!
    },

    react: {
        transEmptyNodeValue: '',
        wait: true,
    },
  });

export default i18n;
