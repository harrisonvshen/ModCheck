import React from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { US_STATE_TILES, TILE_GRID_COLS, TILE_GRID_ROWS } from '../constants/usStatePaths';
import { Verdict } from '../types';

interface StateVerdict {
  abbreviation: string;
  worstVerdict: Verdict;
}

interface Props {
  verdicts: StateVerdict[];
  onStatePress?: (abbreviation: string) => void;
}

const VERDICT_COLORS: Record<Verdict, string> = {
  green: '#22c55e',
  yellow: '#eab308',
  red: '#ef4444',
};

const DEFAULT_FILL = '#333333';
const GAP = 2;
const PADDING = 8;

export default function USMap({ verdicts, onStatePress }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const verdictMap = new Map(verdicts.map((v) => [v.abbreviation, v.worstVerdict]));

  // Calculate cell size based on screen width
  const availableWidth = Math.min(screenWidth - 40, 500) - PADDING * 2;
  const cellSize = Math.floor((availableWidth - GAP * (TILE_GRID_COLS - 1)) / TILE_GRID_COLS);

  // Build a 2D grid
  const grid: (string | null)[][] = Array.from({ length: TILE_GRID_ROWS }, () =>
    Array(TILE_GRID_COLS).fill(null),
  );
  for (const tile of US_STATE_TILES) {
    if (tile.row < TILE_GRID_ROWS && tile.col < TILE_GRID_COLS) {
      grid[tile.row][tile.col] = tile.abbreviation;
    }
  }

  return (
    <View style={[styles.container, { padding: PADDING }]}>
      {grid.map((row, rowIdx) => (
        <View key={rowIdx} style={styles.row}>
          {row.map((abbr, colIdx) => {
            if (!abbr) {
              return (
                <View
                  key={colIdx}
                  style={{ width: cellSize, height: cellSize, margin: GAP / 2 }}
                />
              );
            }

            const verdict = verdictMap.get(abbr);
            const bg = verdict ? VERDICT_COLORS[verdict] : DEFAULT_FILL;

            return (
              <Pressable
                key={colIdx}
                style={[
                  styles.cell,
                  {
                    width: cellSize,
                    height: cellSize,
                    margin: GAP / 2,
                    backgroundColor: bg,
                  },
                ]}
                onPress={() => onStatePress?.(abbr)}
              >
                <Text style={[styles.cellText, { fontSize: cellSize > 30 ? 10 : 7 }]}>
                  {abbr}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    marginBottom: 20,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    fontWeight: '800',
    color: '#ffffff',
  },
});
