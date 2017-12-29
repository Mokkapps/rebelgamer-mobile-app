// @flow

import {
  Button,
  Image,
  Linking,
  Platform,
  StyleSheet,
  View
} from 'react-native';
import React from 'react';
import { Text } from 'react-native-elements';
import email from 'react-native-email';

import { version } from './../../package.json';
import Constants from './../Constants';
import DeviceDetector from './../utils/DeviceDetector';
import Translate from './../utils/Translate';

const tvImage = require('../../assets/tv.png');

type Props = {};
type State = {};

export default class InfoScreen extends React.Component<Props, State> {
  static navigationOptions = {
    title: '',
    headerTintColor: Constants.RebelGamerRed
  };

  _onPressContact = () => {
    const os = Platform.OS === 'ios' ? 'iOS' : 'Android';
    const to = [Constants.MokkappsMail, Constants.RebelGamerMail];
    email(to, {
      subject: `${Translate.translate(
        'mailSubject'
      )} (Version: ${version}, OS: ${os})`
    }).catch(console.error);
  };

  _onPressRate = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL(
        `itms-apps://itunes.apple.com/app/id${Constants.AppleAppID}`
      );
    } else {
      Linking.openURL(
        `http://play.google.com/store/apps/details?id=${
          Constants.GooglePackageName
        }`
      );
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={tvImage} />
        <Text h3 style={styles.appName}>
          {Translate.translate('appName')}
        </Text>
        <Text>{`${Translate.translate('version')} ${version}`}</Text>
        <Text style={styles.description}>
          {Translate.translate('description')}
        </Text>
        <View style={styles.button}>
          <Button
            title={Translate.translate('contactUs')}
            color={Constants.RebelGamerRed}
            onPress={this._onPressContact}
          />
        </View>
        <View style={styles.button}>
          <Button
            title={Translate.translate('rateApp')}
            color={Constants.RebelGamerRed}
            onPress={this._onPressRate}
          />
        </View>
      </View>
    );
  }
}

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
