import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './src/navigation/TabNavigator';
import { ModProfileProvider } from './src/context/ModProfileContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import AuthScreen from './src/screens/AuthScreen';

function AppGate() {
  const { session, isGuest, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#4ade80" size="large" />
      </View>
    );
  }

  if (!session && !isGuest) {
    return <AuthScreen />;
  }

  return (
    <ModProfileProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <TabNavigator />
      </NavigationContainer>
    </ModProfileProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppGate />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
