import { StackNavigator } from 'react-navigation';

import ArticleList from './src/components/ArticleList';
import ArticleDetails from './src/components/ArticleDetails';
import About from './src/components/About';

const App = StackNavigator({
  ArticleList: { screen: ArticleList },
  ArticleDetails: { screen: ArticleDetails },
  About: { screen: About }
});

export default App;
