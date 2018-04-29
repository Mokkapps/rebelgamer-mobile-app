// @flow
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';

import Post from './../wp-types';
import { HEADLINE_IMAGE_HEIGHT, FONT_SIZE_HEADLINE, FONT_SIZE_LIST_DATE } from '../constants';
import getPostedAtDateString from '../utils/date-utils';
import decodeHtml from '../html-decoder';

type Props = {
  article: Post
};

const styles = StyleSheet.create({
  image: {
    width: Dimensions.get('window').width,
    height: HEADLINE_IMAGE_HEIGHT,
    marginBottom: 5
  },
  headline: {
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    fontSize: FONT_SIZE_HEADLINE,
    marginHorizontal: 10
  },
  date: {
    margin: 10,
    fontSize: FONT_SIZE_LIST_DATE
  }
});

class ArticleListItem extends React.PureComponent<Props> {
  setNativeProps = (nativeProps: Props) => {
    if (this.root) {
      this.root.setNativeProps(nativeProps);
    }
  };

  getArticleImage = (article: Post) => article._embedded['wp:featuredmedia'][0].source_url;

  root: View | null;

  render() {
    const { article } = this.props;
    return (
      // eslint-disable-next-line no-return-assign
      <View ref={component => (this.root = component)} {...this.props}>
        <Image style={styles.image} source={{ uri: this.getArticleImage(article) }} />
        <Text style={styles.headline}>{decodeHtml(article.title.rendered)}</Text>
        <Text style={styles.date}>{getPostedAtDateString(article.date)}</Text>
      </View>
    );
  }
}

export default ArticleListItem;
