import React from 'react';
import renderer from 'react-test-renderer';

import ArticleList from './ArticleList';
import getTestPosts from '../../test/test-utils';

it('renders correctly', () => {
  const navigation = { navigate: jest.fn() };

  const tree = renderer
    .create(
      <ArticleList
        navigation={navigation}
        posts={getTestPosts()}
        isRefreshing
        isLoadingMoreArticles={false}
        onRefresh={jest.fn()}
        onLoadMoreArticles={jest.fn()}
      />,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
