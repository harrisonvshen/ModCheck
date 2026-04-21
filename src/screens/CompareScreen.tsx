import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { useModProfile } from '../context/ModProfileContext';
import { useStateCheck } from '../hooks/useStateCheck';
import { Verdict, VerdictResult } from '../types';

interface StateOption {
  id: string;
  name: string;
  abbreviation: string;
}

const VERDICT_COLORS: Record<Verdict, string> = {
  green: '#4ade80',
  yellow: '#facc15',
  red: '#f87171',
};

function worstOf(verdicts: VerdictResult[]): Verdict {
  let worst: Verdict = 'green';
  for (const v of verdicts) {
    if (v.verdict === 'red') return 'red';
    if (v.verdict === 'yellow') worst = 'yellow';
  }
  return worst;
}

function countBy(verdicts: VerdictResult[], v: Verdict): number {
  return verdicts.filter((r) => r.verdict === v).length;
}

function StatePicker({
  states,
  selected,
  otherSelected,
  onSelect,
  label,
}: {
  states: StateOption[];
  selected: StateOption | null;
  otherSelected: StateOption | null;
  onSelect: (s: StateOption) => void;
  label: string;
}) {
  return (
    <View style={styles.pickerBox}>
      <Text style={styles.pickerLabel}>{label}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pickerScroll}
      >
        {states.map((s) => {
          const isSelected = selected?.id === s.id;
          const isDisabled = otherSelected?.id === s.id;
          return (
            <Pressable
              key={s.id}
              disabled={isDisabled}
              onPress={() => onSelect(s)}
              style={[
                styles.pickerChip,
                isSelected && styles.pickerChipSelected,
                isDisabled && styles.pickerChipDisabled,
              ]}
            >
              <Text
                style={[
                  styles.pickerChipText,
                  isSelected && styles.pickerChipTextSelected,
                  isDisabled && styles.pickerChipTextDisabled,
                ]}
              >
                {s.abbreviation}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

function StateColumn({
  state,
  verdicts,
  loading,
}: {
  state: StateOption | null;
  verdicts: VerdictResult[];
  loading: boolean;
}) {
  if (!state) {
    return (
      <View style={styles.column}>
        <Text style={styles.columnPlaceholder}>Pick a state</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.column}>
        <Text style={styles.columnTitle}>{state.name}</Text>
        <ActivityIndicator color="#4ade80" style={{ marginTop: 24 }} />
      </View>
    );
  }

  const worst = worstOf(verdicts);
  const greens = countBy(verdicts, 'green');
  const yellows = countBy(verdicts, 'yellow');
  const reds = countBy(verdicts, 'red');

  return (
    <View style={[styles.column, { borderColor: VERDICT_COLORS[worst] }]}>
      <Text style={styles.columnTitle}>{state.name}</Text>
      <Text style={styles.columnAbbr}>{state.abbreviation}</Text>

      {/* Overall verdict badge */}
      <View
        style={[
          styles.verdictBadge,
          { backgroundColor: VERDICT_COLORS[worst] },
        ]}
      >
        <Text style={styles.verdictBadgeText}>
          {worst === 'green'
            ? 'LEGAL'
            : worst === 'yellow'
            ? 'BORDERLINE'
            : 'ILLEGAL'}
        </Text>
      </View>

      {/* Counts */}
      <View style={styles.countsRow}>
        <Text style={[styles.countText, { color: VERDICT_COLORS.green }]}>
          {greens} legal
        </Text>
        <Text style={[styles.countText, { color: VERDICT_COLORS.yellow }]}>
          {yellows} borderline
        </Text>
        <Text style={[styles.countText, { color: VERDICT_COLORS.red }]}>
          {reds} illegal
        </Text>
      </View>

      {/* Each verdict as a compact line */}
      <View style={styles.verdictList}>
        {verdicts.map((v) => (
          <View key={`${v.category}-${v.field}`} style={styles.verdictLine}>
            <View
              style={[
                styles.verdictDot,
                { backgroundColor: VERDICT_COLORS[v.verdict] },
              ]}
            />
            <Text style={styles.verdictLineText} numberOfLines={2}>
              {v.explanation}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function CompareScreen() {
  const { profile } = useModProfile();
  const [states, setStates] = useState<StateOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stateA, setStateA] = useState<StateOption | null>(null);
  const [stateB, setStateB] = useState<StateOption | null>(null);

  // Fetch state list on mount
  useEffect(() => {
    (async () => {
      const { data, error: err } = await supabase
        .from('states')
        .select('id, name, abbreviation')
        .order('name');
      if (err) {
        setError(err.message);
      } else {
        setStates(data ?? []);
      }
      setLoading(false);
    })();
  }, []);

  const mods = {
    tint: profile.tint,
    exhaust: profile.exhaust,
    suspension: profile.suspension,
  };

  const checkA = useStateCheck(stateA?.id ?? null, mods);
  const checkB = useStateCheck(stateB?.id ?? null, mods);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Compare States</Text>
      <Text style={styles.subtitle}>
        Pick two states to see your mod legality side by side. Useful for road trips or moving.
      </Text>

      {loading ? (
        <ActivityIndicator color="#4ade80" style={{ marginTop: 40 }} />
      ) : error ? (
        <Text style={styles.error}>Failed to load states: {error}</Text>
      ) : (
        <>
          <StatePicker
            label="State 1"
            states={states}
            selected={stateA}
            otherSelected={stateB}
            onSelect={setStateA}
          />
          <StatePicker
            label="State 2"
            states={states}
            selected={stateB}
            otherSelected={stateA}
            onSelect={setStateB}
          />

          <View style={styles.columnsRow}>
            <StateColumn
              state={stateA}
              verdicts={checkA.result?.verdicts ?? []}
              loading={checkA.loading}
            />
            <StateColumn
              state={stateB}
              verdicts={checkB.result?.verdicts ?? []}
              loading={checkB.loading}
            />
          </View>
        </>
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
    padding: 20,
    paddingBottom: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#888888',
    marginBottom: 20,
    lineHeight: 19,
  },
  error: {
    fontSize: 14,
    color: '#f87171',
    marginTop: 20,
    textAlign: 'center',
  },
  pickerBox: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#aaaaaa',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  pickerScroll: {
    gap: 6,
    paddingRight: 20,
  },
  pickerChip: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 44,
    alignItems: 'center',
  },
  pickerChipSelected: {
    backgroundColor: '#4ade80',
    borderColor: '#4ade80',
  },
  pickerChipDisabled: {
    opacity: 0.3,
  },
  pickerChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#cccccc',
  },
  pickerChipTextSelected: {
    color: '#0f0f0f',
  },
  pickerChipTextDisabled: {
    color: '#555555',
  },
  columnsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  column: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderWidth: 1.5,
    borderColor: '#333333',
    borderRadius: 10,
    padding: 12,
    minHeight: 160,
  },
  columnPlaceholder: {
    fontSize: 13,
    color: '#555555',
    textAlign: 'center',
    marginTop: 60,
    fontStyle: 'italic',
  },
  columnTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  columnAbbr: {
    fontSize: 11,
    color: '#888888',
    marginBottom: 10,
  },
  verdictBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 10,
  },
  verdictBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0f0f0f',
  },
  countsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
  },
  verdictList: {
    gap: 8,
  },
  verdictLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  verdictDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  verdictLineText: {
    flex: 1,
    fontSize: 11,
    color: '#cccccc',
    lineHeight: 15,
  },
});
