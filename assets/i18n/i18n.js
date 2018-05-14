import i18next from 'i18next';
import resources from './translations';

i18next.init({
  lng: 'nl',
  fallbackLng: 'nl',
  resources,
  ns: ['common'],
  defaultNS: 'common',
  debug: true,
  interpolation: {
    escapeValue: false, // not needed for react as it does escape per default to prevent xss!
  },
});

export default i18next;
export const t = i18next.t.bind(i18next);
