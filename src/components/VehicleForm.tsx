import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Vehicle } from '../types';

interface Props {
  vehicle: Omit<Vehicle, 'id'>;
  onChange: (vehicle: Omit<Vehicle, 'id'>) => void;
}

export default function VehicleForm({ vehicle, onChange }: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Vehicle (optional)</Text>
      <Text style={styles.hint}>
        For your own reference, labels this profile. Not used in legality checks yet.
      </Text>

      <Text style={styles.label}>Year</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 2024"
        placeholderTextColor="#555"
        keyboardType="number-pad"
        maxLength={4}
        value={vehicle.year ? String(vehicle.year) : ''}
        onChangeText={(text) => {
          const year = parseInt(text, 10);
          onChange({ ...vehicle, year: isNaN(year) ? 0 : year });
        }}
      />

      <Text style={styles.label}>Make</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Toyota"
        placeholderTextColor="#555"
        autoCapitalize="words"
        value={vehicle.make}
        onChangeText={(make) => onChange({ ...vehicle, make })}
      />

      <Text style={styles.label}>Model</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Corolla"
        placeholderTextColor="#555"
        autoCapitalize="words"
        value={vehicle.model}
        onChangeText={(model) => onChange({ ...vehicle, model })}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  hint: {
    fontSize: 13,
    color: '#777777',
    marginBottom: 12,
    lineHeight: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#aaaaaa',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#ffffff',
  },
});
