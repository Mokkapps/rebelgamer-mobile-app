// @flow

import { Image, StyleSheet, Text } from 'react-native';
import React from 'react';
import moment from 'moment';

import Post from './../wp-types';
import { FONT_SIZE_DETAILS_DATE, HEADLINE_IMAGE_HEIGHT, FONT_SIZE_HEADLINE } from '../constants';
import decodeHtml from '../utils/html-decoder';

type Props = {
  article: typeof Post
};

const styles = StyleSheet.create({
  author: {
    fontSize: FONT_SIZE_DETAILS_DATE,
    textAlign: 'center',
    margin: 5
  },
  image: {
    height: HEADLINE_IMAGE_HEIGHT
  },
  headline: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
    fontSize: FONT_SIZE_HEADLINE,
    margin: 5
  }
});

class ArticleDetailsHeader extends React.PureComponent<Props> {
  getDateAndAuthor = (article: typeof Post) =>
    `${moment(article.date).format('DD.MM.YYYY, HH:mm')} | von ${article._embedded.author[0].name}`;

  getArticleImage = (article: typeof Post) => article._embedded['wp:featuredmedia'][0].source_url;

  render() {
    const { article } = this.props;
    return [
      <Image key="image" style={styles.image} source={{ uri: this.getArticleImage(article) }} />,
      <Text key="headline" style={styles.headline}>{decodeHtml(article.title.rendered)}</Text>,
      <Text key="date-and-author" style={styles.author}>{this.getDateAndAuthor(article)}</Text>
    ];
  }
}

export default ArticleDetailsHeader;
