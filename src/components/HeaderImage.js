// @flow

import { Image, Platform, StyleSheet } from 'react-native';
import React from 'react';

const headerImage = require('../../assets/header.png');

const styles = StyleSheet.create({
  headerImage: {
    flex: 1,
    marginLeft: Platform.OS === 'android' ? -150 : 0,
    marginTop: 5,
    height: 30,
    resizeMode: 'contain',
  },
});

const HeaderImage = () => (
  <Image style={styles.headerImage} source={headerImage} />
);

export default HeaderImage;
