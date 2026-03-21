import React, { useState, useEffect } from 'react';
// Substituímos o base44Client pelos teus ficheiros locais
import { db, auth } from '@/lib/firebase'; 
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  updateDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
// Garante que este ficheiro existe em src/lib/ ou ajusta o caminho
import { getDistance, getEarnedBadges, getLevelFromPoints } from '@/lib/campusflow-utils';

const COOLDOWN_MS = 20 * 60 * 1000; // 20 minutos [cite: 459]
const MAX_DISTANCE_M = 50; // 50 metros [cite: 458]

export default function CheckinButton({ venue, user, onCheckin }) {
  const [status, setStatus] = useState('idle'); 
  const [cooldownEnd, setCooldownEnd] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');

  // Verifica o Cooldown ao carregar o componente [cite: 459]
  useEffect(() => {
    async function checkCooldown() {
      if (!user?.email || !venue?.id) return;

      const checkinRef = collection(db, "checkins");
      const q = query(
        checkinRef, 
        where("userEmail", "==", user.email),
        where("venueId", "==", venue.id),
        orderBy("timestamp", "desc"),
        limit(1)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const lastCheckin = querySnapshot.docs[0].data().timestamp.toDate();
        const endTime = lastCheckin.getTime() + COOLDOWN_MS;
        if (Date.now() < endTime) {
          setCooldownEnd(endTime);
          setStatus('cooldown');
        }
      }
    }
    checkCooldown();
  }, [user, venue]);

  // Timer do Cooldown [cite: 459]
  useEffect(() => {
    if (status !== 'cooldown' || !cooldownEnd) return;
    const interval = setInterval(() => {
      const remaining = cooldownEnd - Date.now();
      if (remaining <= 0) {
        setStatus('idle');
        setCooldownEnd(null);
      } else {
        const mins = Math.floor(remaining / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);
        setTimeLeft(`${mins}:${secs.toString().padStart(2, '0')}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [status, cooldownEnd]);

  const handleCheckin = async () => {
    if (!venue.latitude || !venue.longitude) {
      await performCheckin(); // Modo demo se não houver coordenadas
      return;
    }

    setStatus('locating');

    if (!navigator.geolocation) {
      toast.error('Geolocalização não suportada');
      setStatus('idle');
      return;
    }

    // Validação por Geofencing [cite: 458]
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const distance = getDistance(
          position.coords.latitude,
          position.coords.longitude,
          venue.latitude,
          venue.longitude
        );

        if (distance <= MAX_DISTANCE_M) {
          await performCheckin();
        } else {
          setStatus('too_far');
          toast.error(`Estás a ${Math.round(distance)}m. Aproxime-se para validar.`);
          setTimeout(() => setStatus('idle'), 3000);
        }
      },
      (error) => {
        toast.info('Sem acesso ao GPS — modo demo ativo');
        performCheckin();
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const performCheckin = async () => {
    const points = 10;
    const newTotalCheckins = (user.totalCheckins || 0) + 1;
    const newPoints = (user.points || 0) + points;
    const newLevel = getLevelFromPoints(newPoints);
    const newBadges = getEarnedBadges(newTotalCheckins);

    try {
      // 1. Cria o registo do check-in [cite: 252-254]
      await addDoc(collection(db, "checkins"), {
        userId: user.uid,
        userEmail: user.email,
        venueId: venue.id,
        venueName: venue.name,
        timestamp: serverTimestamp(),
        valid: true,
        pointsEarned: points,
      });

      // 2. Atualiza a ocupação do local [cite: 38, 256]
      const newCount = Math.min((venue.currentCount || 0) + 1, venue.capacity);
      const newIndex = Math.round((newCount / venue.capacity) * 100);
      await updateDoc(doc(db, "venues", venue.id), {
        currentCount: newCount,
        crowdIndex: newIndex,
      });

      // 3. Atualiza os dados do utilizador (Gamificação) [cite: 77, 400]
      await updateDoc(doc(db, "users", user.uid), {
        points: newPoints,
        level: newLevel,
        totalCheckins: newTotalCheckins,
        badges: newBadges,
      });

      setStatus('success');
      setCooldownEnd(Date.now() + COOLDOWN_MS);
      toast.success(`Check-in feito! +${points} pontos`);
      setTimeout(() => setStatus('cooldown'), 2000);
      if (onCheckin) onCheckin();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao processar check-in");
      setStatus('idle');
    }
  };

  // ... (mantém o resto dos teus retornos de UI: success, cooldown, etc.)
  return (
    <Button onClick={handleCheckin} disabled={status === 'locating'} className="w-full h-12 rounded-xl gap-2">
      {status === 'locating' ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
      Estou Aqui
    </Button>
  );
}