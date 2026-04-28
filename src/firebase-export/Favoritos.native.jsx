import React from 'react';
import { View, ScrollView, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useAuth } from '@/lib/AuthContext';
import { db } from '@/lib/firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import { useQuery } from '@tanstack/react-query';
import VenueCard from '@/components/dashboard/VenueCard.native';
import { Heart } from 'lucide-react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, backgroundColor: '#000' },
  title: { fontSize: 24, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  content: { padding: 16 },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 80, paddingHorizontal: 40 },
  emptyText: { fontSize: 16, fontWeight: '700', color: '#333', marginTop: 16, textAlign: 'center' },
  emptySubtext: { fontSize: 13, color: '#999', marginTop: 8, textAlign: 'center' },
});

export default function Favoritos({ navigation }) {
  const { user } = useAuth();

  const { data: venues = [], isLoading } = useQuery({
    queryKey: ['favorite-venues', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const q = query(collection(db, 'venues'));
      const snap = await getDocs(q);
      const allVenues = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      const favoriteIds = user?.favorites || [];
      return allVenues.filter(v => favoriteIds.includes(v.id));
    },
    enabled: !!user,
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Os Teus Favoritos</Text>
        <Text style={styles.subtitle}>Locais que acompanhas com mais frequência</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#000" style={{ marginTop: 40 }} />
        ) : venues.length === 0 ? (
          <View style={styles.emptyState}>
            <Heart size={48} color="#e5e7eb" fill="#f3f4f6" />
            <Text style={styles.emptyText}>Ainda não tens locais favoritos.</Text>
            <Text style={styles.emptySubtext}>Clica no coração em qualquer local para o guardares aqui.</Text>
          </View>
        ) : (
          venues.map(venue => (
            <VenueCard
              key={venue.id}
              venue={venue}
              onPress={() => navigation.navigate('VenueDetail', { venueId: venue.id })}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
