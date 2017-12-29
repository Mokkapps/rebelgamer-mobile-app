// @flow
const translations = require('./../../assets/i18n/de.json');

class Translate {
  translate(key: string): string {
    return translations[key] || 't.b.t';
  }
}

export default new Translate();
