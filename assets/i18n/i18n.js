import i18next from 'i18next';
import resources from './translations';

i18next.init({
  lng: 'de',
  fallbackLng: 'de',
  resources,
  debug: true,
  interpolation: {
    escapeValue: false, // not needed for react as it does escape per default to prevent xss!
  },
});

export default i18next;
export const t = i18next.t.bind(i18next);
