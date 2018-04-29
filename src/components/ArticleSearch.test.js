import React from 'react';
import renderer from 'react-test-renderer';

import ArticleSearch from './ArticleSearch';

it('renders correctly', () => {
  const navigation = { navigate: jest.fn() };

  const tree = renderer.create(<ArticleSearch navigation={navigation} />).toJSON();
  expect(tree).toMatchSnapshot();
});
