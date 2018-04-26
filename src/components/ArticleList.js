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
import Toast from 'react-native-easy-toast';
import debounce from 'debounce';
import { NavigationState } from 'react-navigation';

import ArticleListItem from './../components/ArticleListItem';
import HeaderImage from './../components/HeaderImage';
import hasInternetConnection from '../utils/connection-checker';
import Post from './../wp-types';
import { REBELGAMER_RED, STORAGE_KEY } from '../constants';
import translate from '../utils/translate';
import fetchPosts from '../utils/wp-connector';

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

  async componentDidMount() {
    await this.loadPosts();
  }

  getStoredPosts = async (): Promise<typeof Post[]> => {
    const storedPosts = await AsyncStorage.getItem(STORAGE_KEY);
    return Promise.resolve(storedPosts ? JSON.parse(storedPosts) : []);
  };

  getStoredArticles = async (): Promise<typeof Post[]> => {
    // eslint-disable-next-line react/no-string-refs
    this.refs.toast.show(translate('LOAD_STORED_ARTICLES'), 5000);
    return this.getStoredPosts();
  };

  loadPosts = (
    page: number = 1,
    isLoadingMoreArticles: boolean = false,
    isRefreshing: boolean = true,
    query: string = ''
  ) => {
    this.setState(
      {
        page,
        isLoadingMoreArticles,
        isRefreshing,
        query
      },
      () => {
        this._fetchPosts()
          .then(posts => this.handleFetchedPosts(posts))
          .catch(err => this.showAlert(err));
      }
    );
  };

  _fetchPosts = async (): Promise<Post[]> => {
    const hasConnection = await hasInternetConnection();
    if (!hasConnection) {
      const storedPosts = await this.getStoredArticles();
      return Promise.resolve(storedPosts);
    }

    const { query, page, isRefreshing } = this.state;

    // Clear list if necessary
    if ((query && page === 1) || isRefreshing) {
      this.setState({ posts: [], page: 1 });
    }

    return fetchPosts(page, query);
  };

  removeDuplicates = (myArr, prop) =>
    myArr.filter((obj, pos, arr) => arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos);

  handleFetchedPosts = (posts: typeof Post[]): void => {
    const newPosts = [...this.state.posts, ...posts];
    const newPostsSet = this.removeDuplicates(newPosts, 'id');

    this.setState({
      posts: newPostsSet,
      isLoadingMoreArticles: false,
      isRefreshing: false
    });

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.state.posts));
  };

  showAlert = (error: string): void => {
    Alert.alert(
      translate('ALERT_TITLE'),
      `${translate('ALERT_MESSAGE')} ${error}`,
      [
        {
          text: translate('OK'),
          style: 'cancel'
        }
      ],
      { cancelable: false }
    );
    console.error(error);
  };

  handleRefresh = (): void => {
    const { page, query } = this.state;
    this.loadPosts(page, false, true, query);
  };

  loadMoreArticles = (): void => {
    const { page, query } = this.state;
    this.loadPosts(page + 1, true, false, query);
  };

  handleSearchOnChange = (query: string): void => {
    const { page } = this.state;
    this.loadPosts(query ? page : 1, false, true, query);
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
