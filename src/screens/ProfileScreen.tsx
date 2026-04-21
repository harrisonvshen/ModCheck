import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import VehicleForm from '../components/VehicleForm';
import TintForm from '../components/TintForm';
import ExhaustForm from '../components/ExhaustForm';
import SuspensionForm from '../components/SuspensionForm';
import { useModProfile } from '../context/ModProfileContext';
import { useAuth } from '../context/AuthContext';
import { RootTabParamList } from '../types';

type Nav = BottomTabNavigationProp<RootTabParamList, 'Profile'>;

export default function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const { profile, setVehicle, setTint, setExhaust, setSuspension } = useModProfile();
  const { user, isGuest, signOut } = useAuth();
  const { vehicle, tint, exhaust, suspension } = profile;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>My Profile</Text>
        <View style={styles.autoSaveBadge}>
          <Text style={styles.autoSaveText}>✓ Auto-saved</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>
        Your mods save automatically to this device as you type.
      </Text>

      <VehicleForm vehicle={vehicle} onChange={setVehicle} />
      <TintForm tint={tint} onChange={setTint} />
      <ExhaustForm exhaust={exhaust} onChange={setExhaust} />
      <SuspensionForm suspension={suspension} onChange={setSuspension} />

      <Pressable
        style={styles.primaryButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.primaryButtonText}>See My Verdicts →</Text>
      </Pressable>

      {/* Account section */}
      <View style={styles.accountSection}>
        <View style={{ flex: 1 }}>
          <Text style={styles.accountEmail}>
            {isGuest ? 'Browsing as Guest' : user?.email}
          </Text>
          {isGuest && (
            <Text style={styles.accountSubtext}>
              Your mods are saved to this device only.
            </Text>
          )}
        </View>
        <Pressable
          style={isGuest ? styles.signInButton : styles.signOutButton}
          onPress={signOut}
        >
          <Text style={isGuest ? styles.signInText : styles.signOutText}>
            {isGuest ? 'Sign In' : 'Sign Out'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 13,
    color: '#777777',
    marginTop: 4,
    marginBottom: 20,
  },
  autoSaveBadge: {
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    borderWidth: 1,
    borderColor: '#4ade80',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  autoSaveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4ade80',
  },
  primaryButton: {
    backgroundColor: '#4ade80',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f0f0f',
  },
  accountSection: {
    marginTop: 32,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#333333',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountEmail: {
    fontSize: 13,
    color: '#aaaaaa',
    fontWeight: '600',
  },
  accountSubtext: {
    fontSize: 11,
    color: '#666666',
    marginTop: 2,
  },
  signOutButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#f87171',
  },
  signOutText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#f87171',
  },
  signInButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#4ade80',
  },
  signInText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f0f0f',
  },
});
