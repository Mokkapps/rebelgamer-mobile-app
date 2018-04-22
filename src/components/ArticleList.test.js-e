import React from 'react';
import renderer from 'react-test-renderer';

import ArticleListScreen from './ArticleListScreen';

it('renders correctly', () => {
  const navigation = { navigate: jest.fn() };
  const tree = renderer
    .create(<ArticleListScreen navigation={navigation} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
