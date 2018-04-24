// @flow
const translations = require('./../../assets/i18n/de.json');

export default function translate(key: string): string {
  return translations[key] || 't.b.t';
}
