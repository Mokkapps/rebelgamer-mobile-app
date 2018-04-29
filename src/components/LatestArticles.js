// @flow

import { AsyncStorage, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';
import React from 'react';
import { NavigationState } from 'react-navigation';
import axios, { CancelTokenSource } from 'axios';

import ArticleList from './../components/ArticleList';
import HeaderImage from './../components/HeaderImage';
import Post from './../wp-types';
import translate from '../translate';
import { STORAGE_KEY } from '../constants';
import fetchPosts from '../wp-connector';
import removeDuplicates from '../utils/utils';

type Props = {
  navigation: NavigationState,
  screenProps: {
    probablyHasInternet: boolean | undefined,
    showErrorAlert: Function,
    showToast: Function
  }
};

type State = {
  isLoadingMoreArticles: boolean,
  page: number,
  posts: typeof Post[],
  isRefreshing: boolean
};

const styles = StyleSheet.create({
  headerButtonGroup: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 70,
    marginRight: 10
  }
});

class LatestArticles extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }) => {
    const { navigate } = navigation;

    return {
      headerTitle: <HeaderImage />,
      headerRight: (
        <View style={styles.headerButtonGroup}>
          <Icon name="search" onPress={() => navigate('ArticleSearch')} />
          <Icon name="info-outline" onPress={() => navigate('About')} />
        </View>
      )
    };
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      isLoadingMoreArticles: false,
      page: 1,
      posts: [],
      isRefreshing: true
    };
  }

  async componentWillReceiveProps() {
    await this.loadPosts();
  }

  componentWillUnmount() {
    if (this.source) {
      this.source.cancel('Fetching posts canceled due to component unmounting');
    }
  }

  getStoredPosts = async (): Promise<typeof Post[]> => {
    const storedPosts = await AsyncStorage.getItem(STORAGE_KEY);
    return Promise.resolve(storedPosts ? JSON.parse(storedPosts) : []);
  };

  getStoredArticles = async (): Promise<typeof Post[]> => {
    this.props.screenProps.showToast(translate('LOAD_STORED_ARTICLES'));
    return this.getStoredPosts();
  };

  loadPosts = (
    page: number = 1,
    isLoadingMoreArticles: boolean = false,
    isRefreshing: boolean = true
  ) => {
    this.setState(
      {
        page,
        isLoadingMoreArticles,
        isRefreshing
      },
      () => {
        this._fetchPosts()
          .then(posts => this.handleFetchedPosts(posts))
          .catch(err => this.props.screenProps.showErrorAlert(err));
      }
    );
  };

  source: CancelTokenSource;

  _fetchPosts = async (): Promise<Post[]> => {
    // cancel the previous request
    if (typeof this.source !== typeof undefined) {
      this.source.cancel('Fetching posts canceled due to new request');
    }

    const { page } = this.state;
    if (!this.props.screenProps.probablyHasInternet) {
      const storedPosts = await this.getStoredArticles();
      return Promise.resolve(storedPosts);
    }

    // save the new request for cancellation
    this.source = axios.CancelToken.source();
    return fetchPosts(page, '', this.source.token);
  };

  handleFetchedPosts = (posts: typeof Post[] | undefined): void => {
    if (!posts) {
      return;
    }
    const newPosts = [...this.state.posts, ...posts];
    const newPostsSet = removeDuplicates(newPosts, 'id');

    this.setState({
      posts: newPostsSet,
      isLoadingMoreArticles: false,
      isRefreshing: false
    });

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.state.posts));
  };

  handleRefresh = (): void => {
    const { page } = this.state;
    this.loadPosts(page, false, true);
  };

  loadMoreArticles = (): void => {
    const { page } = this.state;
    this.loadPosts(page + 1, true, false);
  };

  render() {
    return (
      <ArticleList
        navigation={this.props.navigation}
        posts={this.state.posts}
        isRefreshing={this.state.isRefreshing}
        isLoadingMoreArticles={this.state.isLoadingMoreArticles}
        onRefresh={this.handleRefresh}
        onLoadMoreArticles={this.loadMoreArticles}
      />
    );
  }
}

export default LatestArticles;
