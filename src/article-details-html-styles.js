import isTablet from './device-detector';
import { HEADLINE_IMAGE_HEIGHT } from './constants';

const fontSizeParagraph = isTablet() ? 22 : 17;

const ArticleDetailsHtmlStyle = `
    h1 {
        display: inline-block
        color: #000000;
        font-variant: normal;
        font-weight: bold;
        font-size: 22px;
        text-align: center;
    }

    h2 {
        display: inline-block
        color: #000000;
        font-size: 17px;
        font-style: italic;
        font-weight: normal;
        text-align: center;
    }

    p {
        display: inline-block
        color: #000000;
        font-size: ${fontSizeParagraph}px;
    }

    a {
        color: #F44336;
    }

    img {
      width: 100%;
      height: ${HEADLINE_IMAGE_HEIGHT};
    }

    iframe {
        display: block;
        max-width: 100%;
        margin-top: 10px;
        margin-bottom: 10px;
    }
`;
export default ArticleDetailsHtmlStyle;
