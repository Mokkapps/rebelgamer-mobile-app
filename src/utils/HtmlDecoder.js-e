// @flow

const Entities = require('html-entities').AllHtmlEntities;

const entities = new Entities();

class HtmlDecoder {
  static decodeHtml(htmlString: string): string {
    return entities.decode(htmlString);
  }
}

export default HtmlDecoder;
