import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';


import React, { useState, createContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './login';
import NotFoundScreen from './+not-found';
import Register from './register'; 
import TabLayout from './(tabs)/_layout';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const AuthContext = createContext();

const Stack = createStackNavigator();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const signIn = () => setIsLoggedIn(true);
  const signOut = () => setIsLoggedIn(false);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthContext.Provider value={{signIn, signOut}}>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>

      <NavigationContainer independent={true}>
        <Stack.Navigator>
          {isLoggedIn? ( 
            <> 
            <Stack.Screen name="(tabs)" component={TabLayout} options={{ headerShown: false }}/>
            </>
          ):(
            <>          
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
            <Stack.Screen name="Register" component={Register} options={{ headerShown: false }}/>
            </>
          )}
          <Stack.Screen name="+not-found" component= {NotFoundScreen} options={{ headerShown: false }}/>
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  </AuthContext.Provider>
  );
}
