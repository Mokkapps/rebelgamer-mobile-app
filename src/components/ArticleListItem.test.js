import React from 'react';
import renderer from 'react-test-renderer';

import ArticleListItem from './ArticleListItem';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <ArticleListItem
        article={{
          id: 124,
          title: { rendered: 'title' },
          _embedded: { 'wp:featuredmedia': [{ source_url: 'URL' }] },
        }}
      />,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
