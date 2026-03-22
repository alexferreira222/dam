import React, { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Pencil, Trash2, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { getCategoryIcon } from '@/lib/campusflow-utils';
import { Skeleton } from '@/components/ui/skeleton';

const emptyVenue = { name: '', category: 'Cantina', latitude: '', longitude: '', capacity: 50, crowdIndex: 0, currentCount: 0, trend: 'stable' };

export default function Admin() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [form, setForm] = useState(emptyVenue);
  const queryClient = useQueryClient();

  const { data: venues = [], isLoading } = useQuery({
    queryKey: ['admin-venues'],
    queryFn: async () => {
      const q = query(collection(db, 'venues'), orderBy('name'));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (editingVenue) return updateDoc(doc(db, 'venues', editingVenue.id), data);
      return addDoc(collection(db, 'venues'), data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-venues'] });
      setDialogOpen(false);
      toast.success(editingVenue ? 'Local atualizado' : 'Local criado');
    },
  });

  const openEdit = (v) => {
    setEditingVenue(v);
    setForm({ ...v, latitude: v.latitude ?? '', longitude: v.longitude ?? '' });
    setDialogOpen(true);
  };

  const handleSave = () => {
    saveMutation.mutate({
      ...form,
      latitude: form.latitude !== '' ? parseFloat(form.latitude) : null,
      longitude: form.longitude !== '' ? parseFloat(form.longitude) : null,
      capacity: parseInt(form.capacity) || 0,
      crowdIndex: parseInt(form.crowdIndex) || 0,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-2 font-bold text-sm">CF CampusFlow Admin</div>
      </header>

      <div className="max-w-lg mx-auto p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/perfil"><Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button></Link>
            <h2 className="text-xl font-bold">Gestão</h2>
          </div>
          <Button onClick={() => { setEditingVenue(null); setForm(emptyVenue); setDialogOpen(true); }} size="sm" className="rounded-xl"><Plus className="w-4 h-4 mr-1" /> Novo</Button>
        </div>

        <div className="space-y-2">
          {isLoading ? <Skeleton className="h-20 w-full" /> : venues.map(v => (
            <div key={v.id} className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border shadow-sm">
              <span className="text-2xl">{getCategoryIcon(v.category)}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{v.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">{v.category} • {v.crowdIndex}%</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => openEdit(v)}><Pencil className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          {/* IMPORTANTE: overflow-visible para não cortar o Select */}
          <DialogContent className="max-w-sm mx-auto rounded-3xl p-6 shadow-2xl bg-white border-none overflow-visible">
            <DialogHeader><DialogTitle className="font-bold">{editingVenue ? 'Editar Local' : 'Novo Local'}</DialogTitle></DialogHeader>
            
            <div className="space-y-4 py-2 overflow-visible">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-muted-foreground">Nome</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="rounded-xl" />
              </div>

              {/* O FIX PARA O SELECT ESTÁ AQUI */}
              <div className="space-y-1 relative">
                <Label className="text-xs font-bold text-muted-foreground">Categoria</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger className="rounded-xl h-11 w-full bg-white border border-input shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  
                  {/* Forçamos o popper e um z-index altíssimo */}
                  <SelectContent 
                    position="popper" 
                    sideOffset={4}
                    className="z-[9999] min-w-[var(--radix-select-trigger-width)] bg-white border border-border rounded-xl shadow-xl p-1"
                  >
                    {['Cantina', 'Bar', 'Biblioteca', 'Laboratório', 'Auditório', 'Lazer', 'Outro'].map(c => (
                      <SelectItem key={c} value={c} className="rounded-lg py-2 cursor-pointer hover:bg-slate-100 uppercase text-[10px] font-bold tracking-tight">
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-muted-foreground">Latitude</Label>
                  <Input type="number" step="any" value={form.latitude} onChange={e => setForm({ ...form, latitude: e.target.value })} className="rounded-xl" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-muted-foreground">Longitude</Label>
                  <Input type="number" step="any" value={form.longitude} onChange={e => setForm({ ...form, longitude: e.target.value })} className="rounded-xl" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-muted-foreground">Capacidade</Label>
                  <Input type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} className="rounded-xl" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-muted-foreground">Ocupação (%)</Label>
                  <Input type="number" value={form.crowdIndex} onChange={e => setForm({ ...form, crowdIndex: e.target.value })} className="rounded-xl" />
                </div>
              </div>

              <Button onClick={handleSave} className="w-full rounded-xl h-12 font-bold gap-2 shadow-lg shadow-primary/20">
                <Save className="w-4 h-4" /> {editingVenue ? 'Guardar' : 'Criar'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}