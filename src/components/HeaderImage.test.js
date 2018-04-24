import React from 'react';
import renderer from 'react-test-renderer';

import HeaderImage from './HeaderImage';

it('renders correctly', () => {
  const tree = renderer.create(<HeaderImage />).toJSON();
  expect(tree).toMatchSnapshot();
});
