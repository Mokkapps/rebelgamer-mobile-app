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

import Constants from './../Constants';
import HtmlDecoder from './../utils/HtmlDecoder';
import Post from './../Types';
import Style from './../Styles';
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
  isLoading: boolean
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

    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ handleShare: this.shareArticle });
    this.props.navigation.setParams({ handleOpenInBrowser: this.openUrl });
  }

  onLinkPress = async (evt: any, href: string) => {
    await this.openUrl(href);
  };

  onShouldStartLoadWithRequest = async (event) => {
    if (Platform.OS === 'ios' && event.navigationType === 'click') {
      await this.openUrl(event.url);
      return false;
    } else if (Platform.OS === 'android') {
      const { article } = this.props.navigation.state.params;
      if (
        event.url !== article.link &&
        event.url !== 'file:///android_asset/'
      ) {
        await this.openUrl(event.url);
      }
    }

    return true;
  };

  openUrl = async (url: string): Promise<boolean> => {
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      console.log(`Can't handle url: ${url}`);
    }
    return Promise.resolve(supported);
  };

  shareArticle = () => {
    const { params } = this.props.navigation.state;
    const { article } = params;
    const appName: string = Translate.translate('APP_NAME');
    Share.share(
      {
        message: `${HtmlDecoder.decodeHtml(article.title.rendered)} - ${article.link}`,
        title: appName,
        url: article.link
      },
      {
        // Android only:
        dialogTitle: Translate.translate('SHARE_DIALOG_TITLE')
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
          onLoadStart={() => { this.state.isLoading = true; }}
          onLoadEnd={() => { this.state.isLoading = false; }}
          startInLoadingState
          renderLoading={() => <ActivityIndicator color={Constants.RebelGamerRed} size="large" />}
          onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
          onNavigationStateChange={this.onShouldStartLoadWithRequest}
        />
        {!this.state.isLoading &&
          <View>
            <View style={styles.separator} />
            <View style={styles.tagList}>{tags}</View>
          </View>
        }
      </ScrollView>
    );
  }
}

export default ArticleDetails;
