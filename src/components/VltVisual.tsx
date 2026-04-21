import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface VltRef {
  vlt: number;
  label: string;
  desc: string;
}

// Common VLT reference points. VLT = Visible Light Transmission:
// the percentage of light that passes through the glass.
// Lower = darker.
const REFERENCES: VltRef[] = [
  { vlt: 5, label: '5%', desc: 'Limo. Nearly opaque.' },
  { vlt: 15, label: '15%', desc: 'Very dark. Typical rear-SUV.' },
  { vlt: 20, label: '20%', desc: 'Dark aftermarket.' },
  { vlt: 35, label: '35%', desc: 'Common aftermarket.' },
  { vlt: 50, label: '50%', desc: 'Medium tint.' },
  { vlt: 70, label: '70%', desc: 'Light / factory.' },
];

interface Props {
  currentVlt?: number;
}

/**
 * Renders a row of 6 boxes, each with a dark overlay representing
 * the darkness of that VLT percentage. Optionally highlights the
 * user's current VLT if it matches a reference level (or is close).
 */
export default function VltVisual({ currentVlt }: Props) {
  const [expanded, setExpanded] = useState(false);

  // Find the closest reference to the user's current VLT
  const closestVlt = currentVlt !== undefined
    ? REFERENCES.reduce((prev, curr) =>
        Math.abs(curr.vlt - currentVlt) < Math.abs(prev.vlt - currentVlt) ? curr : prev,
      ).vlt
    : null;

  return (
    <View style={styles.wrapper}>
      <Pressable style={styles.toggle} onPress={() => setExpanded((v) => !v)}>
        <Text style={styles.toggleText}>
          What does VLT% actually look like? {expanded ? '▾' : '▸'}
        </Text>
      </Pressable>

      {expanded && (
        <View style={styles.body}>
          <Text style={styles.caption}>
            VLT is the % of light that passes through the glass. Lower = darker.
          </Text>

          <View style={styles.row}>
            {REFERENCES.map((r) => {
              const isClosest = closestVlt === r.vlt;
              // Opacity of the dark overlay: inverse of VLT
              // VLT 5% => very dark overlay (0.95), VLT 70% => light overlay (0.3)
              const overlayOpacity = 1 - r.vlt / 100;
              return (
                <View key={r.vlt} style={styles.swatchWrap}>
                  <View
                    style={[
                      styles.swatch,
                      isClosest && styles.swatchHighlighted,
                    ]}
                  >
                    {/* Car interior silhouette peeking through */}
                    <View style={styles.swatchInterior}>
                      <View style={styles.seatTop} />
                      <View style={styles.seatBack} />
                    </View>
                    {/* Dark overlay representing tint darkness */}
                    <View
                      style={[
                        styles.swatchOverlay,
                        { backgroundColor: `rgba(10, 10, 10, ${overlayOpacity})` },
                      ]}
                    />
                    {isClosest && (
                      <View style={styles.youAreHere}>
                        <Text style={styles.youAreHereText}>YOU</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.label, isClosest && styles.labelHighlighted]}>
                    {r.label}
                  </Text>
                  <Text style={styles.desc} numberOfLines={2}>
                    {r.desc}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 8,
    marginBottom: 4,
  },
  toggle: {
    paddingVertical: 6,
  },
  toggleText: {
    fontSize: 13,
    color: '#4ade80',
    fontWeight: '600',
  },
  body: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#141414',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  caption: {
    fontSize: 11,
    color: '#888888',
    marginBottom: 10,
    lineHeight: 15,
  },
  row: {
    flexDirection: 'row',
    gap: 4,
  },
  swatchWrap: {
    flex: 1,
    alignItems: 'center',
  },
  swatch: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#d0d0d0',
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  swatchHighlighted: {
    borderWidth: 2,
    borderColor: '#4ade80',
  },
  swatchInterior: {
    position: 'absolute',
    inset: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  seatTop: {
    width: '60%',
    height: '30%',
    backgroundColor: '#3a3a3a',
    borderRadius: 4,
    marginBottom: -8,
    zIndex: 1,
  },
  seatBack: {
    width: '70%',
    height: '45%',
    backgroundColor: '#555555',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  swatchOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  youAreHere: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    alignItems: 'center',
  },
  youAreHereText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#4ade80',
    letterSpacing: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#cccccc',
    marginTop: 5,
  },
  labelHighlighted: {
    color: '#4ade80',
  },
  desc: {
    fontSize: 9,
    color: '#777777',
    textAlign: 'center',
    lineHeight: 12,
    marginTop: 2,
  },
});
