import React, { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

function Link({ label, url }: { label: string; url: string }) {
  return (
    <Pressable onPress={() => Linking.openURL(url)}>
      <Text style={styles.link}>{label}</Text>
    </Pressable>
  );
}

export default function AboutSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Pressable style={styles.toggle} onPress={() => setExpanded((v) => !v)}>
        <Text style={styles.toggleText}>
          About ModCheck {expanded ? '▾' : '▸'}
        </Text>
      </Pressable>

      {expanded && (
        <View style={styles.body}>
          <Text style={styles.heading}>Why ModCheck</Text>
          <Text style={styles.paragraph}>
            Car enthusiasts shouldn't have to dig through 50 DMV websites to
            find out if their tint, exhaust, or lift is legal. ModCheck
            cross-references your setup against every US state at once and
            tells you where you're good, where you're borderline, and where
            you'll get a ticket.
          </Text>

          <Text style={styles.heading}>How it works</Text>
          <Text style={styles.paragraph}>
            Each state's vehicle code for tint (VLT percentage), exhaust
            (decibel limits, muffler and cat requirements), and suspension
            (max lift, bumper heights) is stored in a database. When you
            enter your mods, the app compares your values to each state's
            rules and returns a green/yellow/red verdict plus the reasoning.
          </Text>

          <Text style={styles.heading}>Data caveats</Text>
          <Text style={styles.paragraph}>
            Law data was compiled from state DMV pages and vehicle codes as
            of early 2026. Laws change and enforcement varies by jurisdiction.
            Always verify current regulations with your state's DMV before
            making modification decisions. ModCheck is not legal advice.
          </Text>

          <Text style={styles.heading}>Built with</Text>
          <Text style={styles.paragraph}>
            React Native + TypeScript + Expo (web, iOS, Android from one
            codebase). Supabase for the Postgres database and auth. Deployed
            on Vercel.
          </Text>

          <Text style={styles.heading}>Links</Text>
          <View style={styles.linksRow}>
            <Link
              label="Source on GitHub →"
              url="https://github.com/harrisonvshen/ModCheck"
            />
          </View>
          <View style={styles.linksRow}>
            <Link
              label="Report an error or send feedback →"
              url="mailto:harrisonvshen@gmail.com?subject=ModCheck%20Feedback"
            />
          </View>

          <Text style={styles.credit}>
            Built by Harrison Shen. Version 1.0.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 32,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  toggle: {
    paddingVertical: 8,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4ade80',
  },
  body: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  heading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 14,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 13,
    color: '#aaaaaa',
    lineHeight: 20,
  },
  linksRow: {
    marginTop: 4,
  },
  link: {
    fontSize: 13,
    color: '#4ade80',
    fontWeight: '600',
    paddingVertical: 4,
    textDecorationLine: 'underline',
  },
  credit: {
    marginTop: 20,
    fontSize: 11,
    color: '#555555',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
