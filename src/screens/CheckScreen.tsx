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
import StateLawDetails from '../components/StateLawDetails';

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
  inspection_required: boolean;
  emissions_required: boolean;
}

interface StateLawBundle {
  state: StateOption;
  tint: any;
  exhaust: any;
  suspension: any;
}

type CheckRoute = RouteProp<RootTabParamList, 'Check'>;

export default function CheckScreen() {
  const route = useRoute<CheckRoute>();
  const { profile, setHomeState } = useModProfile();
  const [states, setStates] = useState<StateOption[]>([]);
  const [selectedState, setSelectedState] = useState<StateOption | null>(null);
  const [results, setResults] = useState<VerdictResult[]>([]);
  const [lawBundle, setLawBundle] = useState<StateLawBundle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statesLoading, setStatesLoading] = useState(true);
  const didAutoCheck = useRef<string | null>(null);

  // Fetch state list on mount
  useEffect(() => {
    (async () => {
      const { data, error: err } = await supabase
        .from('states')
        .select('id, name, abbreviation, inspection_required, emissions_required')
        .order('name');
      if (err) {
        setError('Failed to load states: ' + err.message);
      } else {
        setStates(data ?? []);
      }
      setStatesLoading(false);
    })();
  }, []);

  // Auto-check when navigated from Home with a stateId param, OR fall back to home state
  useEffect(() => {
    if (states.length === 0) return;

    const paramStateId = route.params?.stateId;

    // Priority 1: explicit stateId param from navigation
    if (paramStateId) {
      if (didAutoCheck.current === paramStateId) return;
      const match = states.find((s) => s.id === paramStateId);
      if (match) {
        didAutoCheck.current = paramStateId;
        handleCheck(match);
      }
      return;
    }

    // Priority 2: home state, if set and we haven't checked anything yet
    if (profile.homeStateAbbreviation && !selectedState) {
      const homeMatch = states.find(
        (s) => s.abbreviation === profile.homeStateAbbreviation,
      );
      if (homeMatch && didAutoCheck.current !== homeMatch.id) {
        didAutoCheck.current = homeMatch.id;
        handleCheck(homeMatch);
      }
    }
  }, [route.params?.stateId, states, profile.homeStateAbbreviation]);

  const handleCheck = async (state: StateOption) => {
    setSelectedState(state);
    setLoading(true);
    setError(null);
    setResults([]);
    setLawBundle(null);

    const allVerdicts: VerdictResult[] = [];
    const bundle: StateLawBundle = {
      state,
      tint: null,
      exhaust: null,
      suspension: null,
    };

    // 1. Tint law (fetch always, for both verdict and detail display)
    const { data: tintData } = await supabase
      .from('tint_laws')
      .select(`
        front_side_vlt, rear_side_vlt, rear_window_vlt,
        windshield_strip, reflective_allowed, medical_exemption,
        fine_first_offense, notes,
        states ( name, abbreviation )
      `)
      .eq('state_id', state.id)
      .single();

    if (tintData) {
      const s = normalizeStates(tintData.states);
      if (s) {
        const law: TintLawRow = {
          front_side_vlt: tintData.front_side_vlt,
          rear_side_vlt: tintData.rear_side_vlt,
          rear_window_vlt: tintData.rear_window_vlt,
          windshield_strip: tintData.windshield_strip,
          fine_first_offense: tintData.fine_first_offense,
          notes: tintData.notes,
          states: s,
        };
        allVerdicts.push(...checkTintLegality(profile.tint, law));
        bundle.tint = tintData;
      }
    }

    // 2. Exhaust law (fetch always so we can show it, but only verdict if not stock)
    const { data: exhaustData } = await supabase
      .from('exhaust_laws')
      .select(`
        max_decibels, muffler_required, cat_delete_legal,
        straight_pipe_legal, measurement_method, fine_first_offense, notes,
        states ( name, abbreviation )
      `)
      .eq('state_id', state.id)
      .single();

    if (exhaustData) {
      bundle.exhaust = exhaustData;
      if (profile.exhaust.type !== 'stock') {
        const s = normalizeStates(exhaustData.states);
        if (s) {
          const law: ExhaustLawRow = {
            max_decibels: exhaustData.max_decibels,
            muffler_required: exhaustData.muffler_required,
            cat_delete_legal: exhaustData.cat_delete_legal,
            straight_pipe_legal: exhaustData.straight_pipe_legal,
            fine_first_offense: exhaustData.fine_first_offense,
            notes: exhaustData.notes,
            states: s,
          };
          allVerdicts.push(...checkExhaustLegality(profile.exhaust, law));
        }
      }
    }

    // 3. Suspension law (fetch always, verdict only if not stock)
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
      bundle.suspension = suspData;
      if (profile.suspension.type !== 'stock') {
        const s = normalizeStates(suspData.states);
        if (s) {
          const law: SuspensionLawRow = {
            max_lift_inches: suspData.max_lift_inches,
            max_bumper_height_front: suspData.max_bumper_height_front,
            max_bumper_height_rear: suspData.max_bumper_height_rear,
            frame_height_limit: suspData.frame_height_limit,
            lowering_restrictions: suspData.lowering_restrictions,
            fine_first_offense: suspData.fine_first_offense,
            notes: suspData.notes,
            states: s,
          };
          allVerdicts.push(...checkSuspensionLegality(profile.suspension, law));
        }
      }
    }

    if (allVerdicts.length === 0 && !bundle.tint && !bundle.exhaust && !bundle.suspension) {
      setError('No law data found for ' + state.name);
    } else {
      setResults(allVerdicts);
      setLawBundle(bundle);
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
          Tint: Front {profile.tint.front_side_vlt}% / Rear sides{' '}
          {profile.tint.rear_side_vlt}% / Rear {profile.tint.rear_window_vlt}%
        </Text>
        {profile.exhaust.type !== 'stock' && (
          <Text style={styles.modSummaryLine}>
            Exhaust: {profile.exhaust.type}
            {profile.exhaust.estimated_decibels
              ? ` (${profile.exhaust.estimated_decibels} dB)`
              : ''}
          </Text>
        )}
        {profile.suspension.type !== 'stock' && (
          <Text style={styles.modSummaryLine}>
            Suspension: {profile.suspension.type} {profile.suspension.inches}"
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

      {selectedState && lawBundle && (
        <>
          {/* Home state pin control */}
          <View style={styles.homeStateControls}>
            {profile.homeStateAbbreviation === selectedState.abbreviation ? (
              <Pressable
                style={styles.homeStateUnpin}
                onPress={() => setHomeState(null)}
              >
                <Text style={styles.homeStateUnpinText}>
                  📍 This is your home state · Unpin
                </Text>
              </Pressable>
            ) : (
              <Pressable
                style={styles.homeStatePinBtn}
                onPress={() => setHomeState(selectedState.abbreviation)}
              >
                <Text style={styles.homeStatePinText}>
                  📍 Set as my home state
                </Text>
              </Pressable>
            )}
          </View>

          {results.length > 0 && (
            <View style={styles.resultsSection}>
              <Text style={styles.resultsTitle}>
                Results for {selectedState.name}
              </Text>

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

          {/* Full law reference */}
          <StateLawDetails
            state={selectedState}
            tint={lawBundle.tint}
            exhaust={lawBundle.exhaust}
            suspension={lawBundle.suspension}
          />
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
  homeStateControls: {
    marginTop: 16,
  },
  homeStatePinBtn: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#4ade80',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  homeStatePinText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4ade80',
  },
  homeStateUnpin: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#555555',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  homeStateUnpinText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888888',
  },
});
