// @flow

import { SearchBar } from 'react-native-elements';
import React from 'react';
import { NavigationState } from 'react-navigation';
import axios, { CancelTokenSource } from 'axios';
import debounce from 'debounce';

import ArticleList from './../components/ArticleList';
import Post from './../wp-types';
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
  isLoading: boolean,
  page: number,
  posts: typeof Post[]
};

class ArticleSearch extends React.Component<Props, State> {
  static navigationOptions = () => {
    return {
      headerTitle: t('APP:SEARCH_TITLE')
    };
  };

  constructor(props: Props) {
    super(props);

    if (
      this.props.navigation.state &&
      this.props.navigation.state.params &&
      this.props.navigation.state.params.tagName
    ) {
      this.query = this.props.navigation.state.params.tagName;
    }

    this.state = {
      isLoading: false,
      page: 1,
      posts: []
    };

    this.onChangeTextDelayed = debounce(this.onChangeText.bind(this), 500);
  }

  componentDidMount() {
    if (this.query) {
      this.loadPosts(1, this.query);
    }
  }

  componentWillReceiveProps() {
    if (!this.props.screenProps.probablyHasInternet) {
      this.props.screenProps.showErrorAlert(t('APP:NO_INTERNET_CONNECTION'));
    }
  }

  componentWillUnmount() {
    if (this.source) {
      this.source.cancel('Fetching posts canceled due to component unmounting');
    }
  }

  onChangeText = (value: string) => {
    this.query = value;
    this.loadPosts(1, value);
  };

  source: CancelTokenSource;

  _fetchPosts = async (): Promise<Post[]> => {
    // cancel the previous request
    if (typeof this.source !== typeof undefined) {
      this.source.cancel('Fetching posts canceled due to new request');
    }

    const { page } = this.state;
    if (!this.query && page === 1) {
      this.setState({ posts: [] });
    }
    // save the new request for cancellation
    this.source = axios.CancelToken.source();
    return fetchPosts(page, this.query, this.source.token);
  };

  handleFetchedPosts = (posts: typeof Post[] | undefined): void => {
    if (!posts) {
      return;
    }
    const newPosts = [...this.state.posts, ...posts];
    const newPostsSet = removeDuplicates(newPosts, 'id');

    this.setState({
      posts: newPostsSet,
      isLoading: false
    });
  };

  loadMoreArticles = (): void => {
    const { page } = this.state;
    this.loadPosts(page + 1);
  };

  loadPosts = (page: number = 1) => {
    this.setState(
      {
        page,
        isLoading: true
      },
      () => {
        this._fetchPosts()
          .then(posts => this.handleFetchedPosts(posts))
          .catch(err => this.props.screenProps.showErrorAlert(err));
      }
    );
  };

  query: string;

  render() {
    return (
      <ArticleList
        navigation={this.props.navigation}
        posts={this.state.posts}
        listHeader={() => (
          <SearchBar
            lightTheme
            onChangeText={this.onChangeTextDelayed}
            clearIcon={this.query !== ''}
            placeholder={t('APP:PLACEHOLDER_SEARCH_BAR')}
            showLoadingIcon={this.state.isLoading}
            value={this.query}
          />
        )}
        isLoadingMoreArticles={this.state.isLoading}
        onLoadMoreArticles={this.loadMoreArticles}
      />
    );
  }
}

export default ArticleSearch;
