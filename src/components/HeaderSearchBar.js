// @flow

import React, { useState } from 'react';
import { SearchBar } from 'react-native-elements';

import translate from '../translate';

type Props = {
  isLoading: boolean,
  onSubmit: Function,
};

const HeaderSearchBar = ({ isLoading, onSubmit }): Props => {
  const [searchText, setSearchText] = useState('');

  const onChangeText = (value: string) => {
    setSearchText(value);
  };

  return (
    <SearchBar
      lightTheme
      onChangeText={text => onChangeText(text)}
      onSubmitEditing={event => onSubmit(event)}
      clearIcon={searchText !== ''}
      placeholder={translate('PLACEHOLDER_SEARCH_BAR')}
      showLoading={isLoading}
      value={searchText}
    />
  );
};

export default HeaderSearchBar;
