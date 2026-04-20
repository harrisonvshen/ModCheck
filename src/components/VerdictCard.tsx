import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { VerdictResult } from '../types';

const VERDICT_COLORS = {
  green: '#4ade80',
  yellow: '#facc15',
  red: '#f87171',
};

const VERDICT_LABELS = {
  green: 'LEGAL',
  yellow: 'BORDERLINE',
  red: 'ILLEGAL',
};

interface Props {
  result: VerdictResult;
}

export default function VerdictCard({ result }: Props) {
  const color = VERDICT_COLORS[result.verdict];

  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={styles.header}>
        <Text style={styles.field}>{formatField(result.field)}</Text>
        <Text style={[styles.badge, { backgroundColor: color }]}>
          {VERDICT_LABELS[result.verdict]}
        </Text>
      </View>
      <Text style={styles.explanation}>{result.explanation}</Text>
    </View>
  );
}

function formatField(field: string): string {
  switch (field) {
    // Tint
    case 'front_side_vlt': return 'Front Side Windows';
    case 'rear_side_vlt': return 'Rear Side Windows';
    case 'rear_window_vlt': return 'Rear Window';
    // Exhaust
    case 'muffler': return 'Muffler';
    case 'catalytic_converter': return 'Catalytic Converter';
    case 'straight_pipe': return 'Straight Pipe';
    case 'decibels': return 'Noise Level';
    // Suspension
    case 'suspension_type': return 'Suspension';
    case 'lift_height': return 'Lift Height';
    case 'bumper_front': return 'Front Bumper Height';
    case 'bumper_rear': return 'Rear Bumper Height';
    case 'lowered': return 'Lowered Vehicle';
    default: return field.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    borderLeftWidth: 4,
    padding: 14,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  field: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  badge: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0f0f0f',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    overflow: 'hidden',
  },
  explanation: {
    fontSize: 13,
    color: '#bbbbbb',
    lineHeight: 19,
  },
});
