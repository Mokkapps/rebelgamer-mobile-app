// @flow

import React from 'react';
import {
  Button,
  Image,
  Linking,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { Text } from 'react-native-elements';
import email from 'react-native-email';

import { version } from '../../version.json';
import isTablet from '../device-detector';
import {
  REBELGAMER_RED,
  MOKKAPPS_MAIL,
  REBELGAMER_MAIL,
  APP_STORE_URL,
  GOOGLE_PLAY_URL,
} from '../constants';
import translate from '../translate';

const TV_IMAGE = require('../../assets/tv.png');

const styles = StyleSheet.create({
  appName: {
    fontWeight: 'bold',
    color: 'black',
  },
  container: {
    margin: 10,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  image: {
    height: 100,
    width: 100,
    resizeMode: 'contain',
  },
  description: {
    marginTop: 20,
    textAlign: 'center',
    color: 'black',
    fontSize: isTablet() ? 20 : 15,
  },
  button: {
    marginTop: 20,
    width: 200,
  },
});

const About = ({ navigation }) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerTintColor: REBELGAMER_RED,
    });
  }, [navigation]);

  const onPressContact = () => {
    const os = Platform.OS === 'ios' ? 'iOS' : 'Android';
    const to = [MOKKAPPS_MAIL, REBELGAMER_MAIL];
    email(to, {
      subject: `${translate('MAIL_SUBJECT')} (Version: ${version}, OS: ${os})`,
    }).catch(console.error);
  };

  const onPressRate = async () => {
    if (Platform.OS === 'ios') {
      await Linking.openURL(APP_STORE_URL);
    } else {
      await Linking.openURL(GOOGLE_PLAY_URL);
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={TV_IMAGE} />
      <Text h3 style={styles.appName}>
        {translate('APP_NAME')}
      </Text>
      <Text>{`${translate('VERSION')} ${version}`}</Text>
      <Text style={styles.description}>{translate('APP_DESCRIPTION')}</Text>
      <View style={styles.button}>
        <Button
          title={translate('CONTACT_US')}
          color={REBELGAMER_RED}
          onPress={onPressContact}
        />
      </View>
      <View style={styles.button}>
        <Button
          title={translate('RATE_APP')}
          color={REBELGAMER_RED}
          onPress={onPressRate}
        />
      </View>
    </View>
  );
};

export default About;
