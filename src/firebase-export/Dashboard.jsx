// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useQuery } from '@tanstack/react-query';
import VenueCard from '@/components/dashboard/VenueCard';
import CategoryFilter from '@/components/dashboard/CategoryFilter';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const [category, setCategory] = useState('Todos');
  const [search, setSearch] = useState('');

  const { data: venues = [], isLoading } = useQuery({
    queryKey: ['venues'],
    queryFn: async () => {
      const q = query(collection(db, 'venues'), orderBy('crowd_index', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },
    refetchInterval: 30000,
  });

  const filtered = venues.filter((v) => {
    const catMatch = category === 'Todos' || v.category === category;
    const searchMatch = !search || v.name.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });

  const avgOccupancy = venues.length
    ? Math.round(venues.reduce((acc, v) => acc + (v.crowd_index || 0), 0) / venues.length)
    : 0;

  return (
    <div className="p-4 space-y-5">
      <div className="bg-gradient-to-br from-primary to-blue-700 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-4 h-4 opacity-80" />
          <span className="text-xs font-medium opacity-80">Campus UTAD</span>
        </div>
        <h2 className="text-2xl font-bold">Ocupação Atual</h2>
        <div className="flex items-end gap-2 mt-2">
          <span className="text-4xl font-extrabold">{avgOccupancy}%</span>
          <span className="text-sm opacity-80 mb-1">média geral</span>
        </div>
        <div className="flex gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs opacity-90">{venues.filter(v => (v.crowd_index || 0) < 40).length} livres</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-xs opacity-90">{venues.filter(v => (v.crowd_index || 0) >= 40 && (v.crowd_index || 0) < 70).length} moderados</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-xs opacity-90">{venues.filter(v => (v.crowd_index || 0) >= 70).length} lotados</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Procurar local..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-card border-border rounded-xl h-10"
        />
      </div>

      <CategoryFilter active={category} onChange={setCategory} />

      <div className="space-y-3">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <MapPin className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">Nenhum local encontrado</p>
          </div>
        ) : (
          filtered.map((venue) => <VenueCard key={venue.id} venue={venue} />)
        )}
      </div>
    </div>
  );
}