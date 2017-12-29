// @flow

import { NetInfo, Platform } from 'react-native';

class NetInfoUtils {
  async hasInternetConnection(): Promise<boolean> {
    let isConnected: boolean = false;

    // Workaround until https://github.com/facebook/react-native/issues/8615 is fixed
    try {
      if (Platform.OS === 'ios') {
        const response = await fetch('https://www.google.com');
        isConnected = response.status === 200;
      } else {
        isConnected = await NetInfo.isConnected.fetch();
      }
    } catch (error) {
      console.error(error);
    }

    return Promise.resolve(isConnected);
  }
}

export default new NetInfoUtils();
