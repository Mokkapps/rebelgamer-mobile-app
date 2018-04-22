// @flow

import {
  ActivityIndicator,
  Linking,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  View
} from 'react-native';
import { Badge, Icon } from 'react-native-elements';
import MyWebView from 'react-native-webview-autoheight';
import React from 'react';

import Constants from './../constants';
import HtmlDecoder from './../utils/HtmlDecoder';
import Post from './../types';
import Style from './../styles';
import Translate from './../utils/Translate';
import ArticleDetailsHeader from './ArticleDetailsHeader';

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

type State = {
  loading: boolean
};

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: '#CED0CE',
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
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    margin: 5
  }
});

class ArticleDetails extends React.Component<Props, State> {

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

  constructor(props: Props) {
    super(props);
    this.setState({
      loading: true
    });
  }

  componentDidMount() {
    this.props.navigation.setParams({ handleShare: this.shareArticle });
    this.props.navigation.setParams({ handleOpenInBrowser: this.openUrl });
  }

  onLinkPress = (evt: any, href: string) => {
    this.openUrl(href);
  };

  onShouldStartLoadWithRequest = event => {
    if (Platform.OS === 'ios' && event.navigationType === 'click') {
      Linking.openURL(event.url);
      return false;
    } else if (Platform.OS === 'android') {
      const { article } = this.props.navigation.state.params;
      if (
        event.url !== article.link &&
        event.url !== 'file:///android_asset/'
      ) {
        this.openUrl(event.url);
      }
    }

    return true;
  };

  openUrl = (url: string) => {
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

  shareArticle = () => {
    const { params } = this.props.navigation.state;
    const { article } = params;
    const appName: string = Translate.translate('appName');
    Share.share(
      {
        message: `${HtmlDecoder.decodeHtml(article.title.rendered)} - ${article.link}`,
        title: appName,
        url: article.link
      },
      {
        // Android only:
        dialogTitle: Translate.translate('shareDialogTitle')
      }
    );
  };

  render() {
    const { article } = this.props.navigation.state.params;
    const tags = article._embedded['wp:term'][1].map(tag => (
      <Badge
        wrapperStyle={{ padding: 5 }}
        key={tag.id}
        value={tag.name || ''}
        textStyle={{ color: 'white' }}
        containerStyle={{ backgroundColor: Constants.RebelGamerRed }}
      />
    ));
    const loadingView = <ActivityIndicator color={Constants.RebelGamerRed} size="large" />;

    return (
      <ScrollView>
        <ArticleDetailsHeader article={article} />
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
          renderLoading={loadingView}
          onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
          onNavigationStateChange={this.onShouldStartLoadWithRequest}
        />
        <View style={styles.separator} />
        <View style={styles.tagList}>{tags}</View>
      </ScrollView>
    );
  }
}

export default ArticleDetails;
