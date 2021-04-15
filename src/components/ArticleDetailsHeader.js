// @flow

import { Image, StyleSheet, Text } from 'react-native';
import React from 'react';
import moment from 'moment';

import Post from '../types/wp-types';
import {
  FONT_SIZE_DETAILS_DATE,
  HEADLINE_IMAGE_HEIGHT,
  FONT_SIZE_HEADLINE,
} from '../constants';
import decodeHtml from '../utils/html-decoder';

type Props = {
  article: typeof Post,
};

const styles = StyleSheet.create({
  author: {
    fontSize: FONT_SIZE_DETAILS_DATE,
    textAlign: 'center',
    margin: 5,
  },
  image: {
    height: HEADLINE_IMAGE_HEIGHT,
  },
  headline: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
    fontSize: FONT_SIZE_HEADLINE,
    margin: 5,
  },
});

const ArticleDetailsHeader = ({ article }): Props => {
  const getDateAndAuthor = (article: typeof Post) =>
    `${moment(article.date).format('DD.MM.YYYY, HH:mm')} | von ${
      article._embedded.author[0].name
    }`;

  const getArticleImage = (article: typeof Post) =>
    article._embedded['wp:featuredmedia'][0].source_url;

  return [
    <Image
      key="image"
      style={styles.image}
      source={{ uri: getArticleImage(article) }}
    />,
    <Text key="headline" style={styles.headline}>
      {decodeHtml(article.title.rendered)}
    </Text>,
    <Text key="date-and-author" style={styles.author}>
      {getDateAndAuthor(article)}
    </Text>,
  ];
};

export default ArticleDetailsHeader;
