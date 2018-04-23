// @flow

import { Image, StyleSheet, Text } from 'react-native';
import React from 'react';
import moment from 'moment';

import HtmlDecoder from './../utils/HtmlDecoder';
import Constants from './../Constants';
import Post from './../Types';

type Props = {
  article: Post
};

const styles = StyleSheet.create({
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
  }
});

class ArticleDetailsHeader extends React.PureComponent<Props> {
  getDateAndAuthor = (article: Post) =>
    `${moment(article.date).format('DD.MM.YYYY, HH:mm')} | von ${article._embedded.author[0].name}`;

  getArticleImage = (article: Post) => article._embedded['wp:featuredmedia'][0].source_url;

  render() {
    const { article } = this.props;
    return (
      [
        <Image
          style={styles.image}
          source={{
            uri: this.getArticleImage(article)
          }}
        />,
        <Text style={styles.headline}>
          {HtmlDecoder.decodeHtml(article.title.rendered)}
        </Text>,
        <Text style={styles.author}>
          {this.getDateAndAuthor(article)}
        </Text>
      ]
    );
  }
}

export default ArticleDetailsHeader;
