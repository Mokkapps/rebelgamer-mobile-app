// @flow

import React, { useCallback, useContext, useEffect, useState } from 'react';
import { NavigationState } from 'react-navigation';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import AsyncStorage from '@react-native-community/async-storage';

import ArticleList from '../components/ArticleList';
import HeaderImage from '../components/HeaderImage';
import HeaderButton from '../components/HeaderButton';
import Post from '../types/wp-types';
import translate from '../translate';
import { STORAGE_KEY } from '../constants';
import {
  getPostList,
  getWordpressUrl,
  removeDuplicates,
  showErrorAlert,
  showToast,
} from '../utils/utils';
import { InternetContext } from '../context/InternetContext';
import { useDataApi, usePrevious } from '../hooks';

type Props = {
  navigation: NavigationState,
};

const LatestArticles = ({ navigation }): Props => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderImage />,
      headerTitleAlign: 'center',
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="Search"
            iconName="search"
            onPress={() => navigation.navigate('ArticleSearch')}
          />
          <Item
            title="About"
            iconName="info-outline"
            onPress={() => navigation.navigate('About')}
          />
        </HeaderButtons>
      ),
    });
  }, [navigation]);

  const { probablyHasInternet } = useContext(InternetContext);
  const [isLoadingMoreArticles, setIsLoadingMoreArticles] = useState(false);
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);

  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    getWordpressUrl(page, ''),
    [],
  );

  useEffect(() => {
    if (!isLoading) {
      setIsLoadingMoreArticles(false);
    }
  }, [isLoading]);

  useEffect(() => {
    const newPosts = getPostList(posts, data, page);

    setIsLoadingMoreArticles(false);
    setPosts(newPosts);

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPosts))
      .then(() => {})
      .catch(err => console.error('Failed saving posts', err));
  }, [data]);

  const loadPosts = useCallback(
    async (pageNumber: number = 1) => {
      setPage(pageNumber);

      if (!probablyHasInternet) {
        const storedPosts = await getStoredArticles();
        setPosts(storedPosts);
        return Promise.resolve(storedPosts);
      }

      doFetch(getWordpressUrl(pageNumber, ''));
    },
    [doFetch, getStoredArticles, probablyHasInternet],
  );

  const getStoredPosts = async (): Promise<typeof Post[]> => {
    const storedPosts = await AsyncStorage.getItem(STORAGE_KEY);
    return Promise.resolve(storedPosts ? JSON.parse(storedPosts) : []);
  };

  const getStoredArticles = useCallback(async (): Promise<typeof Post[]> => {
    showToast(translate('LOAD_STORED_ARTICLES'));
    return getStoredPosts();
  }, []);

  const handleRefresh = async (): void => {
    await loadPosts(page);
  };

  const loadMoreArticles = async (): void => {
    setIsLoadingMoreArticles(true);
    await loadPosts(page + 1);
  };

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  if (isError) {
    showErrorAlert('ERROR_LOADING_POSTS');
    return;
  }

  return (
    <ArticleList
      navigation={navigation}
      posts={posts}
      isRefreshing={isLoading}
      isLoadingMoreArticles={isLoadingMoreArticles}
      onRefresh={handleRefresh}
      onLoadMoreArticles={loadMoreArticles}
    />
  );
};

export default LatestArticles;
