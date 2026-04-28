import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BADGES } from '@/lib/campusflow-utils';

export default function BadgesList({ earnedBadges = [] }) {
  return (
    <View style={styles.grid}>
      {BADGES.map((badge) => {
        const earned = earnedBadges.includes(badge.id);
        return (
          <View
            key={badge.id}
            style={[
              styles.badge,
              earned ? styles.earnedBadge : styles.lockedBadge
            ]}
          >
            <Text style={styles.icon}>{badge.icon}</Text>
            <Text style={styles.name}>{badge.name}</Text>
            <Text style={styles.description}>{badge.description}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  badge: {
    width: '30%',
    margin: '1.66%',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  earnedBadge: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderColor: '#e5e7eb',
  },
  lockedBadge: {
    backgroundColor: '#f9fafb',
    borderColor: '#f3f4f6',
    opacity: 0.4,
  },
  icon: { fontSize: 24, marginBottom: 4 },
  name: { fontSize: 10, fontWeight: '700', color: '#000', textAlign: 'center' },
  description: { fontSize: 8, color: '#666', textAlign: 'center', marginTop: 2 },
});
