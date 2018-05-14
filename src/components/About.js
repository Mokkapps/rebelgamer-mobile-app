// @flow

import { Button, Image, Linking, Platform, StyleSheet, View } from 'react-native';
import React from 'react';
import { Text } from 'react-native-elements';
import email from 'react-native-email';

import { version } from './../../package.json';
import isTablet from './../device-detector';
import {
  REBELGAMER_RED,
  MOKKAPPS_MAIL,
  REBELGAMER_MAIL,
  APP_STORE_URL,
  GOOGLE_PLAY_URL
} from '../constants';

const TV_IMAGE = require('../../assets/tv.png');

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
    fontSize: isTablet() ? 20 : 15
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
    email(to, { subject: `${t('APP:MAIL_SUBJECT')} (Version: ${version}, OS: ${os})` }).catch(
      console.error
    );
  };

  onPressRate = async () => {
    if (Platform.OS === 'ios') {
      await Linking.openURL(APP_STORE_URL);
    } else {
      await Linking.openURL(GOOGLE_PLAY_URL);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={TV_IMAGE} />
        <Text h3 style={styles.appName}>
          {t('APP:APP_NAME')}
        </Text>
        <Text>{`${t('APP:VERSION')} ${version}`}</Text>
        <Text style={styles.description}>{t('APP:APP_DESCRIPTION')}</Text>
        <View style={styles.button}>
          <Button
            title={t('APP:CONTACT_US')}
            color={REBELGAMER_RED}
            onPress={this.onPressContact}
          />
        </View>
        <View style={styles.button}>
          <Button title={t('APP:RATE_APP')} color={REBELGAMER_RED} onPress={this.onPressRate} />
        </View>
      </View>
    );
  }
}

export default About;
