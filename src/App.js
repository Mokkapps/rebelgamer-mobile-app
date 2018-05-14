import { Alert, Dimensions, NetInfo, Platform } from 'react-native';
import React from 'react';
import { StackNavigator } from 'react-navigation';
import Toast from 'react-native-toast-native';
import { I18nextProvider, translate } from 'react-i18next';
import { getLanguages } from 'react-native-i18n';

import LatestArticles from './components/LatestArticles';
import ArticleDetails from './components/ArticleDetails';
import ArticleSearch from './components/ArticleSearch';
import About from './components/About';
import { REBELGAMER_RED } from './constants';
import i18n, { t } from '../assets/i18n/i18n';

global.t = t;

getLanguages().then((languages) => {
  // languages is an array of the users preferred order of IETF language tags.
  // ['en', 'nl-NL', 'pt-BR'] should be English.

  const languagesWithoutCountry = languages.map(
    language => language.split('-')[0]
  );
  const availableLanguages = ['en', 'nl', 'de', 'fr'];

  const preferredLanguage = languagesWithoutCountry.find(language =>
    availableLanguages.includes(language)
  );

  switch (preferredLanguage) {
    case 'de':
      i18n.changeLanguage('de');
      break;
    default:
      i18n.changeLanguage('en');
  }
});

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

// That will reload app when language changed so the text will changes real-time
const ReloadAppOnLanguageChange = translate('common', {
  bindI18n: 'languageChanged',
  bindStore: false,
})(AppStack);

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
      <I18nextProvider i18n={i18n}>
        <ReloadAppOnLanguageChange
          screenProps={{
            probablyHasInternet: this.state.probablyHasInternet,
            showErrorAlert: this.showErrorAlert,
            showToast: this.showToast
          }}
        />
      </I18nextProvider>
    );
  }
}
