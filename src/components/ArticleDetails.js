// @flow

import {
  ActivityIndicator,
  Linking,
  Dimensions,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  View,
} from 'react-native';
import { Badge } from 'react-native-elements';
import AutoHeightWebView from 'react-native-autoheight-webview';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import React, { Fragment } from 'react';

import ArticleDetailsHeader from './ArticleDetailsHeader';
import HeaderButton from './HeaderButton';
import Post from '../wp-types';
import ArticleDetailsHtmlStyle from '../article-details-html-styles';
import translate from '../translate';
import { REBELGAMER_RED } from '../constants';
import decodeHtml from '../html-decoder';

type Props = {
  navigation: {
    goBack: Function,
    setParams: Function,
    navigate: Object,
    params: {
      handleShare: Function,
      handleOpenInBrowser: Function,
    },
    state: {
      params: {
        article: typeof Post,
      },
    },
  },
};

type State = {
  isLoading: boolean,
};

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: '#CED0CE',
    margin: 5,
  },
  tagList: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    margin: 5,
  },
  webview: {
    padding: 10,
  },
});

class ArticleDetails extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    const { article } = params;

    return {
      title: '',
      headerTintColor: REBELGAMER_RED,
      headerRight: (
        <HeaderButtons
          HeaderButtonComponent={HeaderButton}
          color={REBELGAMER_RED}>
          <Item
            title="Open In Browser"
            iconName="open-in-browser"
            color="red"
            onPress={() => params.handleOpenInBrowser(article.link)}
          />
          <Item
            title="Artikel teilen"
            iconName="share"
            color="red"
            onPress={() => params.handleShare()}
          />
        </HeaderButtons>
      ),
    };
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    navigation.setParams({ handleShare: this.shareArticle });
    navigation.setParams({ handleOpenInBrowser: this.openUrl });
  }

  onLinkPress = async (evt: any, href: string) => {
    await this.openUrl(href);
  };

  onShouldStartLoadWithRequest = async (event): boolean => {
    const { navigation } = this.props;

    if (Platform.OS === 'ios' && event.navigationType === 'click') {
      await this.openUrl(event.url);
      return false;
    }

    if (Platform.OS === 'android') {
      const { article } = navigation.state.params;
      if (
        event.url !== article.link &&
        event.url !== 'file:///android_asset/'
      ) {
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
    const { navigation } = this.props;
    const { params } = navigation.state;
    const { article } = params;
    const appName: string = translate('APP_NAME');
    Share.share(
      {
        message: `${decodeHtml(article.title.rendered)} - ${article.link}`,
        title: appName,
        url: article.link,
      },
      {
        // Android only:
        dialogTitle: translate('SHARE_DIALOG_TITLE'),
      },
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
    const { isLoading } = this.state;
    const { navigation } = this.props;
    const { navigate } = navigation;
    const { article } = navigation.state.params;
    const tags = article._embedded['wp:term'][1].map(tag => (
      <Badge
        containerStyle={{ margin: 7 }}
        badgeStyle={{ backgroundColor: REBELGAMER_RED }}
        key={tag.id}
        value={tag.name || ''}
        textStyle={{ color: 'white' }}
        // containerStyle={{ margin: 10 }}
        onPress={() => navigate('ArticleSearch', { tagName: tag.name })}
      />
    ));

    return (
      <ScrollView>
        <ArticleDetailsHeader article={article} />
        <View style={styles.separator} />
        <View style={styles.webview}>
          <AutoHeightWebView
            scrollEnabled={false}
            // default width is the width of screen
            // if there are some text selection issues on iOS, the width should be reduced more than 15
            style={{
              width: Dimensions.get('window').width - 15,
            }}
            customStyle={ArticleDetailsHtmlStyle}
            source={{
              html: article.content.rendered,
            }}
            onLoadEnd={this.stopLoading}
            startInLoadingState
            renderLoading={() => (
              <ActivityIndicator color={REBELGAMER_RED} size="large" />
            )}
            onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
            onNavigationStateChange={this.onShouldStartLoadWithRequest}
          />
        </View>
        {!isLoading && (
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
