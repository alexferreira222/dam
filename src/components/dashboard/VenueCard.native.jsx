import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Users, TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react-native';
import { getCrowdColor, getCategoryIcon } from '@/lib/campusflow-utils';

export default function VenueCard({ venue, onPress }) {
  const occupancyValue = Number(venue.crowdIndex !== undefined ? venue.crowdIndex : (venue.crowd_index || 0));
  const currentCount = venue.currentCount !== undefined ? venue.currentCount : (venue.current_count || 0);

  const crowd = getCrowdColor(occupancyValue);

  const getTrendIcon = () => {
    const trend = venue.trend?.toLowerCase();
    if (trend === 'subir' || trend === 'up') return <TrendingUp size={14} color={styles[crowd.text]?.color || '#666'} />;
    if (trend === 'descer' || trend === 'down') return <TrendingDown size={14} color={styles[crowd.text]?.color || '#666'} />;
    return <Minus size={14} color={styles[crowd.text]?.color || '#666'} />;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.card,
        styles[crowd.bg],
        styles[crowd.border]
      ]}
      activeOpacity={0.7}
    >
      <View style={styles.container}>
        <Text style={styles.icon}>{getCategoryIcon(venue.category)}</Text>

        <View style={styles.content}>
          <Text style={styles.name}>{venue.name}</Text>
          <Text style={styles.category}>{venue.category}</Text>

          <View style={styles.occupancyContainer}>
            <View style={styles.occupancyHeader}>
              <Text style={[styles.occupancyText, styles[crowd.text]]}>
                {occupancyValue}% ocupação
              </Text>
              <View style={styles.trendContainer}>
                {getTrendIcon()}
                <Text style={[styles.trendLabel, styles[crowd.text]]}>{crowd.label}</Text>
              </View>
            </View>

            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${occupancyValue}%` }, styles[crowd.dot]]} />
            </View>
          </View>

          <View style={styles.footer}>
            <Users size={12} color="#666" />
            <Text style={styles.footerText}>{currentCount} / {venue.capacity || '--'}</Text>
          </View>
        </View>

        <ChevronRight size={18} color="#999" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
  },
  category: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  occupancyContainer: {
    marginTop: 12,
  },
  occupancyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  occupancyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  footerText: {
    fontSize: 11,
    color: '#666',
    marginLeft: 4,
  },
  // Color mappings from utility
  'bg-green-50': { backgroundColor: '#f0fdf4' },
  'bg-amber-50': { backgroundColor: '#fffbeb' },
  'bg-red-50': { backgroundColor: '#fef2f2' },
  'text-green-700': { color: '#15803d' },
  'text-amber-700': { color: '#b45309' },
  'text-red-700': { color: '#b91c1c' },
  'border-green-200': { borderColor: '#bbf7d0' },
  'border-amber-200': { borderColor: '#fde68a' },
  'border-red-200': { borderColor: '#fecaca' },
  'bg-green-500': { backgroundColor: '#22c55e' },
  'bg-amber-500': { backgroundColor: '#f59e0b' },
  'bg-red-500': { backgroundColor: '#ef4444' },
});
