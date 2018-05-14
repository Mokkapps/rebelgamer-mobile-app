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

import ArticleDetailsHeader from './ArticleDetailsHeader';
import Post from './../wp-types';
import ArticleDetailsHtmlStyle from './../article-details-html-styles';
import { REBELGAMER_RED } from '../constants';
import decodeHtml from '../html-decoder';

type Props = {
  navigation: {
    goBack: Function,
    setParams: Function,
    navigate: Object,
    params: {
      handleShare: Function,
      handleOpenInBrowser: Function
    },
    state: {
      params: {
        article: typeof Post
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
  },
  webview: {
    backgroundColor: 'transparent'
  }
});

class ArticleDetails extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    const { article } = params;

    return {
      title: '',
      headerTintColor: REBELGAMER_RED,
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

  onShouldStartLoadWithRequest = async (event): boolean => {
    if (Platform.OS === 'ios' && event.navigationType === 'click') {
      await this.openUrl(event.url);
      return false;
    } else if (Platform.OS === 'android') {
      const { article } = this.props.navigation.state.params;
      if (event.url !== article.link && event.url !== 'file:///android_asset/') {
        await this.openUrl(event.url);
      }
    }

    return true;
  };

  onTagSelect = tagName => {
    const { navigation } = this.props;
    navigation.goBack();
    navigation.state.params.onTagSelect(tagName);
  };

  shareArticle = () => {
    const { params } = this.props.navigation.state;
    const { article } = params;
    const appName: string = t('APP:APP_NAME');
    Share.share(
      {
        message: `${decodeHtml(article.title.rendered)} - ${article.link}`,
        title: appName,
        url: article.link
      },
      {
        // Android only:
        dialogTitle: t('APP:SHARE_DIALOG_TITLE')
      }
    );
  };

  openUrl = async (url: string): Promise<boolean> => {
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      console.warn(`Can't handle url: ${url}`);
    }
    const opened = await Linking.openURL(url);
    return Promise.resolve(opened);
  };

  stopLoading = () => {
    this.setState({ isLoading: false });
  };

  render() {
    const { navigate } = this.props.navigation;
    const { article } = this.props.navigation.state.params;
    const tags = article._embedded['wp:term'][1].map(tag => (
      <Badge
        wrapperStyle={{ padding: 5 }}
        key={tag.id}
        value={tag.name || ''}
        textStyle={{ color: 'white' }}
        containerStyle={{ backgroundColor: REBELGAMER_RED }}
        onPress={() => navigate('ArticleSearch', { tagName: tag.name })}
      />
    ));

    return (
      <ScrollView>
        <ArticleDetailsHeader article={article} />
        <View style={styles.separator} />
        <MyWebView
          style={styles.webview}
          scrollEnabled={false}
          source={{
            html: article.content.rendered + ArticleDetailsHtmlStyle,
            baseUrl: Platform.OS === 'android' ? 'file:///android_asset/' : ''
          }}
          onLoadEnd={this.stopLoading}
          startInLoadingState
          renderLoading={() => <ActivityIndicator color={REBELGAMER_RED} size="large" />}
          onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
          onNavigationStateChange={this.onShouldStartLoadWithRequest}
        />
        {!this.state.isLoading && (
          <View>
            <View style={styles.separator} />
            <View style={styles.tagList}>{tags}</View>
          </View>
        )}
      </ScrollView>
    );
  }
}

export default ArticleDetails;
