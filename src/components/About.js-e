// @flow

import { Button, Image, Linking, Platform, StyleSheet, View } from 'react-native';
import React from 'react';
import { Text } from 'react-native-elements';
import email from 'react-native-email';

import { version } from './../../package.json';
import DeviceDetector from './../utils/DeviceDetector';
import { REBELGAMER_RED, MOKKAPPS_MAIL, REBELGAMER_MAIL, APPLE_APP_ID, GOOGLE_PACKAGE_NAME } from '../constants';
import translate from '../utils/translate';

const tvImage = require('../../assets/tv.png');

const styles = StyleSheet.create({
  appName: {
    fontWeight: 'bold',
    color: 'black'
  },
  container: {
    margin: 10,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  image: {
    height: 100,
    width: 100,
    resizeMode: 'contain'
  },
  description: {
    marginTop: 20,
    textAlign: 'center',
    color: 'black',
    fontSize: DeviceDetector.isTablet() ? 20 : 15
  },
  button: {
    marginTop: 20,
    width: 200
  }
});

type Props = {};
type State = {};

class About extends React.Component<Props, State> {
  static navigationOptions = {
    title: '',
    headerTintColor: REBELGAMER_RED
  };

  onPressContact = () => {
    const os = Platform.OS === 'ios' ? 'iOS' : 'Android';
    const to = [MOKKAPPS_MAIL, REBELGAMER_MAIL];
    email(to, { subject: `${translate('mailSubject')} (Version: ${version}, OS: ${os})` }).catch(console.error);
  };

  onPressRate = async () => {
    if (Platform.OS === 'ios') {
      await Linking.openURL(`itms-apps://itunes.apple.com/app/id${APPLE_APP_ID}`);
    } else {
      await Linking.openURL(`http://play.google.com/store/apps/details?id=${GOOGLE_PACKAGE_NAME}`);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={tvImage} />
        <Text h3 style={styles.appName}>
          {translate('APP_NAME')}
        </Text>
        <Text>{`${translate('VERSION')} ${version}`}</Text>
        <Text style={styles.description}>{translate('APP_DESCRIPTION')}</Text>
        <View style={styles.button}>
          <Button title={translate('CONTACT_US')} color={REBELGAMER_RED} onPress={this.onPressContact} />
        </View>
        <View style={styles.button}>
          <Button title={translate('RATE_APP')} color={REBELGAMER_RED} onPress={this.onPressRate} />
        </View>
      </View>
    );
  }
}

export default About;
