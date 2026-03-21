// Utility functions for CampusFlow

export function getCrowdColor(index) {
  if (index < 40) return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500', label: 'Baixa' };
  if (index < 70) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500', label: 'Moderada' };
  return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500', label: 'Alta' };
}

export function getTrendIcon(trend) {
  if (trend === 'subir') return '↑';
  if (trend === 'descer') return '↓';
  return '→';
}

export function getLevelFromPoints(points) {
  if (points >= 500) return 5;
  if (points >= 250) return 4;
  if (points >= 100) return 3;
  if (points >= 30) return 2;
  return 1;
}

export function getLevelName(level) {
  const names = {
    1: 'Caloiro',
    2: 'Explorador',
    3: 'Veterano',
    4: 'Mestre',
    5: 'Lenda do Campus',
  };
  return names[level] || 'Caloiro';
}

export function getPointsForNextLevel(level) {
  const thresholds = { 1: 30, 2: 100, 3: 250, 4: 500, 5: Infinity };
  return thresholds[level] || Infinity;
}

export const BADGES = [
  { id: 'first_checkin', name: 'Primeiro Passo', description: 'Fez o 1º check-in', icon: '🎯', requirement: 1 },
  { id: 'checkins_5', name: 'Habitual', description: '5 check-ins', icon: '⭐', requirement: 5 },
  { id: 'checkins_10', name: 'Regular', description: '10 check-ins', icon: '🏅', requirement: 10 },
  { id: 'checkins_25', name: 'Dedicado', description: '25 check-ins', icon: '🏆', requirement: 25 },
  { id: 'checkins_50', name: 'Lenda', description: '50 check-ins', icon: '👑', requirement: 50 },
];

export function getEarnedBadges(totalCheckins) {
  return BADGES.filter(b => totalCheckins >= b.requirement).map(b => b.id);
}

export function getCategoryIcon(category) {
  const icons = {
    Cantina: '🍽️',
    Bar: '☕',
    Biblioteca: '📚',
    Laboratório: '🔬',
    Auditório: '🎤',
    Outro: '📍',
  };
  return icons[category] || '📍';
}

// Haversine distance in meters
export function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Generate mock prediction data for a venue
export function generatePrediction(currentIndex) {
  const predictions = [];
  const now = new Date();
  for (let i = 0; i <= 6; i++) {
    const time = new Date(now.getTime() + i * 5 * 60000);
    const variation = Math.random() * 20 - 10;
    const predicted = Math.max(0, Math.min(100, currentIndex + variation * (i * 0.5)));
    predictions.push({
      time: time.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
      ocupacao: Math.round(predicted),
    });
  }
  return predictions;
}
