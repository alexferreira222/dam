import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Edit2, MapPin, Users, ArrowLeft } from 'lucide-react-native';
import { Button } from '@/components/ui/Button.native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: '#d32f2f' },
  backButton: { marginRight: 16 },
  title: { fontSize: 20, fontWeight: '800', color: '#fff' },
  content: { padding: 16 },
  card: { backgroundColor: '#f9fafb', padding: 16, borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: '#eee' },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12, color: '#333' },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: '#ddd' },
  venueRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  venueName: { fontSize: 15, fontWeight: '600', color: '#000' },
  venueMeta: { fontSize: 12, color: '#666', marginTop: 2 },
  deleteBtn: { padding: 8 },
});

export default function Admin({ navigation }) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'Cantina', capacity: '' });

  const { data: venues = [], isLoading } = useQuery({
    queryKey: ['venues-admin'],
    queryFn: async () => {
      const snap = await getDocs(collection(db, 'venues'));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },
  });

  const handleAdd = async () => {
    if (!form.name || !form.capacity) return Alert.alert('Erro', 'Preencha todos os campos');
    setLoading(true);
    try {
      await addDoc(collection(db, 'venues'), {
        ...form,
        capacity: parseInt(form.capacity),
        crowdIndex: 0,
        currentCount: 0,
        trend: 'stable'
      });
      setForm({ name: '', category: 'Cantina', capacity: '' });
      queryClient.invalidateQueries(['venues-admin']);
      Alert.alert('Sucesso', 'Local adicionado com sucesso');
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleDelete = (id) => {
    Alert.alert('Eliminar', 'Tem certeza?', [
      { text: 'Não' },
      { text: 'Sim', style: 'destructive', onPress: async () => {
        await deleteDoc(doc(db, 'venues', id));
        queryClient.invalidateQueries(['venues-admin']);
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Administração</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Form para novo local */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Novo Local</Text>
          <TextInput
            placeholder="Nome do local"
            value={form.name}
            onChangeText={v => setForm({...form, name: v})}
            style={styles.input}
          />
          <TextInput
            placeholder="Capacidade máxima"
            value={form.capacity}
            onChangeText={v => setForm({...form, capacity: v})}
            keyboardType="numeric"
            style={styles.input}
          />
          <Button onPress={handleAdd} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : 'Adicionar Local'}
          </Button>
        </View>

        {/* Lista de locais existentes */}
        <Text style={styles.sectionTitle}>Gestão de Locais</Text>
        {isLoading ? <ActivityIndicator color="#000" /> : venues.map(v => (
          <View key={v.id} style={styles.venueRow}>
            <View style={{flex: 1}}>
              <Text style={styles.venueName}>{v.name}</Text>
              <Text style={styles.venueMeta}>{v.category} • Cap: {v.capacity}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(v.id)} style={styles.deleteBtn}>
              <Trash2 size={18} color="#ef4444" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
