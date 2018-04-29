import React from 'react';
import renderer from 'react-test-renderer';

import LatestArticles from './LatestArticles';

it('renders correctly', () => {
  const navigation = { navigate: jest.fn() };

  const tree = renderer.create(<LatestArticles navigation={navigation} />).toJSON();
  expect(tree).toMatchSnapshot();
});
