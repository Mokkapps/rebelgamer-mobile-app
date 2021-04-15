import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { HeaderButton } from 'react-navigation-header-buttons';
import { REBELGAMER_RED } from '../constants';

export default props => (
  <HeaderButton
    {...props}
    IconComponent={MaterialIcons}
    iconSize={25}
    color={REBELGAMER_RED}
  />
);
