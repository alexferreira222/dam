// src/pages/Perfil.jsx
import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LogOut, Settings, Shield, Star, Zap, CheckCircle2 } from 'lucide-react';
// ADICIONADO: getEarnedBadges e getLevelFromPoints
import { getLevelName, getPointsForNextLevel, getEarnedBadges, getLevelFromPoints } from '@/lib/campusflow-utils';
import { Progress } from '@/components/ui/progress';
import BadgesList from '@/components/profile/BadgesList';
import { toast } from 'sonner';

export default function Perfil() {
  const { user, logout, updateMe } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ 
    user_type: user?.user_type || 'Aluno', 
    course: user?.course || '' 
  });

  if (!user) return null;

  // --- LÓGICA DE DADOS DINÂMICA ---
  const points = user.points || 0;
  const totalCheckins = user.total_checkins || 0;
  
  // Calculamos o nível com base nos pontos atuais (para bater sempre certo)
  const level = getLevelFromPoints(points);
  
  // CALCULO DAS BADGES: Aqui está a magia! 
  // Em vez de passar user.badges, calculamos com base nos check-ins reais.
  const earnedBadgeIds = getEarnedBadges(totalCheckins);

  const nextLevelPoints = getPointsForNextLevel(level);
  const progressToNext = nextLevelPoints === Infinity ? 100 : Math.round((points / nextLevelPoints) * 100);

  const handleSave = async () => {
    await updateMe(form);
    setEditing(false);
    toast.success('Perfil atualizado');
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Card de Identidade */}
      <div className="bg-gradient-to-br from-primary to-blue-700 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold border border-white/10">
            {(user.full_name || user.email || '?')[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-bold">{user.full_name || 'Utilizador'}</h2>
            <p className="text-xs opacity-80">{user.email}</p>
            <p className="text-xs opacity-80 mt-0.5">
              {user.user_type || 'Aluno'} {user.course ? `• ${user.course}` : ''}
            </p>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/5">
            <Star className="w-4 h-4 mx-auto mb-1 opacity-80" />
            <p className="text-lg font-bold">{points}</p>
            <p className="text-[10px] opacity-70 uppercase">Pontos</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/5">
            <Zap className="w-4 h-4 mx-auto mb-1 opacity-80" />
            <p className="text-lg font-bold">{level}</p>
            <p className="text-[10px] opacity-70 uppercase">Nível</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/5">
            <CheckCircle2 className="w-4 h-4 mx-auto mb-1 opacity-80" />
            <p className="text-lg font-bold">{totalCheckins}</p>
            <p className="text-[10px] opacity-70 uppercase">Check-ins</p>
          </div>
        </div>

        {/* Progresso de Nível */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-[10px] mb-1 font-medium">
            <span className="uppercase tracking-wider opacity-90">{getLevelName(level)}</span>
            {nextLevelPoints !== Infinity && <span className="opacity-70">{points} / {nextLevelPoints} PTS</span>}
          </div>
          <Progress value={progressToNext} className="h-1.5 bg-black/20" />
        </div>
      </div>

      {/* Badges - AGORA COM A LISTA CALCULADA */}
      <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
        <h3 className="text-sm font-semibold mb-3">Conquistas</h3>
        <BadgesList earnedBadges={earnedBadgeIds} />
      </div>

      {/* Informações de Perfil */}
      <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Informações de Estudante</h3>
          <Button variant="ghost" size="sm" onClick={() => setEditing(!editing)} className="text-xs h-8">
            <Settings className="w-3.5 h-3.5 mr-1" />{editing ? 'Cancelar' : 'Editar'}
          </Button>
        </div>
        
        {editing ? (
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Tipo de Utilizador</Label>
              <Select value={form.user_type} onValueChange={(v) => setForm({ ...form, user_type: v })}>
                <SelectTrigger className="rounded-xl mt-1 h-10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Aluno', 'Funcionário', 'Docente', 'Outro'].map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Curso na UTAD</Label>
              <Input 
                value={form.course} 
                onChange={e => setForm({ ...form, course: e.target.value })} 
                placeholder="Ex: Engenharia Informática" 
                className="rounded-xl mt-1 h-10" 
              />
            </div>
            <Button onClick={handleSave} className="w-full rounded-xl">Guardar Alterações</Button>
          </div>
        ) : (
          <div className="space-y-2 text-sm pt-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ocupação</span>
              <span className="font-medium">{user.user_type || 'Aluno'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Curso</span>
              <span className="font-medium">{user.course || '—'}</span>
            </div>
          </div>
        )}
      </div>

      {user.role === 'admin' && (
        <Link to="/admin">
          <Button variant="outline" className="w-full rounded-xl gap-2 h-11">
            <Shield className="w-4 h-4 text-primary" />Painel de Administração
          </Button>
        </Link>
      )}

      <Button variant="ghost" className="w-full rounded-xl gap-2 text-destructive hover:bg-destructive/10 h-11" onClick={logout}>
        <LogOut className="w-4 h-4" />Terminar Sessão
      </Button>
    </div>
  );
}