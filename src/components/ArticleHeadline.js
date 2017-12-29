// @flow
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';

import Constants from './../Constants';
import DateUtils from './../utils/DateUtils';
import HtmlDecoder from './../utils/HtmlDecoder';
import Post from './../Types';

type Props = {
  article: Post
};

export default class ArticleHeadline extends React.PureComponent<Props> {
  setNativeProps = (nativeProps: Props) => {
    if (this._root) {
      this._root.setNativeProps(nativeProps);
    }
  };

  _root: View | null;

  render() {
    const { article } = this.props;
    return (
      // eslint-disable-next-line no-return-assign
      <View ref={component => (this._root = component)} {...this.props}>
        <Image
          style={styles.image}
          source={{ uri: article._embedded['wp:featuredmedia'][0].source_url }}
        />
        <Text style={styles.headline}>
          {HtmlDecoder.decodeHtml(article.title.rendered)}
        </Text>
        <Text style={styles.date}>
          {DateUtils.getPostedAtDateString(article.date)}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: Dimensions.get('window').width,
    height: Constants.HeadlineImageHeigth,
    marginBottom: 5
  },
  headline: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: Constants.FontSizeHeadline,
    marginHorizontal: 10
  },
  date: {
    margin: 10,
    fontSize: Constants.FontSizeListDate
  }
});
