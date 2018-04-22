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
import 'rxjs/add/observable/from';
import { Observable } from 'rxjs/Observable';

import ArticleListItem from './../components/ArticleListItem';
import Constants from './../constants';
import HeaderImage from './../components/HeaderImage';
import NetInfoUtils from './../utils/NetInfoUtils';
import Post from './../types';
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

const WP_BASE_URL = 'https://www.rebelgamer.de/wp-json/wp/v2/';
const POSTS_PER_PAGE = 5;
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

class ArticleList extends React.Component<Props, State> {

  static navigationOptions = ({ navigation }) => {
    const { navigate } = navigation;

    return {
      headerTitle: <HeaderImage style={styles.headerImage} />,
      headerTitleStyle: { alignSelf: 'center', textAlign: 'center' },
      headerRight: (
        <Icon
          iconStyle={{ marginRight: 10 }}
          name="info-outline"
          onPress={() => navigate('About')}
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
      this.handleSearchOnChange.bind(this),
      500
    );
  }

  componentDidMount() {
    this.loadPosts();
  }

  onSearchTextDelayed: Function;

  async getStoredPosts(): Promise<Post[]> {
    let storedPosts: string = '';
    try {
      storedPosts = await AsyncStorage.getItem(Constants.StorageKey);
    } catch (error) {
      console.error(error);
    }

    return Promise.resolve(storedPosts ? JSON.parse(storedPosts) : []);
  }

  getPost$(page: number, search: string): Observable<Post[]> {
    const request = fetch(
      `${WP_BASE_URL}posts?_embed=true&page=${page}&per_page=${POSTS_PER_PAGE}&search=${search}`
    ).then(response => response.json());

    return Observable.from(request);
  }

  getStoredArticles = async () => {
    // eslint-disable-next-line react/no-string-refs
    this.refs.toast.show(Translate.translate('loadStoredArticles'), 5000);
    return this.getStoredPosts();
  }

  postsSubscription: Subscription;

  loadPosts = async () => {
    this.setState({ loading: true });

    const hasInternetConnection = await NetInfoUtils.hasInternetConnection();
    if (!hasInternetConnection) {
      const storedPosts = await this.loadStoredArticles();
      if (storedPosts) {
        this.setState({
          data: [...this.state.data, ...storedPosts],
          loading: false,
          refreshing: false
        });
      }
      return;
    }

    const { page } = this.state;
    this.clearListIfNecessary();

    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }
    this.postsSubscription = this.getPost$(
      page,
      this.state.searchText
    ).subscribe(
      (posts: Post[]) => {
        this.handleFetchedPosts(posts);
      },
      error => {
        console.error(error);
        this.setState({ loading: false, refreshing: false });
        this.showAlert(error);
      }
    );
  };

  clearListIfNecessary = () => {
    if (
      (this.state.searchText && this.state.page === 1) ||
      this.state.refreshing
    ) {
      this.setState({ data: [] });
    }
  }

  handleFetchedPosts = (posts: Post[]) => {
    this.setState({
      data: [...this.state.data, ...posts],
      loading: false,
      refreshing: false
    });

    AsyncStorage.setItem(
      Constants.StorageKey,
      JSON.stringify(this.state.data)
    );
  }

  showAlert = (error: string) => {
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

  handleRefresh = () => {
    this.setState(
      {
        refreshing: true,
        page: 1
      },
      () => {
        this.loadPosts();
      }
    );
  };

  handleLoadMore = () => {
    this.setState(
      {
        page: this.state.page + 1
      },
      () => {
        this.loadPosts();
      }
    );
  };

  handleSearchOnChange = (searchText: string) => {
    this.setState({ searchText });
    this.loadPosts();
  };

  renderSeparator = () => <View style={styles.separator} />;

  renderHeader = () => (
    <SearchBar
      lightTheme
      onChangeText={this.onSearchTextDelayed}
      placeholder={Translate.translate('placeHolderSearchBar')}
    />
  );

  renderFooter = () => {
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
              <ArticleListItem article={item} />
            </TouchableHighlight>
          )}
          keyExtractor={(item: Post) => item.id}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
          // Necessary to show footer on Android
          // eslint-disable-next-line react/jsx-no-bind
          ListFooterComponent={this.renderFooter.bind(this)}
          refreshing={this.state.refreshing}
          onRefresh={this.handleRefresh}
          onEndReached={this.handleLoadMore}
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

export default ArticleList;
