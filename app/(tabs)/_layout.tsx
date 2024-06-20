import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const iconSize = 24;
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        /*headerStyle : {
          backgroundColor: '#8EACBD'
        },*/
        headerTitleAlign: 'center', // Center aligns the header title
      }}>
      <Tabs.Screen
        name="ranking"
        options={{
          headerShown: true,
          headerTitle: '랭킹',
          title: 'Ranking',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={focused ? 'medal' : 'medal-outline'} size={iconSize} color={color}/>
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} size={iconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          headerShown: false,
          title: 'Statistics',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'stats-chart' : 'stats-chart-outline'} size={iconSize} color={color}/>
          ),
        }}
      />
      <Tabs.Screen
        name="experimental"
        options={{
          title: 'Experimental',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'flask' : 'flask-outline'} size={iconSize} color={color}/>
          ),
        }}
      />
    </Tabs>
  );
}
