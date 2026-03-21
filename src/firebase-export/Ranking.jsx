// src/pages/Ranking.jsx
import React, { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Medal } from 'lucide-react';
import { getLevelName } from '@/lib/campusflow-utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Ranking() {
  const [courseFilter, setCourseFilter] = useState('all');

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['ranking'],
    queryFn: async () => {
      const q = query(collection(db, 'users'), orderBy('points', 'desc'), limit(50));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },
  });

  const courses = [...new Set(users.map(u => u.course).filter(Boolean))];
  const filtered = courseFilter === 'all' ? users : users.filter(u => u.course === courseFilter);

  const rankIcon = (index) => {
    if (index === 0) return <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center"><Trophy className="w-4 h-4 text-amber-600" /></div>;
    if (index === 1) return <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><Medal className="w-4 h-4 text-gray-500" /></div>;
    if (index === 2) return <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center"><Medal className="w-4 h-4 text-orange-600" /></div>;
    return <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">{index + 1}</div>;
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h2 className="text-xl font-bold text-foreground">Ranking</h2>
        <p className="text-sm text-muted-foreground">Os alunos mais ativos do campus</p>
      </div>
      <Select value={courseFilter} onValueChange={setCourseFilter}>
        <SelectTrigger className="rounded-xl bg-card"><SelectValue placeholder="Filtrar por curso" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os cursos</SelectItem>
          {courses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
        </SelectContent>
      </Select>
      <div className="space-y-2">
        {isLoading ? Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />) :
          filtered.map((u, index) => (
            <div key={u.id} className={`flex items-center gap-3 p-3 rounded-xl border ${index < 3 ? 'bg-card border-primary/20 shadow-sm' : 'bg-card border-border'}`}>
              {rankIcon(index)}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{u.full_name || u.email}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{getLevelName(u.level || 1)}</span>
                  {u.course && <span>• {u.course}</span>}
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">{u.points || 0}</p>
                <p className="text-xs text-muted-foreground">pts</p>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}