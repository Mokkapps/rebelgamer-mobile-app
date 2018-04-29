// Based on https://github.com/m0ngr31/react-native-device-detection

import { Dimensions, PixelRatio } from 'react-native';

const windowSize = Dimensions.get('window');

class DeviceDetector {
  constructor() {
    this.pixelDensity = PixelRatio.get();
    this.width = windowSize.width;
    this.height = windowSize.height;
    this.adjustedWidth = this.width * this.pixelDensity;
    this.adjustedHeight = this.height * this.pixelDensity;

    this.isTablet();
  }

  getWidth() {
    return this.width;
  }

  isTablet() {
    if (this.pixelDensity < 2 && (this.adjustedWidth >= 1000 || this.adjustedHeight >= 1000)) {
      return true;
    } else if (this.pixelDensity === 2 && (this.adjustedWidth >= 1920 || this.adjustedHeight >= 1920)) {
      return true;
    }

    return false;
  }
}

export default new DeviceDetector();
