import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import CheckScreen from '../screens/CheckScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { RootTabParamList } from '../types';

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1a1a1a' },
        headerTintColor: '#ffffff',
        tabBarStyle: { backgroundColor: '#1a1a1a', borderTopColor: '#333333' },
        tabBarActiveTintColor: '#4ade80',
        tabBarInactiveTintColor: '#888888',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'ModCheck' }}
      />
      <Tab.Screen
        name="Check"
        component={CheckScreen}
        options={{ title: 'Check' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
