import { StackNavigator } from 'react-navigation';

import ArticleList from './components/ArticleList';
import ArticleDetails from './components/ArticleDetails';
import About from './components/About';

const App = StackNavigator({
  ArticleList: { screen: ArticleList },
  ArticleDetails: { screen: ArticleDetails },
  About: { screen: About }
});

export default App;
