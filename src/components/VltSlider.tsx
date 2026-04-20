import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
} from 'react-native';

interface Props {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
}

export default function VltSlider({ label, value, onValueChange }: Props) {
  const clamp = (v: number) => Math.max(0, Math.min(100, v));

  const getColor = (vlt: number): string => {
    if (vlt >= 70) return '#4ade80'; // light tint — green
    if (vlt >= 35) return '#facc15'; // medium — yellow
    return '#f87171'; // dark tint — red
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.valueRow}>
          <TextInput
            style={[styles.valueInput, { color: getColor(value) }]}
            keyboardType="number-pad"
            maxLength={3}
            value={String(value)}
            onChangeText={(text) => {
              const parsed = parseInt(text, 10);
              if (!isNaN(parsed)) {
                onValueChange(clamp(parsed));
              } else if (text === '') {
                onValueChange(0);
              }
            }}
          />
          <Text style={styles.unit}>% VLT</Text>
        </View>
      </View>

      {/* Slider track */}
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {
              width: `${value}%`,
              backgroundColor: getColor(value),
            },
          ]}
        />
      </View>

      {/* Tap targets for quick adjust */}
      <View style={styles.quickButtons}>
        {[5, 15, 20, 35, 50, 70].map((preset) => (
          <Text
            key={preset}
            style={[
              styles.preset,
              value === preset && styles.presetActive,
            ]}
            onPress={() => onValueChange(preset)}
          >
            {preset}%
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#cccccc',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueInput: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'right',
    minWidth: 40,
    padding: 0,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' as any } : {}),
  },
  unit: {
    fontSize: 13,
    color: '#777777',
    marginLeft: 4,
  },
  track: {
    height: 8,
    backgroundColor: '#2a2a2a',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  quickButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  preset: {
    fontSize: 13,
    color: '#666666',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  presetActive: {
    color: '#ffffff',
    backgroundColor: '#333333',
  },
});
