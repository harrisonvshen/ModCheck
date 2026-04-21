import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TintDetails } from '../types';
import VltSlider from './VltSlider';
import VltVisual from './VltVisual';

interface Props {
  tint: TintDetails;
  onChange: (tint: TintDetails) => void;
}

export default function TintForm({ tint, onChange }: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Window Tint</Text>
      <Text style={styles.hint}>
        Set the VLT% (Visible Light Transmission) for each window position.
        Lower % = darker tint.
      </Text>

      <VltVisual currentVlt={tint.front_side_vlt} />

      <VltSlider
        label="Front Side Windows"
        value={tint.front_side_vlt}
        onValueChange={(v) => onChange({ ...tint, front_side_vlt: v })}
      />

      <VltSlider
        label="Rear Side Windows"
        value={tint.rear_side_vlt}
        onValueChange={(v) => onChange({ ...tint, rear_side_vlt: v })}
      />

      <VltSlider
        label="Rear Window"
        value={tint.rear_window_vlt}
        onValueChange={(v) => onChange({ ...tint, rear_window_vlt: v })}
      />

      <VltSlider
        label="Windshield Strip"
        value={tint.windshield_strip === 'none' ? 100 : parseInt(tint.windshield_strip, 10) || 100}
        onValueChange={(v) =>
          onChange({ ...tint, windshield_strip: v === 100 ? 'none' : String(v) })
        }
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
    marginBottom: 16,
    lineHeight: 18,
  },
});
