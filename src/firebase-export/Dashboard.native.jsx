import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useQuery } from '@tanstack/react-query';
import { Search, MapPin } from 'lucide-react-native';
import VenueCard from '@/components/dashboard/VenueCard.native';
import CategoryFilter from '@/components/dashboard/CategoryFilter.native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Dashboard({ navigation }) {
  const [category, setCategory] = useState('Todos');
  const [search, setSearch] = useState('');

  const { data: venues = [], isLoading } = useQuery({
    queryKey: ['venues'],
    queryFn: async () => {
      const q = query(collection(db, 'venues'), orderBy('crowdIndex', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      return data;
    },
    refetchInterval: 30000,
  });

  const filtered = venues.filter((v) => {
    const venueCategory = v.category?.toLowerCase() || '';
    const selectedCat = category.toLowerCase();

    // Lógica de filtro inclusiva (igual aos ícones)
    let catMatch = category === 'Todos';
    if (!catMatch) {
      if (selectedCat === 'biblioteca') catMatch = venueCategory.includes('biblioteca') || venueCategory.includes('estudo');
      else if (selectedCat === 'cantina') catMatch = venueCategory.includes('cantina') || venueCategory.includes('refeitório');
      else if (selectedCat === 'bar') catMatch = venueCategory.includes('bar') || venueCategory.includes('café');
      else catMatch = venueCategory.includes(selectedCat);
    }

    const searchMatch = !search ||
                        v.name.toLowerCase().includes(search.toLowerCase());

    return catMatch && searchMatch;
  });

  const avgOccupancy = venues.length
    ? Math.round(venues.reduce((acc, v) => acc + (v.crowdIndex || 0), 0) / venues.length)
    : 0;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header com Gradiente Real */}
        <LinearGradient
          colors={['#000000', '#1d4ed8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerCard}
        >
          <View style={styles.headerInfo}>
            <MapPin size={14} color="rgba(255,255,255,0.7)" />
            <Text style={styles.headerLocation}>Campus UTAD</Text>
          </View>
          <Text style={styles.headerTitle}>Ocupação Atual</Text>

          <View style={styles.occupancyMain}>
            <Text style={styles.occupancyValue}>{avgOccupancy}%</Text>
            <Text style={styles.occupancyLabel}>média geral</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={[styles.statDot, { backgroundColor: '#4ade80' }]} />
              <Text style={styles.statText}>
                {venues.filter(v => (v.crowdIndex || 0) < 40).length} livres
              </Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statDot, { backgroundColor: '#fbbf24' }]} />
              <Text style={styles.statText}>
                {venues.filter(v => (v.crowdIndex || 0) >= 40 && (v.crowdIndex || 0) < 70).length} moderados
              </Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statDot, { backgroundColor: '#f87171' }]} />
              <Text style={styles.statText}>
                {venues.filter(v => (v.crowdIndex || 0) >= 70).length} lotados
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={18} color="#999" style={styles.searchIcon} />
          <TextInput
            placeholder="Procurar local..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        {/* Categories */}
        <CategoryFilter active={category} onChange={setCategory} />

        {/* Venue List */}
        <View style={styles.listContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#000" style={{ marginTop: 40 }} />
          ) : filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <MapPin size={48} color="#e5e7eb" />
              <Text style={styles.emptyStateText}>Nenhum local encontrado</Text>
            </View>
          ) : (
            filtered.map((venue) => (
              <VenueCard
                key={venue.id}
                venue={venue}
                onPress={() => navigation.navigate('VenueDetail', { venueId: venue.id })}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8,
  },
  headerCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#1d4ed8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerLocation: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
  },
  occupancyMain: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 12,
  },
  occupancyValue: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '900',
  },
  occupancyLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginLeft: 8,
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 14,
    color: '#000',
  },
  listContainer: {
    marginTop: 8,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    color: '#9ca3af',
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
  }
});
