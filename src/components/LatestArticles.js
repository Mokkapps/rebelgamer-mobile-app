// @flow

import React from 'react';
import { NavigationState } from 'react-navigation';
import HeaderButtons, { Item } from 'react-navigation-header-buttons';
import AsyncStorage from '@react-native-community/async-storage';
import axios, { CancelTokenSource } from 'axios';

import ArticleList from './ArticleList';
import HeaderImage from './HeaderImage';
import HeaderButton from './HeaderButton';
import Post from '../wp-types';
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

class LatestArticles extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }) => {
    const { navigate } = navigation;

    return {
      headerTitle: <HeaderImage />,
      headerRight: (
        <HeaderButtons HeaderButtonComponent={HeaderButton} color="black">
          <Item title="Search" iconName="search" onPress={() => navigate('ArticleSearch')} />
          <Item title="About" iconName="info-outline" onPress={() => navigate('About')} />
        </HeaderButtons>
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

  componentWillReceiveProps() {
    this.loadPosts();
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
    const { screenProps } = this.props;
    screenProps.showToast(translate('LOAD_STORED_ARTICLES'));
    return this.getStoredPosts();
  };

  loadPosts = (
    page: number = 1,
    isLoadingMoreArticles: boolean = false,
    isRefreshing: boolean = true
  ) => {
    const { screenProps } = this.props;
    this.setState(
      {
        page,
        isLoadingMoreArticles,
        isRefreshing
      },
      () => {
        this._fetchPosts()
          .then(posts => this.handleFetchedPosts(posts))
          .catch(err => screenProps.showErrorAlert(err));
      }
    );
  };

  source: CancelTokenSource;

  _fetchPosts = async (): Promise<Post[]> => {
    const { screenProps } = this.props;

    // cancel the previous request
    if (typeof this.source !== typeof undefined) {
      this.source.cancel('Fetching posts canceled due to new request');
    }

    const { page } = this.state;
    if (!screenProps.probablyHasInternet) {
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

    let newPosts = posts;

    const { page } = this.state;

    if (page > 1) {
      newPosts = removeDuplicates([...this.state.posts, ...posts], 'id');
    }

    this.setState({
      posts: newPosts,
      isLoadingMoreArticles: false,
      isRefreshing: false
    });

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPosts))
      .then(() => {})
      .catch(err => console.error('Failed saving posts', err));
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
    const { navigation } = this.props;
    const { posts, isRefreshing, isLoadingMoreArticles } = this.state;

    return (
      <ArticleList
        navigation={navigation}
        posts={posts}
        isRefreshing={isRefreshing}
        isLoadingMoreArticles={isLoadingMoreArticles}
        onRefresh={this.handleRefresh}
        onLoadMoreArticles={this.loadMoreArticles}
      />
    );
  }
}

export default LatestArticles;
