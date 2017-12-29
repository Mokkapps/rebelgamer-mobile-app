import DeviceDetector from './utils/DeviceDetector';

const REBELGAMER_RED = '#F44336';
const STORAGE_KEY = '@RebelGamerStore:key';
const APPLE_APP_ID = '1187403828';
const GOOGLE_PACKAGE_NAME = 'de.rebelgamer.RebelGamerRSS';
const MOKKAPPS_MAIL = 'kontakt@mokkapps.de';
const REBELGAMER_MAIL = 'Mike@rebelgamer.de';

const FONT_SIZE_HEADLINE = DeviceDetector.isTablet() ? 30 : 25;
const FONT_SIZE_LIST_DATE = DeviceDetector.isTablet() ? 15 : 13;
const FONT_SIZE_DETAILS_DATE = DeviceDetector.isTablet() ? 20 : 15;
const HEADLINE_IMAGE_HEIGHT = DeviceDetector.isTablet() ? 400 : 200;

class Constants {
  static get RebelGamerRed() {
    return REBELGAMER_RED;
  }
  static get StorageKey() {
    return STORAGE_KEY;
  }
  static get AppleAppID() {
    return APPLE_APP_ID;
  }
  static get GooglePackageName() {
    return GOOGLE_PACKAGE_NAME;
  }
  static get MokkappsMail() {
    return MOKKAPPS_MAIL;
  }
  static get RebelGamerMail() {
    return REBELGAMER_MAIL;
  }
  static get FontSizeHeadline() {
    return FONT_SIZE_HEADLINE;
  }
  static get FontSizeListDate() {
    return FONT_SIZE_LIST_DATE;
  }
  static get FontSizeDetailsDate() {
    return FONT_SIZE_DETAILS_DATE;
  }
  static get HeadlineImageHeigth() {
    return HEADLINE_IMAGE_HEIGHT;
  }
}

export default Constants;
