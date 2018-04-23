// @flow

import {
  ActivityIndicator,
  Alert,
  Button,
  AsyncStorage,
  FlatList,
  StyleSheet,
  TouchableHighlight,
  View
} from 'react-native';
import { Icon, SearchBar } from 'react-native-elements';
import React from 'react';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/from';
import Toast from 'react-native-easy-toast';
import type { NavigationState } from 'react-navigation/src/TypeDefinition';
import debounce from 'debounce';

import ArticleListItem from './../components/ArticleListItem';
import Constants from './../Constants';
import HeaderImage from './../components/HeaderImage';
import NetInfoUtils from './../utils/NetInfoUtils';
import Post from './../Types';
import Translate from './../utils/Translate';

type Props = {
  navigation: NavigationState
};

type State = {
  isLoadingMoreArticles: boolean,
  page: number,
  posts: Post[],
  isRefreshing: boolean,
  query: string
};

const WP_BASE_URL = 'https://www.rebelgamer.de/wp-json/wp/v2/';
const POSTS_PER_PAGE = 5;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#CED0CE',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
  },
  footer: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: '#CED0CE'
  },
  headerRightButton: {
    marginRight: 10
  },
  toast: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 30,
    backgroundColor: Constants.RebelGamerRed
  },
  loadMoreButton: {
    margin: 10
  }
});

class ArticleList extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }) => {
    const { navigate } = navigation;

    return {
      headerTitle: <HeaderImage />,
      headerRight: (
        <Icon
          iconStyle={styles.headerRightButton}
          name="info-outline"
          onPress={() => navigate('About')}
        />
      )
    };
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      isLoadingMoreArticles: false,
      page: 1,
      posts: [],
      isRefreshing: true,
      query: ''
    };

    this.onSearchTextChange = debounce(
      this.handleSearchOnChange.bind(this),
      500
    );
  }

  componentDidMount() {
    this.loadPosts();
  }

  componentWillUnmount() {
    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }
  }

  getStoredPosts = async (): Promise<Post[]> => {
    const storedPosts = await AsyncStorage.getItem(Constants.StorageKey);
    return Promise.resolve(storedPosts ? JSON.parse(storedPosts) : []);
  }

  getPost$ = (page: number, search: string): Observable<Post[]> => {
    const request = fetch(
      `${WP_BASE_URL}posts?_embed=true&page=${page}&per_page=${POSTS_PER_PAGE}&search=${search}`
    ).then(response => response.json());

    return Observable.from(request);
  }

  getStoredArticles = async (): Promise<Post[]> => {
    // eslint-disable-next-line react/no-string-refs
    this.refs.toast.show(Translate.translate('LOAD_STORED_ARTICLES'), 5000);
    return this.getStoredPosts();
  }

  postsSubscription: Subscription;

  loadPosts = async (): void => {
    const hasInternetConnection = await NetInfoUtils.hasInternetConnection();
    if (!hasInternetConnection) {
      const storedPosts = await this.getStoredArticles();
      if (storedPosts) {
        this.setState({
          posts: [...this.state.posts, ...storedPosts],
          isLoadingMoreArticles: false,
          isRefreshing: false
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
      this.state.query
    ).subscribe(
      (posts: Post[]) => {
        this.handleFetchedPosts(posts);
      },
      error => {
        this.setState({ isLoadingMoreArticles: false, isRefreshing: false });
        this.showAlert(error);
      }
    );
  };

  clearListIfNecessary = (): void => {
    if (
      (this.state.query && this.state.page === 1) ||
      this.state.isRefreshing
    ) {
      this.setState({ posts: [] });
    }
  }

  handleFetchedPosts = async (posts: Post[]): void => {
    this.setState({
      posts: [...this.state.posts, ...posts],
      isLoadingMoreArticles: false,
      isRefreshing: false
    });

    await AsyncStorage.setItem(
      Constants.StorageKey,
      JSON.stringify(this.state.posts)
    );
  }

  showAlert = (error: string): void => {
    Alert.alert(
      Translate.translate('ALERT_TITLE'),
      `${Translate.translate('ALERT_MESSAGE')} ${error}`,
      [
        {
          text: Translate.translate('OK'),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        }
      ],
      { cancelable: false }
    );
    console.error(error);
  };

  handleRefresh = (): void => {
    this.setState(
      {
        page: 1,
        isLoadingMoreArticles: false,
        isRefreshing: true
      },
      () => {
        this.loadPosts();
      }
    );
  };

  loadMoreArticles = (): void => {
    this.setState(
      {
        page: this.state.page + 1,
        isLoadingMoreArticles: true,
        isRefreshing: false
      },
      () => {
        this.loadPosts();
      }
    );
  };

  handleSearchOnChange = (query: string): void => {
    console.log('New search', query);
    this.setState(
      {
        query: query || '',
        isLoadingMoreArticles: false,
        isRefreshing: true
      },
      () => {
        this.loadPosts();
      }
    );
  };

  renderHeader = () => (
    <SearchBar
      lightTheme
      onChangeText={this.onSearchTextChange}
      onClearText={this.onSearchTextChange}
      placeholder={Translate.translate('PLACEHOLDER_SEARCH_BAR')}
      clearIcon={{ color: '#86939e', name: 'clear' }}
      value={this.state.query}
    />
  );

  renderFooter = () => {
    if (!this.state.isLoadingMoreArticles && this.state.posts.length > 0) {
      return (
        <View>
          <View style={styles.separator} />
          <Button
            style={styles.loadMoreButton}
            title={Translate.translate('LOAD_MORE_ARTICLES')}
            color={Constants.RebelGamerRed}
            onPress={this.loadMoreArticles}
          />
        </View>
      );
    }

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
          data={this.state.posts}
          renderItem={({ item }) => (
            <TouchableHighlight onPress={() => navigate('ArticleDetails', { article: item })}>
              <ArticleListItem article={item} />
            </TouchableHighlight>
          )}
          keyExtractor={(item: Post) => item.id.toString()}
          ListHeaderComponent={this.renderHeader}
          // Necessary to show footer on Android
          // eslint-disable-next-line react/jsx-no-bind
          ListFooterComponent={this.renderFooter.bind(this)}
          refreshing={this.state.isRefreshing}
          onRefresh={this.handleRefresh}
        />
        <Toast
          ref="toast" // eslint-disable-line react/no-string-refs
          style={styles.toast}
          textStyle={{ textAlign: 'center', color: 'white' }}
          position="bottom"
        />
      </View>
    );
  }
}

export default ArticleList;
