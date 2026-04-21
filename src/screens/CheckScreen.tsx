import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { useModProfile } from '../context/ModProfileContext';
import { checkTintLegality, TintLawRow } from '../utils/checkTint';
import { checkExhaustLegality, ExhaustLawRow } from '../utils/checkExhaust';
import { checkSuspensionLegality, SuspensionLawRow } from '../utils/checkSuspension';
import { VerdictResult, RootTabParamList } from '../types';
import VerdictCard from '../components/VerdictCard';

/**
 * Supabase returns the joined `states` field as either an object (one-to-one)
 * or an array. Normalize to an object for the check utilities.
 */
function normalizeStates(
  raw: unknown,
): { name: string; abbreviation: string } | null {
  if (!raw) return null;
  if (Array.isArray(raw)) return (raw[0] as { name: string; abbreviation: string }) ?? null;
  return raw as { name: string; abbreviation: string };
}

interface StateOption {
  id: string;
  name: string;
  abbreviation: string;
}

type CheckRoute = RouteProp<RootTabParamList, 'Check'>;

export default function CheckScreen() {
  const route = useRoute<CheckRoute>();
  const { profile } = useModProfile();
  const [states, setStates] = useState<StateOption[]>([]);
  const [selectedState, setSelectedState] = useState<StateOption | null>(null);
  const [results, setResults] = useState<VerdictResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statesLoading, setStatesLoading] = useState(true);
  const didAutoCheck = useRef<string | null>(null);

  // Fetch state list on mount
  useEffect(() => {
    (async () => {
      const { data, error: err } = await supabase
        .from('states')
        .select('id, name, abbreviation')
        .order('name');
      if (err) {
        setError('Failed to load states: ' + err.message);
      } else {
        setStates(data ?? []);
      }
      setStatesLoading(false);
    })();
  }, []);

  // Auto-check when navigated from Home with a stateId param
  useEffect(() => {
    const stateId = route.params?.stateId;
    if (!stateId || states.length === 0) return;
    if (didAutoCheck.current === stateId) return;

    const match = states.find((s) => s.id === stateId);
    if (match) {
      didAutoCheck.current = stateId;
      handleCheck(match);
    }
  }, [route.params?.stateId, states]);

  const handleCheck = async (state: StateOption) => {
    setSelectedState(state);
    setLoading(true);
    setError(null);
    setResults([]);

    const allVerdicts: VerdictResult[] = [];

    // 1. Tint check
    const { data: tintData } = await supabase
      .from('tint_laws')
      .select(`
        front_side_vlt, rear_side_vlt, rear_window_vlt,
        windshield_strip, fine_first_offense, notes,
        states ( name, abbreviation )
      `)
      .eq('state_id', state.id)
      .single();

    if (tintData) {
      const states = normalizeStates(tintData.states);
      if (states) {
        const law: TintLawRow = { ...tintData, states };
        allVerdicts.push(...checkTintLegality(profile.tint, law));
      }
    }

    // 2. Exhaust check (only if not stock)
    if (profile.exhaust.type !== 'stock') {
      const { data: exhaustData } = await supabase
        .from('exhaust_laws')
        .select(`
          max_decibels, muffler_required, cat_delete_legal,
          straight_pipe_legal, fine_first_offense, notes,
          states ( name, abbreviation )
        `)
        .eq('state_id', state.id)
        .single();

      if (exhaustData) {
        const states = normalizeStates(exhaustData.states);
        if (states) {
          const law: ExhaustLawRow = { ...exhaustData, states };
          allVerdicts.push(...checkExhaustLegality(profile.exhaust, law));
        }
      }
    }

    // 3. Suspension check (only if not stock)
    if (profile.suspension.type !== 'stock') {
      const { data: suspData } = await supabase
        .from('suspension_laws')
        .select(`
          max_lift_inches, max_bumper_height_front, max_bumper_height_rear,
          frame_height_limit, lowering_restrictions, fine_first_offense, notes,
          states ( name, abbreviation )
        `)
        .eq('state_id', state.id)
        .single();

      if (suspData) {
        const states = normalizeStates(suspData.states);
        if (states) {
          const law: SuspensionLawRow = { ...suspData, states };
          allVerdicts.push(...checkSuspensionLegality(profile.suspension, law));
        }
      }
    }

    if (allVerdicts.length === 0) {
      setError('No law data found for ' + state.name);
    } else {
      setResults(allVerdicts);
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Legality Check</Text>

      {/* Mod summary */}
      <View style={styles.modSummary}>
        <Text style={styles.modSummaryTitle}>Your Mods</Text>
        <Text style={styles.modSummaryLine}>
          Tint — Front {profile.tint.front_side_vlt}% · Rear sides{' '}
          {profile.tint.rear_side_vlt}% · Rear {profile.tint.rear_window_vlt}%
        </Text>
        {profile.exhaust.type !== 'stock' && (
          <Text style={styles.modSummaryLine}>
            Exhaust — {profile.exhaust.type}
            {profile.exhaust.estimated_decibels
              ? ` (${profile.exhaust.estimated_decibels} dB)`
              : ''}
          </Text>
        )}
        {profile.suspension.type !== 'stock' && (
          <Text style={styles.modSummaryLine}>
            Suspension — {profile.suspension.type} {profile.suspension.inches}"
          </Text>
        )}
      </View>

      {/* State selector */}
      <Text style={styles.sectionTitle}>Select a State</Text>

      {statesLoading ? (
        <ActivityIndicator color="#4ade80" style={{ marginTop: 16 }} />
      ) : error && states.length === 0 ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <View style={styles.stateGrid}>
          {states.map((s) => {
            const isSelected = selectedState?.id === s.id;
            return (
              <Pressable
                key={s.id}
                style={[styles.stateChip, isSelected && styles.stateChipSelected]}
                onPress={() => handleCheck(s)}
              >
                <Text
                  style={[
                    styles.stateChipText,
                    isSelected && styles.stateChipTextSelected,
                  ]}
                >
                  {s.abbreviation}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {/* Results */}
      {loading && (
        <ActivityIndicator color="#4ade80" style={{ marginTop: 24 }} />
      )}

      {error && results.length === 0 && states.length > 0 && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {results.length > 0 && selectedState && (
        <View style={styles.resultsSection}>
          <Text style={styles.resultsTitle}>
            Results for {selectedState.name}
          </Text>

          {/* Group by category */}
          {['tint', 'exhaust', 'suspension'].map((cat) => {
            const catResults = results.filter((r) => r.category === cat);
            if (catResults.length === 0) return null;
            return (
              <View key={cat}>
                <Text style={styles.categoryLabel}>
                  {cat === 'tint' ? 'Window Tint' : cat === 'exhaust' ? 'Exhaust' : 'Suspension'}
                </Text>
                {catResults.map((r) => (
                  <VerdictCard key={`${r.category}-${r.field}`} result={r} />
                ))}
              </View>
            );
          })}
        </View>
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
    padding: 24,
    paddingBottom: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  modSummary: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333333',
  },
  modSummaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4ade80',
    marginBottom: 6,
  },
  modSummaryLine: {
    fontSize: 13,
    color: '#cccccc',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  stateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  stateChip: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    minWidth: 56,
    alignItems: 'center',
  },
  stateChipSelected: {
    backgroundColor: '#4ade80',
    borderColor: '#4ade80',
  },
  stateChipText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#cccccc',
  },
  stateChipTextSelected: {
    color: '#0f0f0f',
  },
  errorText: {
    fontSize: 14,
    color: '#f87171',
    marginTop: 16,
  },
  resultsSection: {
    marginTop: 24,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 8,
  },
});
