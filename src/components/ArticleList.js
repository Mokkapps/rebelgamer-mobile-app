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
import debounce from 'debounce';
import { NavigationState } from 'react-navigation';

import ArticleListItem from './../components/ArticleListItem';
import HeaderImage from './../components/HeaderImage';
import hasInternetConnection from '../utils/connection-checker';
import Post from './../wp-types';
import { REBELGAMER_RED, STORAGE_KEY } from '../constants';
import translate from '../utils/translate';

type Props = {
  navigation: NavigationState
};

type State = {
  isLoadingMoreArticles: boolean,
  page: number,
  posts: typeof Post[],
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
    marginTop: 10
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
    backgroundColor: REBELGAMER_RED
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
      headerRight: <Icon iconStyle={styles.headerRightButton} name="info-outline" onPress={() => navigate('About')} />
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

    this.onSearchTextChange = debounce(this.handleSearchOnChange.bind(this), 500);
  }

  componentDidMount() {
    this.loadPosts();
  }

  componentWillUnmount() {
    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }
  }

  getStoredPosts = async (): Promise<typeof Post[]> => {
    const storedPosts = await AsyncStorage.getItem(STORAGE_KEY);
    return Promise.resolve(storedPosts ? JSON.parse(storedPosts) : []);
  };

  getPost$ = (page: number, search: string): Observable<typeof Post[]> => {
    const request = fetch(
      `${WP_BASE_URL}posts?_embed=true&page=${page}&per_page=${POSTS_PER_PAGE}&search=${search}`
    ).then(response => response.json());

    return Observable.from(request);
  };

  getStoredArticles = async (): Promise<typeof Post[]> => {
    // eslint-disable-next-line react/no-string-refs
    this.refs.toast.show(translate('LOAD_STORED_ARTICLES'), 5000);
    return this.getStoredPosts();
  };

  postsSubscription: Subscription;

  loadPosts = async (): void => {
    if (!(await hasInternetConnection())) {
      const storedPosts = await this.getStoredArticles();
      if (storedPosts) {
        this.setState({
          posts: [...this.state.posts, ...storedPosts],
          isLoadingMoreArticles: false,
          isRefreshing: false
        });
      }
      return Promise.resolve();
    }

    const { page } = this.state;
    this.clearListIfNecessary();

    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }
    this.postsSubscription = this.getPost$(page, this.state.query).subscribe(
      (posts: typeof Post[]) => {
        this.handleFetchedPosts(posts);
      },
      error => {
        this.setState({ isLoadingMoreArticles: false, isRefreshing: false });
        this.showAlert(error);
      }
    );

    return Promise.resolve();
  };

  clearListIfNecessary = (): void => {
    if ((this.state.query && this.state.page === 1) || this.state.isRefreshing) {
      this.setState({ posts: [], page: 1 });
    }
  };

  handleFetchedPosts = async (posts: typeof Post[]): void => {
    this.setState({
      posts: [...this.state.posts, ...posts],
      isLoadingMoreArticles: false,
      isRefreshing: false
    });

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.state.posts));
  };

  showAlert = (error: string): void => {
    Alert.alert(
      translate('ALERT_TITLE'),
      `${translate('ALERT_MESSAGE')} ${error}`,
      [
        {
          text: translate('OK'),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        }
      ],
      { cancelable: false }
    );
    console.error(error);
  };

  handleRefresh = async (): void => {
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
    <SearchBar lightTheme onChangeText={this.onSearchTextChange} placeholder={translate('PLACEHOLDER_SEARCH_BAR')} />
  );

  renderFooter = () => {
    if (!this.state.isLoadingMoreArticles && this.state.posts.length > 0) {
      return (
        <View>
          <View style={styles.separator} />
          <Button
            style={styles.loadMoreButton}
            title={translate('LOAD_MORE_ARTICLES')}
            color={REBELGAMER_RED}
            onPress={this.loadMoreArticles}
          />
        </View>
      );
    }

    if (this.state.isRefreshing) {
      return null;
    }

    return (
      <View style={styles.footer}>
        <ActivityIndicator color={REBELGAMER_RED} animating size="large" />
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
