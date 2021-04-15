// @flow
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import React, { useRef, useEffect } from 'react';

import Post from '../types/wp-types';
import {
  HEADLINE_IMAGE_HEIGHT,
  FONT_SIZE_HEADLINE,
  FONT_SIZE_LIST_DATE,
} from '../constants';
import getPostedAtDateString from '../utils/date-utils';
import decodeHtml from '../utils/html-decoder';

type Props = {
  article: Post,
};

const styles = StyleSheet.create({
  image: {
    width: Dimensions.get('window').width,
    height: HEADLINE_IMAGE_HEIGHT,
    marginBottom: 5,
  },
  headline: {
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    fontSize: FONT_SIZE_HEADLINE,
    marginHorizontal: 10,
  },
  date: {
    margin: 10,
    fontSize: FONT_SIZE_LIST_DATE,
  },
});

const ArticleListItem = (props: Props) => {
  let root = useRef(null);

  useEffect(() => {
    if (!root.current) {
      return;
    }
    root.current.setNativeProps(props);
  }, [props, root.current]);

  const { article } = props;

  const getArticleImage = (article: Post) =>
    article._embedded['wp:featuredmedia'][0].source_url;

  return (
    <View ref={component => (root = component)} {...props}>
      <Image style={styles.image} source={{ uri: getArticleImage(article) }} />
      <Text style={styles.headline}>{decodeHtml(article.title.rendered)}</Text>
      <Text style={styles.date}>{getPostedAtDateString(article.date)}</Text>
    </View>
  );
};

export default ArticleListItem;
