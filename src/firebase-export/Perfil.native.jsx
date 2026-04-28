import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '@/lib/AuthContext';
import { LogOut, Settings, Shield, Star, Zap, CheckCircle2 } from 'lucide-react-native';
import { getLevelName, getPointsForNextLevel, getEarnedBadges, getLevelFromPoints } from '@/lib/campusflow-utils';
import BadgesList from '@/components/profile/BadgesList.native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/ui/Button.native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  profileCard: { borderRadius: 24, padding: 20, marginBottom: 24 },
  userInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  avatarText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  userText: { marginLeft: 16 },
  userName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  userEmail: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  statBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', padding: 12, borderRadius: 16, alignItems: 'center', marginHorizontal: 4 },
  statValue: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginVertical: 4 },
  statLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 8, fontWeight: '800' },
  progressContainer: { marginTop: 8 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressTitle: { color: '#fff', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  progressText: { color: 'rgba(255,255,255,0.7)', fontSize: 10 },
  progressBar: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#fff', borderRadius: 3 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#000' },
  editButton: { flexDirection: 'row', alignItems: 'center', padding: 6 },
  editButtonText: { fontSize: 12, color: '#666', marginLeft: 4 },
  infoList: { backgroundColor: '#f9fafb', borderRadius: 16, padding: 16 },
  infoItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  infoLabel: { color: '#666', fontSize: 13 },
  infoValue: { color: '#000', fontSize: 13, fontWeight: '600' },
  adminButton: { marginVertical: 8, height: 50 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, marginTop: 12 },
  logoutText: { color: '#ef4444', fontSize: 14, fontWeight: '600', marginLeft: 8 },
});

export default function Perfil({ navigation }) {
  const { user, logout, updateMe } = useAuth();

  if (!user) return null;

  const points = user.points || 0;
  const totalCheckins = user.total_checkins || 0;
  const level = getLevelFromPoints(points);
  const earnedBadgeIds = getEarnedBadges(totalCheckins);
  const nextLevelPoints = getPointsForNextLevel(level);
  const progressToNext = nextLevelPoints === Infinity ? 1 : points / nextLevelPoints;

  const handleLogout = () => {
    Alert.alert('Logout', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', onPress: () => logout(), style: 'destructive' },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#000', '#1d4ed8']} style={styles.profileCard}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{(user.full_name || user.email || '?')[0].toUpperCase()}</Text>
            </View>
            <View style={styles.userText}>
              <Text style={styles.userName}>{user.full_name || 'Utilizador'}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Star size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.statValue}>{points}</Text>
              <Text style={styles.statLabel}>PONTOS</Text>
            </View>
            <View style={styles.statBox}>
              <Zap size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.statValue}>{level}</Text>
              <Text style={styles.statLabel}>NÍVEL</Text>
            </View>
            <View style={styles.statBox}>
              <CheckCircle2 size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.statValue}>{totalCheckins}</Text>
              <Text style={styles.statLabel}>CHECK-INS</Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>{getLevelName(level)}</Text>
              <Text style={styles.progressText}>{points} / {nextLevelPoints} PTS</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressToNext * 100}%` }]} />
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Minhas Conquistas</Text>
          <BadgesList earnedBadges={earnedBadgeIds} />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Informações</Text>
            <TouchableOpacity style={styles.editButton}>
              <Settings size={14} color="#666" />
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Ocupação</Text>
              <Text style={styles.infoValue}>{user.user_type || 'Aluno'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Curso</Text>
              <Text style={styles.infoValue}>{user.course || 'Não definido'}</Text>
            </View>
          </View>
        </View>

        {user.role === 'admin' && (
          <Button variant="outline" style={styles.adminButton} onPress={() => navigation.navigate('Admin')}>
            <Shield size={16} color="#000" style={{ marginRight: 8 }} />
            Painel de Administração
          </Button>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={18} color="#ef4444" />
          <Text style={styles.logoutText}>Terminar Sessão</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
