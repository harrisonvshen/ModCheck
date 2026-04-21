import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
  const { results, loading, error, refresh } = useAllStatesCheck({
    tint: profile.tint,
    exhaust: profile.exhaust,
    suspension: profile.suspension,
  });

  const [search, setSearch] = useState('');
  const trimmedSearch = search.trim().toLowerCase();

  // Find the user's home state verdict (if set)
  const homeStateResult = useMemo(() => {
    if (!profile.homeStateAbbreviation) return null;
    return (
      results.find((r) => r.abbreviation === profile.homeStateAbbreviation) ??
      null
    );
  }, [results, profile.homeStateAbbreviation]);

  // Filtered list for the grid below the map. Map always shows all states.
  const filteredResults = useMemo(() => {
    if (!trimmedSearch) return results;
    return results.filter(
      (r) =>
        r.name.toLowerCase().includes(trimmedSearch) ||
        r.abbreviation.toLowerCase().includes(trimmedSearch),
    );
  }, [results, trimmedSearch]);

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

      {/* Home state card — shown prominently if user has pinned one */}
      {!loading && homeStateResult && (
        <Pressable
          style={[
            styles.homeStateCard,
            { borderColor: VERDICT_COLORS[homeStateResult.worstVerdict] },
          ]}
          onPress={() => handleStateTap(homeStateResult)}
        >
          <View style={styles.homeStateHeader}>
            <Text style={styles.homeStatePin}>📍</Text>
            <Text style={styles.homeStateLabel}>Your Home State</Text>
          </View>
          <View style={styles.homeStateRow}>
            <Text style={styles.homeStateName}>{homeStateResult.name}</Text>
            <View
              style={[
                styles.homeStateBadge,
                { backgroundColor: VERDICT_COLORS[homeStateResult.worstVerdict] },
              ]}
            >
              <Text style={styles.homeStateBadgeText}>
                {homeStateResult.worstVerdict === 'green'
                  ? 'LEGAL'
                  : homeStateResult.worstVerdict === 'yellow'
                  ? 'BORDERLINE'
                  : 'ILLEGAL'}
              </Text>
            </View>
          </View>
        </Pressable>
      )}

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

      {/* Error with retry */}
      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={refresh}>
            <Text style={styles.retryText}>Try Again</Text>
          </Pressable>
        </View>
      )}

      {/* Tile map */}
      {!loading && results.length > 0 && (
        <USMap verdicts={results} onStatePress={handleMapTap} />
      )}

      {/* Search bar */}
      {!loading && results.length > 0 && (
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search states (e.g. 'Texas' or 'CA')"
            placeholderTextColor="#666"
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {search.length > 0 && (
            <Pressable style={styles.searchClear} onPress={() => setSearch('')}>
              <Text style={styles.searchClearText}>✕</Text>
            </Pressable>
          )}
        </View>
      )}

      {/* State grid */}
      {!loading && filteredResults.length > 0 && (
        <View style={styles.stateGrid}>
          {filteredResults.map((state) => (
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

      {/* No search results */}
      {!loading && results.length > 0 && filteredResults.length === 0 && (
        <Text style={styles.noMatchText}>
          No states match "{search}". Try a state name or two-letter code.
        </Text>
      )}

      {/* Legal disclaimer */}
      <View style={styles.disclaimerBox}>
        <Text style={styles.disclaimerTitle}>⚠️  Not Legal Advice</Text>
        <Text style={styles.disclaimerText}>
          ModCheck provides general information about vehicle modification laws
          for educational purposes only. Laws change and enforcement varies.
          Always verify with your state's DMV or a qualified attorney before
          making modification decisions. ModCheck is not responsible for any
          fines, citations, or legal consequences.
        </Text>
      </View>

      {/* Feedback */}
      <Pressable
        style={styles.feedbackButton}
        onPress={() =>
          Linking.openURL(
            'mailto:harrisonvshen@gmail.com?subject=ModCheck%20Feedback&body=I%20noticed%20the%20following%20issue%20or%20have%20this%20feedback%3A%0A%0A',
          )
        }
      >
        <Text style={styles.feedbackText}>
          Found an error or have feedback? Email us
        </Text>
      </Pressable>

      <Text style={styles.tipText}>
        Tip: Tap any state for a detailed breakdown.
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
  homeStateCard: {
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  homeStateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  homeStatePin: {
    fontSize: 12,
  },
  homeStateLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  homeStateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  homeStateName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  homeStateBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
  },
  homeStateBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0f0f0f',
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
    textAlign: 'center',
  },
  errorBox: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#f87171',
    borderRadius: 10,
    alignItems: 'center',
  },
  retryButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#4ade80',
    borderRadius: 8,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f0f0f',
  },
  searchRow: {
    position: 'relative',
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    paddingRight: 40,
    fontSize: 15,
    color: '#ffffff',
  },
  searchClear: {
    position: 'absolute',
    right: 8,
    top: 0,
    bottom: 0,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchClearText: {
    fontSize: 16,
    color: '#888888',
  },
  noMatchText: {
    fontSize: 13,
    color: '#888888',
    textAlign: 'center',
    marginTop: 12,
    padding: 20,
    fontStyle: 'italic',
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
  disclaimerBox: {
    marginTop: 24,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#444444',
  },
  disclaimerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#facc15',
    marginBottom: 6,
  },
  disclaimerText: {
    fontSize: 11,
    color: '#999999',
    lineHeight: 16,
  },
  feedbackButton: {
    marginTop: 14,
    padding: 10,
    alignItems: 'center',
  },
  feedbackText: {
    fontSize: 12,
    color: '#4ade80',
    textDecorationLine: 'underline',
  },
  tipText: {
    fontSize: 11,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
  },
});
