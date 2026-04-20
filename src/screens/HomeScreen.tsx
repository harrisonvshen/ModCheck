import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useModProfile } from '../context/ModProfileContext';
import { useAllStatesCheck, StateVerdict } from '../hooks/useAllStatesCheck';
import { RootTabParamList } from '../types';
import USMap from '../components/USMap';

type Nav = BottomTabNavigationProp<RootTabParamList, 'Home'>;

const VERDICT_COLORS = {
  green: '#4ade80',
  yellow: '#facc15',
  red: '#f87171',
};

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { profile } = useModProfile();
  const { results, loading, error } = useAllStatesCheck({
    tint: profile.tint,
    exhaust: profile.exhaust,
    suspension: profile.suspension,
  });

  const greenCount = results.filter((r) => r.worstVerdict === 'green').length;
  const yellowCount = results.filter((r) => r.worstVerdict === 'yellow').length;
  const redCount = results.filter((r) => r.worstVerdict === 'red').length;

  const handleStateTap = (state: StateVerdict) => {
    navigation.navigate('Check', {
      stateId: state.id,
      stateName: state.name,
    });
  };

  const handleMapTap = (abbreviation: string) => {
    const match = results.find((r) => r.abbreviation === abbreviation);
    if (match) handleStateTap(match);
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {/* Header */}
      <Text style={styles.title}>Where Am I Legal?</Text>
      <Text style={styles.subtitle}>
        Tint: {profile.tint.front_side_vlt}%/{profile.tint.rear_side_vlt}%/{profile.tint.rear_window_vlt}%
        {profile.exhaust.type !== 'stock' ? `  ·  Exhaust: ${profile.exhaust.type}` : ''}
        {profile.suspension.type !== 'stock' ? `  ·  Susp: ${profile.suspension.type} ${profile.suspension.inches}"` : ''}
      </Text>

      {/* Summary counters */}
      {!loading && results.length > 0 && (
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { borderColor: VERDICT_COLORS.green }]}>
            <Text style={[styles.summaryCount, { color: VERDICT_COLORS.green }]}>
              {greenCount}
            </Text>
            <Text style={styles.summaryLabel}>Legal</Text>
          </View>
          <View style={[styles.summaryCard, { borderColor: VERDICT_COLORS.yellow }]}>
            <Text style={[styles.summaryCount, { color: VERDICT_COLORS.yellow }]}>
              {yellowCount}
            </Text>
            <Text style={styles.summaryLabel}>Borderline</Text>
          </View>
          <View style={[styles.summaryCard, { borderColor: VERDICT_COLORS.red }]}>
            <Text style={[styles.summaryCount, { color: VERDICT_COLORS.red }]}>
              {redCount}
            </Text>
            <Text style={styles.summaryLabel}>Illegal</Text>
          </View>
        </View>
      )}

      {/* Loading */}
      {loading && (
        <ActivityIndicator color="#4ade80" size="large" style={{ marginTop: 40 }} />
      )}

      {/* Error */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Tile map */}
      {!loading && results.length > 0 && (
        <USMap verdicts={results} onStatePress={handleMapTap} />
      )}

      {/* State grid */}
      {!loading && results.length > 0 && (
        <View style={styles.stateGrid}>
          {results.map((state) => (
            <Pressable
              key={state.id}
              style={[
                styles.stateChip,
                { borderColor: VERDICT_COLORS[state.worstVerdict] },
              ]}
              onPress={() => handleStateTap(state)}
            >
              <Text
                style={[
                  styles.stateAbbr,
                  { color: VERDICT_COLORS[state.worstVerdict] },
                ]}
              >
                {state.abbreviation}
              </Text>
              <Text style={styles.stateName} numberOfLines={1}>
                {state.name}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Disclaimer */}
      <Text style={styles.disclaimer}>
        Tap any state for a detailed breakdown. Data is for informational
        purposes only — verify with your state DMV before making decisions.
      </Text>
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
    fontSize: 14,
    color: '#888888',
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  summaryCount: {
    fontSize: 28,
    fontWeight: '800',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },
  errorText: {
    fontSize: 14,
    color: '#f87171',
    marginTop: 16,
    textAlign: 'center',
  },
  stateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  stateChip: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1.5,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: '31%',
    alignItems: 'center',
  },
  stateAbbr: {
    fontSize: 16,
    fontWeight: '800',
  },
  stateName: {
    fontSize: 10,
    color: '#777777',
    marginTop: 3,
  },
  disclaimer: {
    fontSize: 11,
    color: '#555555',
    marginTop: 24,
    textAlign: 'center',
    lineHeight: 16,
  },
});
