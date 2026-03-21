import React from 'react';
import { BADGES } from '@/lib/campusflow-utils';

export default function BadgesList({ earnedBadges = [] }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">Badges</h3>
      <div className="grid grid-cols-3 gap-3">
        {BADGES.map((badge) => {
          const earned = earnedBadges.includes(badge.id);
          return (
            <div
              key={badge.id}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                earned
                  ? 'bg-primary/5 border-primary/20'
                  : 'bg-muted/50 border-border opacity-40'
              }`}
            >
              <span className="text-2xl">{badge.icon}</span>
              <span className="text-[10px] font-medium text-center leading-tight">{badge.name}</span>
              <span className="text-[9px] text-muted-foreground text-center">{badge.description}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}