import React, { useState, useEffect } from 'react';
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
import { Button } from '@/components/ui/button';
import { MapPin, Loader2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getDistance, getEarnedBadges, getLevelFromPoints } from '@/lib/campusflow-utils';

const COOLDOWN_MS = 20 * 60 * 1000;
const MAX_DISTANCE_M = 50;

export default function CheckinButton({ venue, onCheckin }) {
  const { user, updateMe } = useAuth();
  const [status, setStatus] = useState('idle');
  const [cooldownEnd, setCooldownEnd] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');

  // 1. Verificar se o utilizador já fez check-in recentemente (Cooldown)
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
      } catch (err) {
        console.error("Erro ao verificar cooldown:", err);
      }
    }
    checkCooldown();
  }, [user?.id, venue?.id]);

  // 2. Timer do contador decrescente
  useEffect(() => {
    if (status !== 'cooldown' || !cooldownEnd) return;
    const interval = setInterval(() => {
      const remaining = cooldownEnd - Date.now();
      if (remaining <= 0) {
        setStatus('idle'); 
        setCooldownEnd(null); 
        setTimeLeft('');
      } else {
        const mins = Math.floor(remaining / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);
        setTimeLeft(`${mins}:${secs.toString().padStart(2, '0')}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [status, cooldownEnd]);

  // 3. Lógica de Localização
  const handleCheckin = async () => {
    if (!user) {
      toast.error("Precisas de ter sessão iniciada.");
      return;
    }

    if (!venue.latitude || !venue.longitude) { 
      await performCheckin(); 
      return; 
    }
    
    setStatus('locating');
    if (!navigator.geolocation) { 
      toast.error('O teu browser não suporta GPS'); 
      setStatus('idle'); 
      return; 
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const dist = getDistance(pos.coords.latitude, pos.coords.longitude, venue.latitude, venue.longitude);
        if (dist <= MAX_DISTANCE_M) {
          await performCheckin();
        } else { 
          setStatus('too_far'); 
          toast.error(`Estás a ${Math.round(dist)}m. Precisas de estar a menos de 50m.`); 
          setTimeout(() => setStatus('idle'), 3000); 
        }
      },
      () => { 
        toast.info('Modo demonstração: check-in sem GPS'); 
        performCheckin(); 
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // 4. A função que realmente grava os dados (Onde dava o erro)
  const performCheckin = async () => {
    // PROTEÇÃO CRÍTICA: Se o user não existe, sai antes de crashar
    if (!user) return;

    console.log("A processar check-in para o utilizador:", user.email);

    try {
      const pointsToAdd = 10;
      
      // NOMES RÍGIDOS (total_checkins com underscore)
      const currentCheckins = user.total_checkins || 0;
      const currentPoints = user.points || 0;

      const newTotalCheckins = currentCheckins + 1;
      const newPoints = currentPoints + pointsToAdd;
      const newLevel = getLevelFromPoints(newPoints);
      const newBadges = getEarnedBadges(newTotalCheckins);

      // A. Gravar na coleção 'checkins'
      await addDoc(collection(db, 'checkins'), {
        user_id: user.id,
        user_email: user.email,
        venue_id: venue.id,
        venue_name: venue.name,
        valid: true,
        points_earned: pointsToAdd,
        created_date: serverTimestamp(),
      });

      // B. Atualizar a Venue (ocupação)
      const newCount = Math.min((venue.current_count || 0) + 1, venue.capacity || 100);
      const newIndex = Math.round((newCount / (venue.capacity || 100)) * 100);
      
      await updateDoc(doc(db, 'venues', venue.id), { 
        current_count: newCount, 
        crowd_index: newIndex 
      });

      // C. Atualizar o Perfil do Aluno (updateMe usa total_checkins)
      await updateMe({ 
        points: newPoints, 
        level: newLevel, 
        total_checkins: newTotalCheckins, 
        badges: newBadges 
      });

      setStatus('success');
      setCooldownEnd(Date.now() + COOLDOWN_MS);
      toast.success(`Check-in confirmado! +${pointsToAdd} pontos`);
      
      setTimeout(() => setStatus('cooldown'), 2000);
      if (onCheckin) onCheckin();

    } catch (error) {
      console.error("Erro no processo de check-in:", error);
      toast.error("Falha ao registar presença");
      setStatus('idle');
    }
  };

  // 5. Interface do Botão
  if (status === 'cooldown') return (
    <Button disabled className="w-full h-12 rounded-xl gap-2 bg-muted text-muted-foreground shadow-none">
      <Clock className="w-4 h-4" /> Próximo em: {timeLeft}
    </Button>
  );
  
  if (status === 'success') return (
    <Button disabled className="w-full h-12 rounded-xl gap-2 bg-green-500 text-white shadow-none">
      <CheckCircle2 className="w-4 h-4" /> Estás aqui!
    </Button>
  );
  
  if (status === 'too_far') return (
    <Button disabled className="w-full h-12 rounded-xl gap-2 bg-destructive text-destructive-foreground shadow-none">
      <AlertCircle className="w-4 h-4" /> Demasiado longe
    </Button>
  );

  return (
    <Button 
      onClick={handleCheckin} 
      disabled={status === 'locating'} 
      className="w-full h-12 rounded-xl gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20"
    >
      {status === 'locating' ? (
        <><Loader2 className="w-4 h-4 animate-spin" /> A verificar GPS...</>
      ) : (
        <><MapPin className="w-4 h-4" /> Estou Aqui</>
      )}
    </Button>
  );
}