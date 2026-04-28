import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Heart, Users, MapPin } from 'lucide-react-native';
import { getCrowdColor, getCategoryIcon } from '@/lib/campusflow-utils';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/Button.native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backButton: { flexDirection: 'row', alignItems: 'center', padding: 8, marginLeft: -8 },
  backText: { fontSize: 14, color: '#666', marginLeft: 4 },
  venueCard: { borderRadius: 24, padding: 24, marginBottom: 20, borderWidth: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  icon: { fontSize: 32, marginRight: 16 },
  name: { fontSize: 20, fontWeight: '800', color: '#000' },
  category: { fontSize: 13, color: '#666' },
  occupancyValue: { fontSize: 36, fontWeight: '900' },
  occupancyLabel: { fontSize: 13, fontWeight: '700', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },
  progressBar: { height: 8, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 4, marginVertical: 16, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  cardFooter: { flexDirection: 'row', alignItems: 'center' },
  footerItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  footerText: { fontSize: 12, color: '#666', marginLeft: 6 },
  infoSection: { marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#000', marginBottom: 12 },
  description: { fontSize: 14, color: '#666', lineHeight: 22 },
  // Color mappings
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

import CheckinButton from '@/components/venue/CheckinButton.native';

export default function VenueDetail({ route, navigation }) {
  const { venueId } = route.params;
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favDocId, setFavDocId] = useState(null);

  const { data: venue, isLoading } = useQuery({
    queryKey: ['venue', venueId],
    queryFn: async () => {
      const snap = await getDoc(doc(db, 'venues', venueId));
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    },
    enabled: !!venueId,
  });

  useEffect(() => {
    if (!user || !venueId) return;
    const q = query(collection(db, 'favorites'), where('user_id', '==', user.id), where('venue_id', '==', venueId));
    getDocs(q).then(snap => {
      if (!snap.empty) { setIsFavorite(true); setFavDocId(snap.docs[0].id); }
    });
  }, [user, venueId]);

  const toggleFavorite = async () => {
    if (!user) return Alert.alert('Aviso', 'Faz login para guardar favoritos');
    try {
      if (isFavorite && favDocId) {
        await deleteDoc(doc(db, 'favorites', favDocId));
        setIsFavorite(false); setFavDocId(null);
      } else {
        const ref = await addDoc(collection(db, 'favorites'), { user_id: user.id, venue_id: venueId, venue_name: venue.name });
        setIsFavorite(true); setFavDocId(ref.id);
      }
    } catch (err) { console.error(err); }
  };

  if (isLoading || !venue) return <View style={styles.container}><ActivityIndicator size="large" color="#000" style={{marginTop: 50}}/></View>;

  const crowd = getCrowdColor(venue.crowdIndex || 0);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={20} color="#666" />
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleFavorite}>
            <Heart size={24} color={isFavorite ? '#ef4444' : '#999'} fill={isFavorite ? '#ef4444' : 'transparent'} />
          </TouchableOpacity>
        </View>

        <View style={[styles.venueCard, styles[crowd.bg], styles[crowd.border]]}>
          <View style={styles.cardHeader}>
            <Text style={styles.icon}>{getCategoryIcon(venue.category)}</Text>
            <View>
              <Text style={styles.name}>{venue.name}</Text>
              <Text style={styles.category}>{venue.category}</Text>
            </View>
          </View>

          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
            <Text style={[styles.occupancyValue, styles[crowd.text]]}>{venue.crowdIndex || 0}%</Text>
            <Text style={[styles.occupancyLabel, styles[crowd.bg], styles[crowd.text], styles[crowd.border]]}>{crowd.label}</Text>
          </View>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${venue.crowdIndex || 0}%` }, styles[crowd.dot]]} />
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.footerItem}>
              <Users size={14} color="#666" />
              <Text style={styles.footerText}>{venue.currentCount || 0} / {venue.capacity || '--'}</Text>
            </View>
            <View style={styles.footerItem}>
              <MapPin size={14} color={venue.latitude ? '#3b82f6' : '#666'} />
              <Text style={styles.footerText}>{venue.latitude ? 'GPS Ativo' : 'UTAD'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Sobre este local</Text>
          <Text style={styles.description}>
            {venue.description || 'Sem descrição disponível para este local no Campus UTAD.'}
          </Text>
        </View>

        {/* Botão de Check-in Real com GPS */}
        {user && <CheckinButton venue={venue} onCheckin={() => queryClient.invalidateQueries(['venue', venueId])} />}
      </ScrollView>
    </View>
  );
}
