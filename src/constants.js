import isTablet from './utils/device-detector';

export const WP_BASE_URL = 'https://www.rebelgamer.de/wp-json/wp/v2/';
export const POSTS_PER_PAGE = 5;
export const REBELGAMER_RED = '#F44336';
export const STORAGE_KEY = '@RebelGamerStore:key';
export const MOKKAPPS_MAIL = 'mail@mokkapps.de';
export const REBELGAMER_MAIL = 'Flo@rebelgamer.de';
export const APP_STORE_URL = 'itms-apps://itunes.apple.com/app/id1187403828';
export const GOOGLE_PLAY_URL =
  'http://play.google.com/store/apps/details?id=de.rebelgamer.RebelGamerRSS';

export const FONT_SIZE_HEADLINE = isTablet() ? 30 : 25;
export const FONT_SIZE_LIST_DATE = isTablet() ? 15 : 13;
export const FONT_SIZE_DETAILS_DATE = isTablet() ? 20 : 15;
export const HEADLINE_IMAGE_HEIGHT = isTablet() ? 400 : 200;
