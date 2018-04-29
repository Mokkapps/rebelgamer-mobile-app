import { Alert, Dimensions, NetInfo, Platform } from 'react-native';
import React from 'react';
import { StackNavigator } from 'react-navigation';
import Toast from 'react-native-toast-native';

import LatestArticles from './components/LatestArticles';
import ArticleDetails from './components/ArticleDetails';
import ArticleSearch from './components/ArticleSearch';
import About from './components/About';
import translate from './translate';
import { REBELGAMER_RED } from './constants';

const AppStack = StackNavigator({
  LatestArticles: { screen: LatestArticles },
  ArticleDetails: { screen: ArticleDetails },
  ArticleSearch: { screen: ArticleSearch },
  About: { screen: About }
});

const NETWORK_FETCH_URL = 'https://google.com';

const toastStyle = {
  backgroundColor: REBELGAMER_RED,
  color: '#ffffff',
  height: Platform.OS === 'ios' ? 80 : 140,
  width: Dimensions.get('window').width - 20,
  borderRadius: 5
};

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
    Toast.show(message, Toast.LONG, Toast.CENTER, toastStyle);
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
    return (
      <AppStack
        screenProps={{
          probablyHasInternet: this.state.probablyHasInternet,
          showErrorAlert: this.showErrorAlert,
          showToast: this.showToast
        }}
      />
    );
  }
}
