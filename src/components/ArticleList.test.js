import React from 'react';
import renderer from 'react-test-renderer';

import ArticleList from './ArticleList';

it('renders correctly', () => {
  fetch.mockResponse(JSON.stringify([]));
  const navigation = { navigate: jest.fn() };

  const tree = renderer.create(<ArticleList navigation={navigation} />).toJSON();
  expect(tree).toMatchSnapshot();
});
