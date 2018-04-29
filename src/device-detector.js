// Based on https://github.com/m0ngr31/react-native-device-detection

import { Dimensions, PixelRatio } from 'react-native';

export default function isTablet() {
  const windowSize = Dimensions.get('window');
  const pixelDensity = PixelRatio.get();
  const { width, height } = windowSize;
  const adjustedWidth = width * pixelDensity;
  const adjustedHeight = height * pixelDensity;

  if (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
    return true;
  } else if (pixelDensity === 2 && (adjustedWidth >= 1920 || adjustedHeight >= 1920)) {
    return true;
  }

  return false;
}
