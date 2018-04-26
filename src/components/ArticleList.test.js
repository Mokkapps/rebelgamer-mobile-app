import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import { ActivityIndicator } from 'react-native';
import { SearchBar } from 'react-native-elements';

import ArticleList from './ArticleList';
import translate from '../utils/translate';
import ArticleListItem from './ArticleListItem';
import getTestPosts from '../../test/test-utils';

it('renders correctly', () => {
  const navigation = { navigate: jest.fn() };

  const tree = renderer.create(<ArticleList navigation={navigation} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should show empty list if no articles are available', () => {
  const navigation = { navigate: jest.fn() };
  const wrapper = mount(<ArticleList navigation={navigation} />);

  const state = wrapper.state();
  expect(wrapper.find(ArticleListItem).length).toBe(0);
  expect(wrapper.find(ActivityIndicator).length).toBe(0);

  expect(state).toEqual({
    isLoadingMoreArticles: false,
    isRefreshing: true,
    page: 1,
    posts: [],
    query: ''
  });

  const searchBar = wrapper.find(SearchBar);
  const searchBarProps = searchBar.props();
  expect(searchBar.length).toBe(1);
  expect(searchBarProps.placeholder).toBe(translate('PLACEHOLDER_SEARCH_BAR'));
});

it('should show loaded articles', async done => {
  fetch.mockResponse(JSON.stringify(getTestPosts()));
  const navigation = { navigate: jest.fn() };

  const wrapper = mount(<ArticleList navigation={navigation} />);

  expect(wrapper.state()).toEqual({
    isLoadingMoreArticles: false,
    isRefreshing: true,
    page: 1,
    posts: [],
    query: ''
  });

  setTimeout(() => {
    try {
      const { posts } = wrapper.state();
      expect(posts.length).toBe(1);
      expect(wrapper.state()).toEqual({
        isLoadingMoreArticles: false,
        isRefreshing: false,
        page: 1,
        posts: getTestPosts(),
        query: ''
      });

      wrapper.update();
      expect(wrapper.find(ArticleListItem).length).toBe(1);

      done();
    } catch (e) {
      done.fail(e);
    }
  }, 500);
});
