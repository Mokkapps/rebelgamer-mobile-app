// @flow

import React from 'react';
import { NavigationState } from 'react-navigation';
import axios, { CancelTokenSource } from 'axios';

import ArticleList from './ArticleList';
import HeaderSearchBar from './HeaderSearchBar';
import FullScreenLoadingIndicator from './FullScreenLoadingIndicator';
import Post from '../wp-types';
import translate from '../translate';
import fetchPosts from '../wp-connector';
import removeDuplicates from '../utils/utils';
import { REBELGAMER_RED } from '../constants';

type Props = {
  navigation: NavigationState,
  screenProps: {
    probablyHasInternet: boolean | undefined,
    showErrorAlert: Function,
    showToast: Function,
  },
};

type State = {
  isLoading: boolean,
  page: number,
  posts: typeof Post[],
};

class ArticleSearch extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    return {
      headerTitle: state.params
        ? state.params.title
        : translate('SEARCH_TITLE'),
      headerTintColor: REBELGAMER_RED,
    };
  };

  constructor(props: Props) {
    super(props);

    const { navigation } = this.props;

    if (
      navigation.state &&
      navigation.state.params &&
      navigation.state.params.tagName
    ) {
      this.query = navigation.state.params.tagName;
    }

    this.state = {
      isLoading: false,
      page: 1,
      posts: [],
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { screenProps } = props;
    if (!screenProps.probablyHasInternet) {
      screenProps.showErrorAlert(translate('NO_INTERNET_CONNECTION'));
    }
  }

  componentDidMount() {
    if (this.query) {
      this.loadPosts(1, this.query);
    }
  }

  componentWillUnmount() {
    if (this.source) {
      this.source.cancel('Fetching posts canceled due to component unmounting');
    }
  }

  source: CancelTokenSource;

  _fetchPosts = async (searchText: string): Promise<Post[]> => {
    // cancel the previous request
    if (typeof this.source !== typeof undefined) {
      this.source.cancel('Fetching posts canceled due to new request');
    }

    const { page } = this.state;
    if (!searchText && page === 1) {
      this.setState({ posts: [] });
    }
    // save the new request for cancellation
    this.source = axios.CancelToken.source();
    return fetchPosts(page, searchText, this.source.token);
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
      isLoading: false,
    });
  };

  loadMoreArticles = (): void => {
    const { page } = this.state;
    this.loadPosts(page + 1);
  };

  loadPosts = (page: number = 1, searchText: string = '') => {
    const { screenProps } = this.props;

    if (searchText !== undefined) {
      this.query = searchText;
      const { setParams } = this.props.navigation;
      setParams({ title: searchText });
    }

    this.setState(
      {
        page,
        isLoading: true,
      },
      () => {
        this._fetchPosts(searchText)
          .then(posts => this.handleFetchedPosts(posts))
          .catch(err => screenProps.showErrorAlert(err));
      },
    );
  };

  query: string;

  render() {
    const { navigation } = this.props;
    const { posts, isLoading } = this.state;
    return (
      <>
        {isLoading ? <FullScreenLoadingIndicator /> : null}
        <ArticleList
          navigation={navigation}
          posts={posts}
          isRefreshing={isLoading}
          listHeader={() => (
            <HeaderSearchBar
              isLoading={isLoading}
              onSubmit={event => this.loadPosts(1, event.nativeEvent.text)}
            />
          )}
          isLoadingMoreArticles={isLoading}
          onLoadMoreArticles={this.loadMoreArticles}
        />
      </>
    );
  }
}
export default ArticleSearch;
