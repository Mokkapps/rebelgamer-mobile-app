// @flow

import {
  ActivityIndicator,
  Image,
  Linking,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Badge, Icon } from 'react-native-elements';
import moment from 'moment';
import MyWebView from 'react-native-webview-autoheight';
import React from 'react';

import Constants from './../Constants';
import HtmlDecoder from './../utils/HtmlDecoder';
import Post from './../Types';
import Style from './../Styles';
import Translate from './../utils/Translate';

type Props = {
  navigation: {
    setParams: Function,
    navigate: Object,
    params: {
      handleShare: Function,
      handleOpenInBrowser: Function
    },
    state: {
      params: {
        article: Post
      }
    }
  }
};

type State = {};

export default class ArticleListScreen extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    const { article } = params;

    return {
      title: '',
      headerTintColor: Constants.RebelGamerRed,
      headerRight: (
        <View style={styles.headerButtonGroup}>
          <Icon
            name="open-in-browser"
            color="red"
            onPress={() => params.handleOpenInBrowser(article.link)}
          />
          <Icon name="share" color="red" onPress={() => params.handleShare()} />
        </View>
      )
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({ handleShare: this._shareArticle });
    this.props.navigation.setParams({ handleOpenInBrowser: this._openUrl });
  }

  _openUrl = (url: string) => {
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          console.log(`Can't handle url: ${url}`);
        } else {
          Linking.openURL(url);
        }
      })
      .catch(err => console.error('An error occurred', err));
  };

  _shareArticle = () => {
    const { params } = this.props.navigation.state;
    const { article } = params;
    const appName: string = Translate.translate('appName');
    Share.share(
      {
        message: `${HtmlDecoder.decodeHtml(article.title.rendered)} - ${
          article.link
        }`,
        title: appName,
        url: article.link
      },
      {
        // Android only:
        dialogTitle: Translate.translate('shareDialogTitle')
      }
    );
  };

  _onLinkPress = (evt: any, href: string) => {
    this._openUrl(href);
  };

  _renderLoadingView() {
    return <ActivityIndicator color={Constants.RebelGamerRed} size="large" />;
  }

  _onShouldStartLoadWithRequest = event => {
    if (Platform.OS === 'ios' && event.navigationType === 'click') {
      Linking.openURL(event.url);
      return false;
    } else if (Platform.OS === 'android') {
      const { article } = this.props.navigation.state.params;
      if (
        event.url !== article.link &&
        event.url !== 'file:///android_asset/'
      ) {
        this._openUrl(event.url);
      }
    }

    return true;
  };

  render() {
    const { article } = this.props.navigation.state.params;
    const tags = article._embedded['wp:term'][1].map(tag => (
      <Badge
        key={tag.id}
        value={tag.name || ''}
        textStyle={{ color: 'white' }}
        containerStyle={{ backgroundColor: Constants.RebelGamerRed }}
      />
    ));

    return (
      <ScrollView>
        <Image
          style={styles.image}
          source={{
            uri: article._embedded['wp:featuredmedia'][0].source_url
          }}
        />
        <Text style={styles.headline}>
          {HtmlDecoder.decodeHtml(article.title.rendered)}
        </Text>
        <Text style={styles.author}>
          {`${moment(article.date).format('DD. MMMM YYYY, HH:mm')} | von ${
            article._embedded.author[0].name
          }`}
        </Text>
        <View style={styles.tagList}>{tags}</View>
        <View style={styles.separator} />
        <MyWebView
          style={{
            backgroundColor: 'transparent'
          }}
          scrollEnabled={false}
          source={{
            html: article.content.rendered + Style,
            baseUrl: Platform.OS === 'android' ? 'file:///android_asset/' : ''
          }}
          startInLoadingState
          renderLoading={this._renderLoadingView}
          onShouldStartLoadWithRequest={this._onShouldStartLoadWithRequest}
          onNavigationStateChange={this._onShouldStartLoadWithRequest}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: '#CED0CE',
    margin: 5
  },
  author: {
    fontSize: Constants.FontSizeDetailsDate,
    textAlign: 'center',
    margin: 5
  },
  image: {
    height: Constants.HeadlineImageHeigth
  },
  headline: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
    fontSize: Constants.FontSizeHeadline,
    margin: 5
  },
  headerButtonGroup: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 70,
    marginRight: 10
  },
  tagList: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 5
  }
});
