import React from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import VehicleForm from '../components/VehicleForm';
import TintForm from '../components/TintForm';
import ExhaustForm from '../components/ExhaustForm';
import SuspensionForm from '../components/SuspensionForm';
import { useModProfile } from '../context/ModProfileContext';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { profile, setVehicle, setTint, setExhaust, setSuspension, markSaved } = useModProfile();
  const { user, isGuest, signOut } = useAuth();
  const { vehicle, tint, exhaust, suspension, saved } = profile;

  const isValid = vehicle.year >= 1900 && vehicle.make.trim() !== '' && vehicle.model.trim() !== '';

  const handleSave = () => {
    if (!isValid) {
      if (Platform.OS === 'web') {
        alert('Please fill in year, make, and model.');
      } else {
        Alert.alert('Missing Info', 'Please fill in year, make, and model.');
      }
      return;
    }
    markSaved();
    if (Platform.OS === 'web') {
      alert(`Saved: ${vehicle.year} ${vehicle.make} ${vehicle.model}`);
    } else {
      Alert.alert('Saved', `${vehicle.year} ${vehicle.make} ${vehicle.model}`);
    }
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.title}>My Profile</Text>

      <VehicleForm vehicle={vehicle} onChange={setVehicle} />
      <TintForm tint={tint} onChange={setTint} />
      <ExhaustForm exhaust={exhaust} onChange={setExhaust} />
      <SuspensionForm suspension={suspension} onChange={setSuspension} />

      <Pressable
        style={[styles.saveButton, !isValid && styles.saveButtonDisabled]}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>
          {saved ? 'Saved' : 'Save Profile'}
        </Text>
      </Pressable>

      {/* Account section */}
      <View style={styles.accountSection}>
        <Text style={styles.accountEmail}>
          {isGuest ? 'Guest Mode' : user?.email}
        </Text>
        <Pressable style={styles.signOutButton} onPress={signOut}>
          <Text style={styles.signOutText}>
            {isGuest ? 'Sign In' : 'Sign Out'}
          </Text>
        </Pressable>
      </View>

      {saved && (
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Current Setup</Text>
          <Text style={styles.summaryLine}>
            {vehicle.year} {vehicle.make} {vehicle.model}
          </Text>
          <Text style={styles.summaryLine}>
            Tint — Front: {tint.front_side_vlt}% · Rear sides: {tint.rear_side_vlt}% · Rear: {tint.rear_window_vlt}%
          </Text>
          <Text style={styles.summaryLine}>
            Exhaust — {exhaust.type}{exhaust.estimated_decibels ? ` (${exhaust.estimated_decibels} dB)` : ''} · Cat: {exhaust.catalytic_converter ? 'Yes' : 'No'} · Muffler: {exhaust.muffler ? 'Yes' : 'No'}
          </Text>
          <Text style={styles.summaryLine}>
            Suspension — {suspension.type === 'stock' ? 'Stock' : `${suspension.type} ${suspension.inches}"`}
          </Text>
        </View>
      )}
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: '#4ade80',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#333333',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f0f0f',
  },
  summary: {
    marginTop: 24,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4ade80',
    marginBottom: 8,
  },
  summaryLine: {
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 22,
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
    color: '#888888',
    flex: 1,
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
});
