import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { useAuth } from '@/lib/AuthContext';
import { MapPin, CheckCircle2, Clock, AlertCircle } from 'lucide-react-native';
import * as Location from 'expo-location';
import { getDistance, getEarnedBadges, getLevelFromPoints } from '@/lib/campusflow-utils';

const COOLDOWN_MS = 20 * 60 * 1000;
const MAX_DISTANCE_M = 50;

export default function CheckinButton({ venue, onCheckin }) {
  const { user, updateMe } = useAuth();
  const [status, setStatus] = useState('idle');
  const [cooldownEnd, setCooldownEnd] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    async function checkCooldown() {
      if (!user?.id || !venue?.id) return;
      try {
        const q = query(
          collection(db, 'checkins'),
          where('user_id', '==', user.id),
          where('venue_id', '==', venue.id),
          orderBy('created_date', 'desc'),
          limit(1)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const last = snap.docs[0].data();
          const lastTime = last.created_date?.toDate ? last.created_date.toDate() : new Date(last.created_date);
          const endTime = lastTime.getTime() + COOLDOWN_MS;
          if (Date.now() < endTime) {
            setCooldownEnd(endTime);
            setStatus('cooldown');
          }
        }
      } catch (err) { console.error("Cooldown check error:", err); }
    }
    checkCooldown();
  }, [user?.id, venue?.id]);

  useEffect(() => {
    if (status !== 'cooldown' || !cooldownEnd) return;
    const interval = setInterval(() => {
      const remaining = cooldownEnd - Date.now();
      if (remaining <= 0) {
        setStatus('idle'); setCooldownEnd(null); setTimeLeft('');
      } else {
        const mins = Math.floor(remaining / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);
        setTimeLeft(`${mins}:${secs.toString().padStart(2, '0')}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [status, cooldownEnd]);

  const handleCheckin = async () => {
    if (!user) return Alert.alert('Erro', 'Precisas de ter sessão iniciada.');

    // Se não houver coordenadas no local, permite check-in direto (para testes)
    if (!venue.latitude || !venue.longitude) {
      return performCheckin();
    }

    setStatus('locating');
    try {
      let { status: permStatus } = await Location.requestForegroundPermissionsAsync();
      if (permStatus !== 'granted') {
        setStatus('idle');
        return Alert.alert('Erro', 'Permissão de localização negada.');
      }

      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const dist = getDistance(location.coords.latitude, location.coords.longitude, venue.latitude, venue.longitude);

      if (dist <= MAX_DISTANCE_M) {
        await performCheckin();
      } else {
        setStatus('too_far');
        Alert.alert('Muito longe', `Estás a ${Math.round(dist)}m. Precisas de estar a menos de ${MAX_DISTANCE_M}m.`);
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (error) {
      console.error("GPS Error:", error);
      Alert.alert('Erro GPS', 'Não foi possível obter a tua localização.');
      setStatus('idle');
    }
  };

  const performCheckin = async () => {
    if (!user) return;
    setStatus('processing');
    try {
      const pointsToAdd = 10;
      const currentCheckins = user.total_checkins || 0;
      const currentPoints = user.points || 0;
      const newTotalCheckins = currentCheckins + 1;
      const newPoints = currentPoints + pointsToAdd;

      await addDoc(collection(db, 'checkins'), {
        user_id: user.id,
        user_email: user.email,
        venue_id: venue.id,
        venue_name: venue.name,
        valid: true,
        points_earned: pointsToAdd,
        created_date: serverTimestamp(),
      });

      const newCount = Math.min((venue.current_count || 0) + 1, venue.capacity || 100);
      const newIndex = Math.round((newCount / (venue.capacity || 100)) * 100);
      await updateDoc(doc(db, 'venues', venue.id), {
        current_count: newCount,
        crowd_index: newIndex
      });

      await updateMe({
        points: newPoints,
        level: getLevelFromPoints(newPoints),
        total_checkins: newTotalCheckins,
        badges: getEarnedBadges(newTotalCheckins)
      });

      setStatus('success');
      setCooldownEnd(Date.now() + COOLDOWN_MS);
      setTimeout(() => setStatus('cooldown'), 2000);
      if (onCheckin) onCheckin();
    } catch (error) {
      console.error("Check-in error:", error);
      Alert.alert('Erro', 'Falha ao registar presença');
      setStatus('idle');
    }
  };

  if (status === 'cooldown') return (
    <View style={[styles.button, styles.disabled]}>
      <Clock size={18} color="#999" />
      <Text style={styles.disabledText}>Próximo em: {timeLeft}</Text>
    </View>
  );

  if (status === 'success') return (
    <View style={[styles.button, styles.success]}>
      <CheckCircle2 size={18} color="#fff" />
      <Text style={styles.successText}>Check-in realizado!</Text>
    </View>
  );

  return (
    <TouchableOpacity
      onPress={handleCheckin}
      disabled={status === 'locating' || status === 'processing'}
      style={[styles.button, styles.primary]}
    >
      {status === 'locating' || status === 'processing' ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <>
          <MapPin size={18} color="#fff" />
          <Text style={styles.buttonText}>Estou Aqui</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  primary: { backgroundColor: '#000' },
  success: { backgroundColor: '#22c55e' },
  disabled: { backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: '#e5e7eb' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700', marginLeft: 8 },
  successText: { color: '#fff', fontSize: 16, fontWeight: '700', marginLeft: 8 },
  disabledText: { color: '#999', fontSize: 14, fontWeight: '600', marginLeft: 8 },
});
