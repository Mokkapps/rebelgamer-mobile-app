import DeviceDetector from './utils/DeviceDetector';
import { HEADLINE_IMAGE_HEIGHT } from './constants';

const fontSizeParagraph = DeviceDetector.isTablet() ? 22 : 17;

const css = `
<style>
    body {
        background-color: transparent;
    }

    h1 {
        color: #000000;
        font-family: "Times New Roman", serif;
        font-variant: normal;
        font-weight: bold;
        font-size: 22px;
        text-align: center;
    }

    h2 {
        color: #000000;
        font-family: "Times New Roman", serif;
        font-size: 17px;
        font-style: italic;
        font-weight: normal;
        text-align: center;
    }

    p {
        color: #000000;
        font-family: "Times New Roman", serif;
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
</style>
`;
export default css;
