import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ExhaustDetails } from '../types';

interface Props {
  exhaust: ExhaustDetails;
  onChange: (exhaust: ExhaustDetails) => void;
}

const EXHAUST_TYPES: { value: ExhaustDetails['type']; label: string }[] = [
  { value: 'stock', label: 'Stock' },
  { value: 'cat-back', label: 'Cat-Back' },
  { value: 'axle-back', label: 'Axle-Back' },
  { value: 'straight-pipe', label: 'Straight Pipe' },
  { value: 'muffler-delete', label: 'Muffler Delete' },
];

export default function ExhaustForm({ exhaust, onChange }: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Exhaust</Text>

      {/* Type selector */}
      <Text style={styles.label}>Exhaust Type</Text>
      <View style={styles.chipRow}>
        {EXHAUST_TYPES.map((t) => {
          const selected = exhaust.type === t.value;
          return (
            <Pressable
              key={t.value}
              style={[styles.chip, selected && styles.chipSelected]}
              onPress={() => {
                const updates: Partial<ExhaustDetails> = { type: t.value };
                // Auto-set related booleans based on type
                if (t.value === 'stock') {
                  updates.catalytic_converter = true;
                  updates.muffler = true;
                } else if (t.value === 'straight-pipe') {
                  updates.muffler = false;
                } else if (t.value === 'muffler-delete') {
                  updates.muffler = false;
                }
                onChange({ ...exhaust, ...updates });
              }}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Decibel input */}
      <Text style={styles.label}>Estimated Decibels (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 95"
        placeholderTextColor="#555"
        keyboardType="number-pad"
        maxLength={3}
        value={exhaust.estimated_decibels !== null ? String(exhaust.estimated_decibels) : ''}
        onChangeText={(text) => {
          const parsed = parseInt(text, 10);
          onChange({
            ...exhaust,
            estimated_decibels: isNaN(parsed) ? null : parsed,
          });
        }}
      />

      {/* Toggle: Catalytic converter */}
      <Pressable
        style={styles.toggleRow}
        onPress={() =>
          onChange({ ...exhaust, catalytic_converter: !exhaust.catalytic_converter })
        }
      >
        <View
          style={[
            styles.toggleBox,
            exhaust.catalytic_converter && styles.toggleBoxOn,
          ]}
        >
          {exhaust.catalytic_converter && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.toggleLabel}>Catalytic converter installed</Text>
      </Pressable>

      {/* Toggle: Muffler */}
      <Pressable
        style={styles.toggleRow}
        onPress={() => onChange({ ...exhaust, muffler: !exhaust.muffler })}
      >
        <View
          style={[styles.toggleBox, exhaust.muffler && styles.toggleBoxOn]}
        >
          {exhaust.muffler && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.toggleLabel}>Muffler installed</Text>
      </Pressable>
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
    marginBottom: 8,
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
    paddingHorizontal: 12,
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
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  toggleBox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#555555',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  toggleBoxOn: {
    backgroundColor: '#4ade80',
    borderColor: '#4ade80',
  },
  checkmark: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f0f0f',
  },
  toggleLabel: {
    fontSize: 14,
    color: '#cccccc',
  },
});
