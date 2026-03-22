import React from 'react';
import { Link } from 'react-router-dom';
import { Users, TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react';
import { getCrowdColor, getCategoryIcon } from '@/lib/campusflow-utils';
import { Progress } from '@/components/ui/progress';

export default function VenueCard({ venue }) {
  // 1. LÓGICA DE SEGURANÇA: Tenta ler o nome novo (crowdIndex) ou o antigo (crowd_index)
  // O Number() garante que "0" (texto) vira 0 (número) para a barra de progresso funcionar
  const occupancyValue = Number(venue.crowdIndex !== undefined ? venue.crowdIndex : (venue.crowd_index || 0));
  const currentCount = venue.currentCount !== undefined ? venue.currentCount : (venue.current_count || 0);
  
  const crowd = getCrowdColor(occupancyValue);

  // 2. TENDÊNCIA: Adicionei 'stable' para bater certo com o teu Firebase
  const trendIcons = {
    subir: <TrendingUp className="w-3.5 h-3.5" />,
    up: <TrendingUp className="w-3.5 h-3.5" />,
    descer: <TrendingDown className="w-3.5 h-3.5" />,
    down: <TrendingDown className="w-3.5 h-3.5" />,
    estável: <Minus className="w-3.5 h-3.5" />,
    stable: <Minus className="w-3.5 h-3.5" />,
  };

  return (
    <Link to={`/venue/${venue.id}`} className="block mb-3">
      <div className={`rounded-2xl border ${crowd.border} ${crowd.bg} p-4 transition-all hover:shadow-md active:scale-[0.98]`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* 3. EMOJI: getCategoryIcon agora é insensível a maiúsculas */}
            <div className="text-2xl flex-shrink-0 mt-0.5">
              {getCategoryIcon(venue.category)}
            </div>
            
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground text-sm truncate">{venue.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{venue.category}</p>
              
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-medium ${crowd.text}`}>
                    {occupancyValue}% ocupação
                  </span>
                  <span className={`text-xs flex items-center gap-0.5 ${crowd.text}`}>
                    {trendIcons[venue.trend?.toLowerCase()] || <Minus className="w-3.5 h-3.5" />}
                    {crowd.label}
                  </span>
                </div>
                <Progress
                  value={occupancyValue}
                  className="h-1.5"
                />
              </div>

              <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                <Users className="w-3 h-3" />
                <span>{currentCount} / {venue.capacity || '--'}</span>
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-2" />
        </div>
      </div>
    </Link>
  );
}