import 'react-native-gesture-handler';
import { Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import React, { useEffect, useState } from 'react';
import { OverflowMenuProvider } from 'react-navigation-header-buttons';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import LatestArticles from './screens/LatestArticles';
import { InternetContext } from './context/InternetContext';
import About from './screens/About';
import ArticleDetails from './screens/ArticleDetails';
import ArticleSearch from './screens/ArticleSearch';

const App = () => {
  const [probablyHasInternet, setProbablyHasInternet] = useState(true);

  useEffect(() => {
    let initialNetworkState = false;
    const unsubscribe = NetInfo.addEventListener(state => {
      if (Platform.OS === 'ios' && !initialNetworkState) {
        initialNetworkState = true;
        return;
      }
      setProbablyHasInternet(state.isConnected && state.isInternetReachable);
    });

    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  const screens = {
    LatestArticles,
    ArticleDetails,
    ArticleSearch,
    About,
  };

  const Stack = createStackNavigator();

  const Body = () => {
    return (
      <InternetContext.Provider value={{ probablyHasInternet }}>
        <Stack.Navigator initialRouteName="LatestArticles">
          {Object.keys(screens).map(screenName => {
            return (
              <Stack.Screen
                name={screenName}
                key={screenName}
                component={screens[screenName]}
              />
            );
          })}
        </Stack.Navigator>
      </InternetContext.Provider>
    );
  };

  return (
    <NavigationContainer>
      <OverflowMenuProvider>
        <Body />
      </OverflowMenuProvider>
    </NavigationContainer>
  );
};

export default App;
