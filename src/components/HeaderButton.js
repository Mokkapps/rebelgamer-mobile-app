import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { HeaderButton } from 'react-navigation-header-buttons';

export default props => (
  <HeaderButton {...props} IconComponent={MaterialIcons} iconSize={25} />
);
