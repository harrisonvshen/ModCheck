import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface StateMeta {
  name: string;
  abbreviation: string;
  inspection_required: boolean;
  emissions_required: boolean;
}

interface TintLawDetail {
  front_side_vlt: number | null;
  rear_side_vlt: number | null;
  rear_window_vlt: number | null;
  windshield_strip: string | null;
  reflective_allowed: boolean;
  medical_exemption: boolean;
  fine_first_offense: string | null;
  notes: string | null;
}

interface ExhaustLawDetail {
  max_decibels: number | null;
  muffler_required: boolean;
  cat_delete_legal: boolean;
  straight_pipe_legal: boolean;
  measurement_method: string | null;
  fine_first_offense: string | null;
  notes: string | null;
}

interface SuspensionLawDetail {
  max_lift_inches: number | null;
  max_bumper_height_front: number | null;
  max_bumper_height_rear: number | null;
  frame_height_limit: string | null;
  lowering_restrictions: string | null;
  fine_first_offense: string | null;
  notes: string | null;
}

interface Props {
  state: StateMeta;
  tint?: TintLawDetail | null;
  exhaust?: ExhaustLawDetail | null;
  suspension?: SuspensionLawDetail | null;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function Section({
  title,
  children,
  startExpanded = false,
}: {
  title: string;
  children: React.ReactNode;
  startExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(startExpanded);
  return (
    <View style={styles.section}>
      <Pressable onPress={() => setExpanded((v) => !v)} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.chevron}>{expanded ? '▾' : '▸'}</Text>
      </Pressable>
      {expanded && <View style={styles.sectionBody}>{children}</View>}
    </View>
  );
}

function formatVlt(v: number | null): string {
  return v === null ? 'No restriction' : `${v}% VLT minimum`;
}

export default function StateLawDetails({
  state,
  tint,
  exhaust,
  suspension,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Law Details for {state.name}</Text>

      <Section title="State Overview" startExpanded>
        <Row
          label="Annual inspection"
          value={state.inspection_required ? 'Required' : 'Not required'}
        />
        <Row
          label="Emissions testing"
          value={state.emissions_required ? 'Required' : 'Not required'}
        />
      </Section>

      {tint && (
        <Section title="Window Tint Law" startExpanded>
          <Row label="Front side windows" value={formatVlt(tint.front_side_vlt)} />
          <Row label="Rear side windows" value={formatVlt(tint.rear_side_vlt)} />
          <Row label="Rear window" value={formatVlt(tint.rear_window_vlt)} />
          {tint.windshield_strip && (
            <Row label="Windshield" value={tint.windshield_strip} />
          )}
          <Row
            label="Reflective tint"
            value={tint.reflective_allowed ? 'Allowed' : 'Not allowed'}
          />
          <Row
            label="Medical exemption"
            value={tint.medical_exemption ? 'Available' : 'Not available'}
          />
          {tint.fine_first_offense && (
            <Row label="First offense fine" value={tint.fine_first_offense} />
          )}
          {tint.notes && (
            <View style={styles.notesBlock}>
              <Text style={styles.notesLabel}>Notes</Text>
              <Text style={styles.notesText}>{tint.notes}</Text>
            </View>
          )}
        </Section>
      )}

      {exhaust && (
        <Section title="Exhaust Law">
          <Row
            label="Muffler"
            value={exhaust.muffler_required ? 'Required' : 'Not specifically required'}
          />
          <Row
            label="Cat delete"
            value={exhaust.cat_delete_legal ? 'Legal' : 'Illegal'}
          />
          <Row
            label="Straight pipe"
            value={exhaust.straight_pipe_legal ? 'Legal' : 'Illegal'}
          />
          <Row
            label="Max decibels"
            value={exhaust.max_decibels !== null ? `${exhaust.max_decibels} dB` : 'No specific limit'}
          />
          {exhaust.measurement_method && (
            <Row label="Measured" value={exhaust.measurement_method} />
          )}
          {exhaust.fine_first_offense && (
            <Row label="First offense fine" value={exhaust.fine_first_offense} />
          )}
          {exhaust.notes && (
            <View style={styles.notesBlock}>
              <Text style={styles.notesLabel}>Notes</Text>
              <Text style={styles.notesText}>{exhaust.notes}</Text>
            </View>
          )}
        </Section>
      )}

      {suspension && (
        <Section title="Suspension Law">
          <Row
            label="Max lift"
            value={suspension.max_lift_inches !== null
              ? `${suspension.max_lift_inches}"`
              : 'No specific limit'}
          />
          <Row
            label="Max front bumper height"
            value={suspension.max_bumper_height_front !== null
              ? `${suspension.max_bumper_height_front}"`
              : 'No specific limit'}
          />
          <Row
            label="Max rear bumper height"
            value={suspension.max_bumper_height_rear !== null
              ? `${suspension.max_bumper_height_rear}"`
              : 'No specific limit'}
          />
          {suspension.frame_height_limit && (
            <Row label="Frame height" value={suspension.frame_height_limit} />
          )}
          {suspension.lowering_restrictions && (
            <Row label="Lowering rules" value={suspension.lowering_restrictions} />
          )}
          {suspension.fine_first_offense && (
            <Row label="First offense fine" value={suspension.fine_first_offense} />
          )}
          {suspension.notes && (
            <View style={styles.notesBlock}>
              <Text style={styles.notesLabel}>Notes</Text>
              <Text style={styles.notesText}>{suspension.notes}</Text>
            </View>
          )}
        </Section>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },
  section: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    marginBottom: 10,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  chevron: {
    fontSize: 12,
    color: '#888888',
  },
  sectionBody: {
    paddingHorizontal: 14,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
    paddingTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 4,
    gap: 12,
  },
  rowLabel: {
    fontSize: 12,
    color: '#888888',
    flex: 1,
  },
  rowValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#dddddd',
    flex: 1.5,
    textAlign: 'right',
  },
  notesBlock: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  notesLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4ade80',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 12,
    color: '#bbbbbb',
    lineHeight: 18,
  },
});
