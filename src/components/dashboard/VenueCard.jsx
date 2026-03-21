import React from 'react';
import { Link } from 'react-router-dom';
import { Users, TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react';
import { getCrowdColor, getCategoryIcon } from '@/lib/campusflow-utils';
import { Progress } from '@/components/ui/progress';

export default function VenueCard({ venue }) {
  const crowd = getCrowdColor(venue.crowd_index || 0);
  const trendIcons = {
    subir: <TrendingUp className="w-3.5 h-3.5" />,
    descer: <TrendingDown className="w-3.5 h-3.5" />,
    estável: <Minus className="w-3.5 h-3.5" />,
  };

  return (
    <Link to={`/venue/${venue.id}`} className="block">
      <div className={`rounded-2xl border ${crowd.border} ${crowd.bg} p-4 transition-all hover:shadow-md active:scale-[0.98]`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="text-2xl flex-shrink-0 mt-0.5">
              {getCategoryIcon(venue.category)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground text-sm truncate">{venue.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{venue.category}</p>
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-medium ${crowd.text}`}>
                    {venue.crowd_index || 0}% ocupação
                  </span>
                  <span className={`text-xs flex items-center gap-0.5 ${crowd.text}`}>
                    {trendIcons[venue.trend || 'estável']}
                    {crowd.label}
                  </span>
                </div>
                <Progress
                  value={venue.crowd_index || 0}
                  className="h-1.5"
                />
              </div>
              <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                <Users className="w-3 h-3" />
                <span>{venue.current_count || 0} / {venue.capacity}</span>
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-2" />
        </div>
      </div>
    </Link>
  );
}