// @flow

const Entities = require('html-entities').AllHtmlEntities;

const entities = new Entities();

export default function decodeHtml(htmlString: string): string {
  return entities.decode(htmlString);
}
