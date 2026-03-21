// src/pages/VenueDetail.jsx
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Heart, Users, MapPin } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getCrowdColor, getCategoryIcon } from '@/lib/campusflow-utils';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import OccupancyChart from '@/components/venue/OccupancyChart';
import CheckinButton from '@/components/venue/CheckinButton';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/AuthContext';

export default function VenueDetail() {
  const { id: venueId } = useParams();
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
    if (isFavorite && favDocId) {
      await deleteDoc(doc(db, 'favorites', favDocId));
      setIsFavorite(false); setFavDocId(null);
      toast.success('Removido dos favoritos');
    } else {
      const ref = await addDoc(collection(db, 'favorites'), {
        user_id: user.id, user_email: user.email, venue_id: venueId, venue_name: venue.name,
      });
      setIsFavorite(true); setFavDocId(ref.id);
      toast.success('Adicionado aos favoritos');
    }
  };

  const handleCheckin = () => {
    queryClient.invalidateQueries({ queryKey: ['venue', venueId] });
    queryClient.invalidateQueries({ queryKey: ['venues'] });
  };

  if (isLoading || !venue) return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center"><span className="text-primary-foreground font-bold text-sm">CF</span></div>
          <h1 className="text-base font-bold">CampusFlow</h1>
        </div>
      </header>
      <div className="max-w-lg mx-auto p-4 space-y-4">
        <Skeleton className="h-8 w-32" /><Skeleton className="h-48 rounded-2xl" /><Skeleton className="h-40 rounded-2xl" />
      </div>
    </div>
  );

  const crowd = getCrowdColor(venue.crowd_index || 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center"><span className="text-primary-foreground font-bold text-sm">CF</span></div>
          <h1 className="text-base font-bold">CampusFlow</h1>
        </div>
      </header>
      <div className="max-w-lg mx-auto p-4 space-y-4 pb-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />Voltar
          </Link>
          <Button variant="ghost" size="icon" onClick={toggleFavorite} className="rounded-full">
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
          </Button>
        </div>

        <div className={`rounded-2xl border ${crowd.border} ${crowd.bg} p-5`}>
          <div className="flex items-start gap-3">
            <div className="text-3xl">{getCategoryIcon(venue.category)}</div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">{venue.name}</h2>
              <p className="text-sm text-muted-foreground">{venue.category}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-2xl font-extrabold ${crowd.text}`}>{venue.crowd_index || 0}%</span>
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${crowd.bg} ${crowd.text} border ${crowd.border}`}>{crowd.label}</span>
            </div>
            <Progress value={venue.crowd_index || 0} className="h-2" />
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{venue.current_count || 0} / {venue.capacity}</span>
              {venue.latitude && venue.longitude && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />GPS ativo</span>}
            </div>
          </div>
        </div>

        {user && <CheckinButton venue={venue} onCheckin={handleCheckin} />}
        <OccupancyChart crowdIndex={venue.crowd_index || 0} />
      </div>
    </div>
  );
}