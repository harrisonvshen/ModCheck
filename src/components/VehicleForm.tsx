import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Vehicle } from '../types';
import { VEHICLE_PRESETS, VehiclePreset } from '../constants/vehiclePresets';

interface Props {
  vehicle: Omit<Vehicle, 'id'>;
  onChange: (vehicle: Omit<Vehicle, 'id'>) => void;
}

function matchesPreset(
  v: Omit<Vehicle, 'id'>,
  p: VehiclePreset,
): boolean {
  return (
    v.year === p.year &&
    v.make.trim().toLowerCase() === p.make.toLowerCase() &&
    v.model.trim().toLowerCase() === p.model.toLowerCase()
  );
}

export default function VehicleForm({ vehicle, onChange }: Props) {
  const [showPresets, setShowPresets] = useState(true);

  const applyPreset = (p: VehiclePreset) => {
    onChange({ ...vehicle, year: p.year, make: p.make, model: p.model });
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Vehicle (optional)</Text>
      <Text style={styles.hint}>
        Optional. A label so you remember which car this profile is for. Doesn't affect verdicts.
      </Text>

      {/* Preset picker */}
      <Pressable
        style={styles.presetsToggle}
        onPress={() => setShowPresets((v) => !v)}
      >
        <Text style={styles.presetsToggleText}>
          Quick pick from popular vehicles {showPresets ? '▾' : '▸'}
        </Text>
      </Pressable>

      {showPresets && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.presetRow}
          style={styles.presetScroll}
        >
          {VEHICLE_PRESETS.map((p) => {
            const isActive = matchesPreset(vehicle, p);
            return (
              <Pressable
                key={p.label}
                style={[styles.presetChip, isActive && styles.presetChipActive]}
                onPress={() => applyPreset(p)}
              >
                <Text
                  style={[
                    styles.presetChipText,
                    isActive && styles.presetChipTextActive,
                  ]}
                >
                  {p.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}

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
  presetsToggle: {
    paddingVertical: 8,
  },
  presetsToggleText: {
    fontSize: 13,
    color: '#4ade80',
    fontWeight: '600',
  },
  presetScroll: {
    marginBottom: 8,
  },
  presetRow: {
    gap: 6,
    paddingRight: 20,
    paddingVertical: 4,
  },
  presetChip: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  presetChipActive: {
    backgroundColor: '#4ade80',
    borderColor: '#4ade80',
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#cccccc',
  },
  presetChipTextActive: {
    color: '#0f0f0f',
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
