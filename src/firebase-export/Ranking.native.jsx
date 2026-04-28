import React from 'react';
import { View, ScrollView, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Medal } from 'lucide-react-native';
import { getLevelName } from '@/lib/campusflow-utils';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, backgroundColor: '#000' },
  title: { fontSize: 24, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  content: { padding: 16 },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
  },
  topThreeCard: {
    backgroundColor: '#fff',
    borderColor: '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  normalCard: {
    backgroundColor: '#f9fafb',
    borderColor: 'transparent',
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankNumber: { fontSize: 12, fontWeight: '800', color: '#999' },
  userInfo: { flex: 1 },
  userName: { fontSize: 15, fontWeight: '700', color: '#000' },
  userDetails: { flexDirection: 'row', marginTop: 2 },
  userLevel: { fontSize: 11, color: '#666' },
  userCourse: { fontSize: 11, color: '#999' },
  pointsContainer: { alignItems: 'flex-end' },
  pointsValue: { fontSize: 16, fontWeight: '800', color: '#000' },
  pointsLabel: { fontSize: 10, color: '#999', marginTop: -2 },
});

export default function Ranking() {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['ranking'],
    queryFn: async () => {
      const q = query(collection(db, 'users'), orderBy('points', 'desc'), limit(50));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },
  });

  const getRankIcon = (index) => {
    if (index === 0) return <View style={[styles.rankBadge, { backgroundColor: '#fef3c7' }]}><Trophy size={16} color="#d97706" /></View>;
    if (index === 1) return <View style={[styles.rankBadge, { backgroundColor: '#f3f4f6' }]}><Medal size={16} color="#4b5563" /></View>;
    if (index === 2) return <View style={[styles.rankBadge, { backgroundColor: '#fff7ed' }]}><Medal size={16} color="#ea580c" /></View>;
    return <View style={[styles.rankBadge, { backgroundColor: '#f9fafb' }]}><Text style={styles.rankNumber}>{index + 1}</Text></View>;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ranking</Text>
        <Text style={styles.subtitle}>Os alunos mais ativos do campus</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#000" style={{ marginTop: 40 }} />
        ) : (
          users.map((u, index) => (
            <View
              key={u.id}
              style={[
                styles.userCard,
                index < 3 ? styles.topThreeCard : styles.normalCard
              ]}
            >
              {getRankIcon(index)}
              <View style={styles.userInfo}>
                <Text style={styles.userName} numberOfLines={1}>
                  {u.full_name || u.email?.split('@')[0]}
                </Text>
                <View style={styles.userDetails}>
                  <Text style={styles.userLevel}>{getLevelName(u.level || 1)}</Text>
                  {u.course && <Text style={styles.userCourse}> • {u.course}</Text>}
                </View>
              </View>
              <View style={styles.pointsContainer}>
                <Text style={styles.pointsValue}>{u.points || 0}</Text>
                <Text style={styles.pointsLabel}>pts</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
