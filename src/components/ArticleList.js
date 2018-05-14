// @flow

import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import React from 'react';
import { NavigationState } from 'react-navigation';

import ArticleListItem from './../components/ArticleListItem';
import Post from './../wp-types';
import { REBELGAMER_RED } from '../constants';

type Props = {
  navigation: NavigationState,
  posts: typeof Post[],
  onTagSelect: Function,
  onRefresh: Function,
  onLoadMoreArticles: Function,
  isRefreshing: boolean,
  isLoadingMoreArticles: boolean,
  listHeader: any
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#CED0CE',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10
  },
  footer: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: '#CED0CE'
  },
  loadMoreButton: {
    margin: 10
  },
  noArticlesText: {
    textAlign: 'center',
    margin: 10
  }
});

class ArticleList extends React.Component<Props> {
  onTagSelect = tagName => {
    this.props.onTagSelect(tagName);
  };

  renderFooter = () => {
    if (!this.props.isLoadingMoreArticles && this.props.posts.length > 0) {
      return (
        <View>
          <View style={styles.separator} />
          <Button
            style={styles.loadMoreButton}
            title={t('APP:LOAD_MORE_ARTICLES')}
            color={REBELGAMER_RED}
            onPress={this.props.onLoadMoreArticles}
          />
        </View>
      );
    }

    if (this.props.isRefreshing) {
      return null;
    }

    if (this.props.posts.length === 0) {
      return <Text style={styles.noArticlesText}>{t('APP:FOUND_NO_ARTICLES')}</Text>;
    }

    return (
      <View style={styles.footer}>
        <ActivityIndicator color={REBELGAMER_RED} animating size="large" />
      </View>
    );
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <FlatList
          data={this.props.posts}
          renderItem={({ item }) => (
            <TouchableHighlight
              underlayColor="lightgray"
              onPress={() => navigate('ArticleDetails', { article: item })}
            >
              <ArticleListItem article={item} />
            </TouchableHighlight>
          )}
          keyExtractor={(item: Post) => item.id.toString()}
          ListHeaderComponent={this.props.listHeader}
          // Necessary to show footer on Android
          // eslint-disable-next-line react/jsx-no-bind
          ListFooterComponent={this.renderFooter.bind(this)}
          refreshing={this.props.isRefreshing}
          onRefresh={this.props.onRefresh}
        />
      </View>
    );
  }
}

export default ArticleList;
