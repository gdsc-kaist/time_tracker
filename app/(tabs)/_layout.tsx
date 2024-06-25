import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TabBarIcon } from '../../components/navigation/TabBarIcon';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import RankingScreen from './ranking';
import HomeScreen from '.';
import StatScreen from './stats';

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const iconSize = 24;
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        initialRouteName='index'
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerStyle : {
            backgroundColor: Colors[colorScheme ?? 'light'].tint
          },
          tabBarStyle: {
            backgroundColor: Colors[colorScheme ?? 'light'].background,
          },
          headerTintColor : Colors[colorScheme ?? 'light'].text,
          headerTitleAlign: 'center', // Center aligns the header title
          headerShown: false,


        }}>
        <Tab.Screen
          name="ranking" component={RankingScreen}
          options={{
            headerShown: true,
            headerTitle: '랭킹',
            title: 'Ranking',
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons name={focused ? 'medal' : 'medal-outline'} size={iconSize} color={color}/>
            ),
          }}
        />
        <Tab.Screen
          name="index" component={HomeScreen}
          options={{
            headerShown: true,
            title: 'Home',
            headerShadowVisible: false,
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} size={iconSize} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="stats" component={StatScreen}
          options={{
            headerShown: true,
            headerTitle: '통계',
            title: 'Statistics',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'stats-chart' : 'stats-chart-outline'} size={iconSize} color={color}/>
            ),
          }}
        />
        {/* <Tab.Screen
          name="experimental" component={Experimental}
          options={{
            title: 'Experimental',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'flask' : 'flask-outline'} size={iconSize} color={color}/>
            ),
          }}
        /> */}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
