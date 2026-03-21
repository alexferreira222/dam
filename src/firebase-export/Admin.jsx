// src/pages/Admin.jsx
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

const emptyVenue = { name: '', category: 'Cantina', latitude: '', longitude: '', capacity: 50, crowd_index: 0, current_count: 0, trend: 'estável' };

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
      queryClient.invalidateQueries({ queryKey: ['venues'] });
      setDialogOpen(false);
      toast.success(editingVenue ? 'Local atualizado' : 'Local criado');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteDoc(doc(db, 'venues', id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-venues'] });
      toast.success('Local eliminado');
    },
  });

  const openCreate = () => { setEditingVenue(null); setForm(emptyVenue); setDialogOpen(true); };
  const openEdit = (v) => {
    setEditingVenue(v);
    setForm({ name: v.name, category: v.category, latitude: v.latitude || '', longitude: v.longitude || '', capacity: v.capacity, crowd_index: v.crowd_index || 0, current_count: v.current_count || 0, trend: v.trend || 'estável' });
    setDialogOpen(true);
  };

  const handleSave = () => {
    saveMutation.mutate({
      ...form,
      latitude: form.latitude ? parseFloat(form.latitude) : null,
      longitude: form.longitude ? parseFloat(form.longitude) : null,
      capacity: parseInt(form.capacity) || 50,
      crowd_index: parseInt(form.crowd_index) || 0,
      current_count: parseInt(form.current_count) || 0,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center"><span className="text-primary-foreground font-bold text-sm">CF</span></div>
          <h1 className="text-base font-bold">CampusFlow</h1>
        </div>
      </header>
      <div className="max-w-lg mx-auto p-4 space-y-4 pb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/perfil"><Button variant="ghost" size="icon" className="rounded-full"><ArrowLeft className="w-4 h-4" /></Button></Link>
            <div><h2 className="text-xl font-bold">Admin</h2><p className="text-xs text-muted-foreground">Gerir locais do campus</p></div>
          </div>
          <Button onClick={openCreate} size="sm" className="rounded-xl gap-1"><Plus className="w-4 h-4" />Novo</Button>
        </div>

        <div className="space-y-2">
          {isLoading ? Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />) :
            venues.map(v => (
              <div key={v.id} className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
                <span className="text-xl">{getCategoryIcon(v.category)}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{v.name}</p>
                  <p className="text-xs text-muted-foreground">{v.category} • Cap: {v.capacity} • {v.crowd_index || 0}%</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(v)}><Pencil className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { if (confirm('Eliminar?')) deleteMutation.mutate(v.id); }}><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            ))
          }
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-sm mx-auto rounded-2xl">
            <DialogHeader><DialogTitle>{editingVenue ? 'Editar Local' : 'Novo Local'}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label className="text-xs">Nome</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="rounded-xl mt-1" /></div>
              <div>
                <Label className="text-xs">Categoria</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{['Cantina', 'Bar', 'Biblioteca', 'Laboratório', 'Auditório', 'Outro'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">Latitude</Label><Input type="number" step="any" value={form.latitude} onChange={e => setForm({ ...form, latitude: e.target.value })} className="rounded-xl mt-1" /></div>
                <div><Label className="text-xs">Longitude</Label><Input type="number" step="any" value={form.longitude} onChange={e => setForm({ ...form, longitude: e.target.value })} className="rounded-xl mt-1" /></div>
              </div>
              <div><Label className="text-xs">Capacidade</Label><Input type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} className="rounded-xl mt-1" /></div>
              <Button onClick={handleSave} disabled={!form.name || saveMutation.isPending} className="w-full rounded-xl gap-2">
                <Save className="w-4 h-4" />{editingVenue ? 'Atualizar' : 'Criar'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}