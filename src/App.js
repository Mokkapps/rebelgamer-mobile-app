import 'react-native-gesture-handler';
import {Alert, Platform} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Snackbar from 'react-native-snackbar';

import LatestArticles from './components/LatestArticles';
import ArticleDetails from './components/ArticleDetails';
import ArticleSearch from './components/ArticleSearch';
import About from './components/About';
import translate from './translate';

const AppNavigator = createStackNavigator({
  LatestArticles: { screen: LatestArticles },
  ArticleDetails: { screen: ArticleDetails },
  ArticleSearch: { screen: ArticleSearch },
  About: { screen: About },
});

const AppContainer = createAppContainer(AppNavigator);

type Props = {};

type State = {
  probablyHasInternet: boolean | undefined,
};

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      probablyHasInternet: true,
    };
  }

  componentDidMount(): void {
    let initialNetworkState = false;
    NetInfo.addEventListener(state => {
      if (Platform.OS === 'ios' && !initialNetworkState) {
        initialNetworkState = true;
        return;
      }
      const probablyHasInternet = state.isConnected && state.isInternetReachable;
      this.setState({ probablyHasInternet });
    });
  }

  showToast = message => {
    Snackbar.show({
      title: message,
      duration: Snackbar.SHORT,
    });
  };

  showErrorAlert = (error: string): void => {
    Alert.alert(
      translate('ALERT_TITLE'),
      `${translate('ALERT_MESSAGE')} ${error}`,
      [
        {
          text: translate('OK'),
          style: 'cancel',
        },
      ],
      { cancelable: false },
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
          showToast: this.showToast,
        }}
      />
    );
  }
}

export default App;
