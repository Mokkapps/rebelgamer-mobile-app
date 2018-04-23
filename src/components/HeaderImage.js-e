// @flow

import { Image, StyleSheet, Platform } from 'react-native';
import React from 'react';

const headerImage = require('../../assets/header.png');

type Props = {};
type State = {};

const styles = StyleSheet.create({
  headerImage: {
    flex: 1,
    marginLeft: Platform.OS === 'android' ? 50 : 0,
    marginTop: 5,
    height: 40,
    resizeMode: 'contain'
  }
});

class HeaderImage extends React.Component<Props, State> {
  render() {
    return <Image style={styles.headerImage} source={headerImage} />;
  }
}

export default HeaderImage;
