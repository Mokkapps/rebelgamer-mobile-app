// @flow

import React, { Component } from 'react';
import { SearchBar } from 'react-native-elements';

import translate from '../translate';

type Props = {
  isLoading: boolean,
  onSubmit: Function
};

type State = {
  searchText: string
};

export default class HeaderSearchBar extends Component<Props, State> {
  constructor() {
    super();

    this.state = {
      searchText: ''
    };
  }

  onChangeText = (value: string) => {
    this.setState({ searchText: value });
  };

  render() {
    const { isLoading, onSubmit } = this.props;
    const { searchText } = this.state;
    return (
      <SearchBar
        lightTheme
        onChangeText={text => this.onChangeText(text)}
        onSubmitEditing={event => onSubmit(event)}
        clearIcon={searchText !== ''}
        placeholder={translate('PLACEHOLDER_SEARCH_BAR')}
        showLoading={isLoading}
        value={searchText}
      />
    );
  }
}
