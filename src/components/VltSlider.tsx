import React from 'react';
import {
  Pressable,
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

const PRESETS = [5, 15, 20, 35, 50, 70] as const;

export default function VltSlider({ label, value, onValueChange }: Props) {
  const clamp = (v: number) => Math.max(0, Math.min(100, v));

  const getColor = (vlt: number): string => {
    if (vlt >= 70) return '#4ade80';
    if (vlt >= 35) return '#facc15';
    return '#f87171';
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

      {/* Slider track with fill */}
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
        {/* Tick marks at each preset position so users can see them on the bar */}
        {PRESETS.map((preset) => (
          <View
            key={preset}
            style={[styles.tick, { left: `${preset}%` }]}
          />
        ))}
      </View>

      {/* Preset buttons positioned at their actual VLT % on the scale */}
      <View style={styles.presetTrack}>
        {PRESETS.map((preset) => {
          const isActive = value === preset;
          return (
            <Pressable
              key={preset}
              onPress={() => onValueChange(preset)}
              style={[
                styles.preset,
                {
                  left: `${preset}%`,
                  // Pull each chip back by half its width so the center sits on the tick
                  ...(Platform.OS === 'web'
                    ? ({ transform: 'translateX(-50%)' } as any)
                    : { marginLeft: -16 }),
                },
                isActive && styles.presetActive,
              ]}
            >
              <Text
                style={[
                  styles.presetText,
                  isActive && styles.presetTextActive,
                ]}
              >
                {preset}%
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 28,
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
    height: 10,
    backgroundColor: '#2a2a2a',
    borderRadius: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  fill: {
    height: '100%',
    borderRadius: 5,
  },
  tick: {
    position: 'absolute',
    top: 1,
    bottom: 1,
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  presetTrack: {
    position: 'relative',
    height: 30,
    marginTop: 6,
  },
  preset: {
    position: 'absolute',
    top: 0,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 4,
    minWidth: 32,
    alignItems: 'center',
  },
  presetActive: {
    backgroundColor: '#333333',
  },
  presetText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
  },
  presetTextActive: {
    color: '#ffffff',
  },
});
