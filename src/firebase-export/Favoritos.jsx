// src/pages/Favoritos.jsx
import React from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useQuery } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import VenueCard from '@/components/dashboard/VenueCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/AuthContext';

export default function Favoritos() {
  const { user } = useAuth();

  const { data: favoriteVenues = [], isLoading } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      const q = query(collection(db, 'favorites'), where('user_id', '==', user.id));
      const snap = await getDocs(q);
      const favs = snap.docs.map(d => d.data());
      // Buscar dados de cada venue
      const venuePromises = favs.map(f => getDoc(doc(db, 'venues', f.venue_id)));
      const venueSnaps = await Promise.all(venuePromises);
      return venueSnaps.filter(s => s.exists()).map(s => ({ id: s.id, ...s.data() }));
    },
    enabled: !!user,
  });

  return (
    <div className="p-4 space-y-4">
      <div>
        <h2 className="text-xl font-bold text-foreground">Favoritos</h2>
        <p className="text-sm text-muted-foreground">Os seus locais preferidos</p>
      </div>
      <div className="space-y-3">
        {isLoading ? Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />) :
          favoriteVenues.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Heart className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">Sem favoritos</p>
              <p className="text-xs mt-1">Toque no coração num local para o adicionar aqui</p>
            </div>
          ) : favoriteVenues.map(venue => <VenueCard key={venue.id} venue={venue} />)
        }
      </div>
    </div>
  );
}