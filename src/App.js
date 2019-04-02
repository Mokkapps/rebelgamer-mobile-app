import { Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import Snackbar from 'react-native-snackbar';

import LatestArticles from './components/LatestArticles';
import ArticleDetails from './components/ArticleDetails';
import ArticleSearch from './components/ArticleSearch';
import About from './components/About';
import translate from './translate';
import { REBELGAMER_RED } from './constants';

const AppNavigator = createStackNavigator({
  LatestArticles: { screen: LatestArticles },
  ArticleDetails: { screen: ArticleDetails },
  ArticleSearch: { screen: ArticleSearch },
  About: { screen: About }
});

const AppContainer = createAppContainer(AppNavigator);

const NETWORK_FETCH_URL = 'https://google.com';

type Props = {};

type State = {
  probablyHasInternet: boolean | undefined
};

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      probablyHasInternet: undefined
    };

    NetInfo.addEventListener('connectionChange', this.handleConnectivityChange);
  }

  async componentDidMount() {
    await NetInfo.getConnectionInfo().then(this.handleConnectivityChange);
  }

  handleConnectivityChange = async () => {
    let probablyHasInternet;
    try {
      const googleCall = await fetch(NETWORK_FETCH_URL);
      probablyHasInternet = googleCall.status === 200;
    } catch (e) {
      probablyHasInternet = false;
    }

    this.setState({ probablyHasInternet });
  };

  showToast = message => {
    Snackbar.show({
      title: message,
      duration: Snackbar.SHORT
    });
  };

  showErrorAlert = (error: string): void => {
    Alert.alert(
      translate('ALERT_TITLE'),
      `${translate('ALERT_MESSAGE')} ${error}`,
      [
        {
          text: translate('OK'),
          style: 'cancel'
        }
      ],
      { cancelable: false }
    );
    console.error(error);
  };

  render() {
    const { probablyHasInternet } = this.state;
    return (
      <AppContainer
        screenProps={{
          probablyHasInternet,
          showErrorAlert: this.showErrorAlert,
          showToast: this.showToast
        }}
      />
    );
  }
}
