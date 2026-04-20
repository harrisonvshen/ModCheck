import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SuspensionDetails } from '../types';

interface Props {
  suspension: SuspensionDetails;
  onChange: (suspension: SuspensionDetails) => void;
}

const SUSPENSION_TYPES: { value: SuspensionDetails['type']; label: string }[] = [
  { value: 'stock', label: 'Stock' },
  { value: 'lift', label: 'Lifted' },
  { value: 'lowered', label: 'Lowered' },
];

export default function SuspensionForm({ suspension, onChange }: Props) {
  const isModified = suspension.type !== 'stock';

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Suspension</Text>

      {/* Type selector */}
      <Text style={styles.label}>Suspension Type</Text>
      <View style={styles.chipRow}>
        {SUSPENSION_TYPES.map((t) => {
          const selected = suspension.type === t.value;
          return (
            <Pressable
              key={t.value}
              style={[styles.chip, selected && styles.chipSelected]}
              onPress={() => {
                onChange({
                  ...suspension,
                  type: t.value,
                  inches: t.value === 'stock' ? 0 : suspension.inches,
                });
              }}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Inches, only show if lifted or lowered */}
      {isModified && (
        <>
          <Text style={styles.label}>
            {suspension.type === 'lift' ? 'Lift Height (inches)' : 'Lowered By (inches)'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 3"
            placeholderTextColor="#555"
            keyboardType="number-pad"
            maxLength={2}
            value={suspension.inches ? String(suspension.inches) : ''}
            onChangeText={(text) => {
              const parsed = parseInt(text, 10);
              onChange({
                ...suspension,
                inches: isNaN(parsed) ? 0 : parsed,
              });
            }}
          />
        </>
      )}

      {/* Bumper height, only show if lifted */}
      {suspension.type === 'lift' && (
        <>
          <Text style={styles.label}>Front Bumper Height (inches from ground, optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 24"
            placeholderTextColor="#555"
            keyboardType="number-pad"
            maxLength={2}
            value={
              suspension.bumper_height_front !== null
                ? String(suspension.bumper_height_front)
                : ''
            }
            onChangeText={(text) => {
              const parsed = parseInt(text, 10);
              onChange({
                ...suspension,
                bumper_height_front: isNaN(parsed) ? null : parsed,
              });
            }}
          />

          <Text style={styles.label}>Rear Bumper Height (inches from ground, optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 26"
            placeholderTextColor="#555"
            keyboardType="number-pad"
            maxLength={2}
            value={
              suspension.bumper_height_rear !== null
                ? String(suspension.bumper_height_rear)
                : ''
            }
            onChangeText={(text) => {
              const parsed = parseInt(text, 10);
              onChange({
                ...suspension,
                bumper_height_rear: isNaN(parsed) ? null : parsed,
              });
            }}
          />
        </>
      )}
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
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#aaaaaa',
    marginBottom: 6,
    marginTop: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  chipSelected: {
    backgroundColor: '#4ade80',
    borderColor: '#4ade80',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#cccccc',
  },
  chipTextSelected: {
    color: '#0f0f0f',
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
