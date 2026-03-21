import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { generatePrediction } from '@/lib/campusflow-utils';

export default function OccupancyChart({ crowdIndex }) {
  const data = generatePrediction(crowdIndex || 0);

  return (
    <div className="bg-card rounded-2xl border border-border p-4">
      <h3 className="text-sm font-semibold text-foreground mb-1">Previsão de Ocupação</h3>
      <p className="text-xs text-muted-foreground mb-3">Próximos 30 minutos</p>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="occupancyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="time" tick={{ fontSize: 10 }} className="text-muted-foreground" />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} className="text-muted-foreground" />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid hsl(214,32%,91%)' }}
              formatter={(value) => [`${value}%`, 'Ocupação']}
            />
            <ReferenceLine y={70} stroke="hsl(0, 84%, 60%)" strokeDasharray="3 3" label={{ value: '70%', fontSize: 10 }} />
            <ReferenceLine y={40} stroke="hsl(38, 92%, 50%)" strokeDasharray="3 3" label={{ value: '40%', fontSize: 10 }} />
            <Area
              type="monotone"
              dataKey="ocupacao"
              stroke="hsl(221, 83%, 53%)"
              strokeWidth={2}
              fill="url(#occupancyGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}