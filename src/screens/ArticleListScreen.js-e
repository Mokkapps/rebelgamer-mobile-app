// @flow

import {
  ActivityIndicator,
  Alert,
  AsyncStorage,
  FlatList,
  Platform,
  StyleSheet,
  TouchableHighlight,
  View
} from 'react-native';
import { Icon, SearchBar } from 'react-native-elements';
import { debounce } from 'lodash';
import React from 'react';
import { Subscription } from 'rxjs/Subscription';
import Toast from 'react-native-easy-toast';
import type { NavigationState } from 'react-navigation/src/TypeDefinition';

import ArticleHeadline from './../components/ArticleHeadline';
import Constants from './../Constants';
import FetchService from './../services/FetchService';
import HeaderImage from './../components/HeaderImage';
import NetInfoUtils from './../utils/NetInfoUtils';
import Post from './../Types';
import Translate from './../utils/Translate';

type Props = {
  navigation: NavigationState
};

type State = {
  loading: boolean,
  page: number,
  data: Post[],
  refreshing: boolean,
  searchText: string
};

export default class ArticleListScreen extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }) => {
    const { navigate } = navigation;

    return {
      headerTitle: <HeaderImage style={styles.headerImage} />,
      headerTitleStyle: { alignSelf: 'center', textAlign: 'center' },
      headerRight: (
        <Icon
          iconStyle={{ marginRight: 10 }}
          name="info-outline"
          onPress={() => navigate('Info')}
        />
      )
    };
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      loading: true,
      page: 1,
      data: [],
      refreshing: false,
      searchText: ''
    };
    this.onSearchTextDelayed = debounce(
      this._handleSearchOnChange.bind(this),
      500
    );
  }

  componentDidMount() {
    this._fetchPosts();
  }

  onSearchTextDelayed: Function;
  subscription: Subscription;

  async _getStoredPosts(): Promise<Post[]> {
    let storedPosts: string = '';
    try {
      storedPosts = await AsyncStorage.getItem(Constants.StorageKey);
    } catch (error) {
      console.error(error);
    }

    return Promise.resolve(storedPosts ? JSON.parse(storedPosts) : []);
  }

  _checkConnection = async () => {
    const hasInternetConnection = await NetInfoUtils.hasInternetConnection();
    if (!hasInternetConnection) {
      // eslint-disable-next-line react/no-string-refs
      this.refs.toast.show(Translate.translate('loadStoredArticles'), 5000);
      const posts = await this._getStoredPosts();
      if (posts) {
        this.setState({ data: posts });
      }
    }
    return hasInternetConnection;
  };

  _fetchPosts = async () => {
    this.setState({ loading: true });

    const hasInternetConnection = await this._checkConnection();
    if (!hasInternetConnection) {
      return;
    }

    const { page } = this.state;

    // Clear article list if necessary
    if (
      (this.state.searchText && this.state.page === 1) ||
      this.state.refreshing
    ) {
      this.setState({ data: [] });
    }

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = FetchService.getPosts(
      page,
      this.state.searchText
    ).subscribe(
      (posts: Post[]) => {
        this.setState({
          data: [...this.state.data, ...posts],
          loading: false,
          refreshing: false
        });

        AsyncStorage.setItem(
          Constants.StorageKey,
          JSON.stringify(this.state.data)
        );
      },
      error => {
        console.error(error);
        this.setState({ loading: false });
        this._showAlert(error);
      }
    );
  };

  _showAlert = (error: string) => {
    Alert.alert(
      Translate.translate('alertTitle'),
      `${Translate.translate('alertMessage')} ${error}`,
      [
        {
          text: Translate.translate('ok'),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        }
      ],
      { cancelable: false }
    );
  };

  _handleRefresh = () => {
    this.setState(
      {
        refreshing: true,
        page: 1
      },
      () => {
        this._fetchPosts();
      }
    );
  };

  _handleLoadMore = () => {
    this.setState(
      {
        page: this.state.page + 1
      },
      () => {
        this._fetchPosts();
      }
    );
  };

  _handleSearchOnChange = (searchText: string) => {
    this.setState({ searchText });
    this._fetchPosts();
  };

  _renderSeparator = () => <View style={styles.separator} />;

  _renderHeader = () => (
    <SearchBar
      lightTheme
      onChangeText={this.onSearchTextDelayed}
      placeholder={Translate.translate('placeHolderSearchBar')}
    />
  );

  _renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View style={styles.footer}>
        <ActivityIndicator
          color={Constants.RebelGamerRed}
          animating
          size="large"
        />
      </View>
    );
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <TouchableHighlight
              onPress={() => navigate('ArticleDetails', { article: item })}
            >
              <ArticleHeadline article={item} />
            </TouchableHighlight>
          )}
          keyExtractor={(item: Post) => item.id}
          ItemSeparatorComponent={this._renderSeparator}
          ListHeaderComponent={this._renderHeader}
          // Necessary to show footer on Android
          // eslint-disable-next-line react/jsx-no-bind
          ListFooterComponent={this._renderFooter.bind(this)}
          refreshing={this.state.refreshing}
          onRefresh={this._handleRefresh}
          onEndReached={this._handleLoadMore}
          onEndReachedThreshold={0.5}
        />
        <Toast
          ref="toast" // eslint-disable-line react/no-string-refs
          style={{ backgroundColor: Constants.RebelGamerRed }}
          positionValue={150}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  separator: {
    height: 1,
    width: '86%',
    backgroundColor: '#CED0CE',
    marginLeft: '14%'
  },
  footer: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: '#CED0CE'
  },
  headerImage: {
    marginLeft: Platform.OS === 'android' ? 50 : 0,
    marginTop: 5,
    height: 40,
    resizeMode: 'contain',
    alignSelf: 'center'
  }
});
