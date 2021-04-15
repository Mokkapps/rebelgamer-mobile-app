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
import AutoHeightWebView from 'react-native-autoheight-webview';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import React, { useCallback, useState } from 'react';

import ArticleDetailsHeader from '../components/ArticleDetailsHeader';
import HeaderButton from '../components/HeaderButton';
import ArticleDetailsHtmlStyle from '../article-details-html-styles';
import translate from '../translate';
import { REBELGAMER_RED } from '../constants';
import decodeHtml from '../html-decoder';
import { Badge } from 'react-native-elements';

type Props = {
  navigation: any,
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

const ArticleDetails = ({ route, navigation }): Props => {
  const [isLoading, setIsLoading] = useState(true);
  const { navigate } = navigation;
  const { article } = route.params;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerTintColor: REBELGAMER_RED,
      headerRight: () => (
        <HeaderButtons
          HeaderButtonComponent={HeaderButton}
          color={REBELGAMER_RED}>
          <Item
            title="Open In Browser"
            iconName="open-in-browser"
            color="red"
            onPress={() => openUrl(article.link)}
          />
          <Item
            title="Artikel teilen"
            iconName="share"
            color="red"
            onPress={() => shareArticle()}
          />
        </HeaderButtons>
      ),
    });
  }, [article.link, navigation]);

  const onShouldStartLoadWithRequest = async (event): boolean => {
    if (Platform.OS === 'ios' && event.navigationType === 'click') {
      await openUrl(event.url);
      return false;
    }

    if (Platform.OS === 'android') {
      if (
        event.url !== article.link &&
        event.url !== 'file:///android_asset/'
      ) {
        await openUrl(event.url);
      }
    }

    return true;
  };

  const shareArticle = useCallback(() => {
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
  }, [article.link, article.title.rendered]);

  const openUrl = async (url: string): Promise<boolean> => {
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      console.warn(`Can't handle url: ${url}`);
    }
    const opened = await Linking.openURL(url);
    return Promise.resolve(opened);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  const tags = article._embedded['wp:term'][1].map(tag => (
    <Badge
      badgeStyle={{ backgroundColor: REBELGAMER_RED }}
      key={tag.id}
      value={tag.name || ''}
      textStyle={{ color: 'white' }}
      onPress={() => navigate('ArticleSearch', { tagName: tag.name })}
      text={tag.name || ''}
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
          onLoadEnd={stopLoading}
          startInLoadingState
          renderLoading={() => (
            <ActivityIndicator color={REBELGAMER_RED} size="large" />
          )}
          onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
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
};

export default ArticleDetails;
