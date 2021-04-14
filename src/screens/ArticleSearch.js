// @flow

import React, { useCallback, useContext, useEffect, useState } from 'react';
import { NavigationState } from 'react-navigation';

import ArticleList from '../components/ArticleList';
import HeaderSearchBar from '../components/HeaderSearchBar';
import FullScreenLoadingIndicator from '../components/FullScreenLoadingIndicator';
import translate from '../translate';
import {
  getWordpressUrl,
  removeDuplicates,
  showErrorAlert,
} from '../utils/utils';
import { REBELGAMER_RED } from '../constants';
import { useDataApi, usePrevious } from '../hooks';
import { InternetContext } from '../context/InternetContext';

type Props = {
  navigation: NavigationState,
};

const ArticleSearch = ({ route, navigation }): Props => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const { probablyHasInternet } = useContext(InternetContext);
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    getWordpressUrl(page, ''),
    [],
  );

  const prevData = usePrevious(data);

  let query = '';
  if (route.params) {
    query = route.params.tagName;
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: route.params
        ? route.params.tagName
        : translate('SEARCH_TITLE'),
      headerTintColor: REBELGAMER_RED,
    });
  }, [navigation]);

  const loadPosts = useCallback(
    async (pageNumber: number = 1, searchText = query) => {
      navigation.setOptions({ headerTitle: searchText });
      setPage(pageNumber);

      if (!probablyHasInternet) {
        showErrorAlert(translate('NO_INTERNET_CONNECTION'));
        return;
      }

      doFetch(getWordpressUrl(pageNumber, searchText));
    },
    [doFetch, probablyHasInternet],
  );

  const loadMoreArticles = (): void => {
    loadPosts(page + 1);
  };

  useEffect(() => {
    let newPostsWithoutDuplicates = data;

    if (page > 1) {
      newPostsWithoutDuplicates = removeDuplicates(
        [...prevData, ...newPostsWithoutDuplicates],
        'id',
      );
    }

    setPosts(newPostsWithoutDuplicates);
  }, [data]);

  useEffect(() => {
    if (query) {
      loadPosts();
    }
  }, []);

  if (isError) {
    showErrorAlert('ERROR_LOADING_POSTS');
    return;
  }

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
            onSubmit={event => loadPosts(1, event.nativeEvent.text)}
          />
        )}
        isLoadingMoreArticles={isLoading}
        onLoadMoreArticles={loadMoreArticles}
      />
    </>
  );
};

export default ArticleSearch;
