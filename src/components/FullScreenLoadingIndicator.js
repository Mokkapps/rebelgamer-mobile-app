import React from 'react';
import { ActivityIndicator, Dimensions, View } from 'react-native';

import { REBELGAMER_RED } from '../constants';

export default () => (
  <View
    style={{
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    }}>
    <ActivityIndicator
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      color={REBELGAMER_RED}
      animating
      size="large"
    />
  </View>
);
