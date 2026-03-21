import React from 'react';
import { getCategoryIcon } from '@/lib/campusflow-utils';

const categories = ['Todos', 'Cantina', 'Bar', 'Biblioteca', 'Laboratório', 'Auditório'];

export default function CategoryFilter({ active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
            active === cat
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-card text-muted-foreground border border-border hover:bg-accent'
          }`}
        >
          {cat !== 'Todos' && <span>{getCategoryIcon(cat)}</span>}
          {cat}
        </button>
      ))}
    </div>
  );
}