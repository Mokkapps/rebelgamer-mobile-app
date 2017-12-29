import React from 'react';
import renderer from 'react-test-renderer';

import InfoScreen from './InfoScreen';

it('renders correctly', () => {
  const tree = renderer.create(<InfoScreen />).toJSON();
  expect(tree).toMatchSnapshot();
});
