import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput, Modal } from 'react-native';
import API from '../services/api';

interface Service {
  id: number;
  nom: string;
  description: string;
  duree: number;
  prix: string;
}

export default function AdminServicesScreen() {
  const [services, setServices] = useState<Service[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ nom: '', description: '', duree: '', prix: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  const loadServices = () => {
    API.get('/services').then(r => setServices(r.data)).catch(e => console.log(e));
  };

  useEffect(() => { loadServices(); }, []);

  const handleSave = async () => {
    if (!form.nom || !form.prix) {
      Alert.alert('Erreur', 'Nom et prix requis');
      return;
    }
    try {
      const data = {
        nom: form.nom,
        description: form.description,
        duree: parseInt(form.duree) || 30,
        prix: parseFloat(form.prix),
      };
      if (editingId) {
        await API.put(`/services/${editingId}`, data);
      } else {
        await API.post('/services', data);
      }
      setModalVisible(false);
      setForm({ nom: '', description: '', duree: '', prix: '' });
      setEditingId(null);
      loadServices();
    } catch (e: any) {
      Alert.alert('Erreur', e.response?.data?.message || 'Erreur');
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert('Confirmation', 'Supprimer ce service?', [
      { text: 'Non', style: 'cancel' },
      { text: 'Oui', style: 'destructive', onPress: async () => {
        try {
          await API.delete(`/services/${id}`);
          loadServices();
        } catch (e: any) {
          Alert.alert('Erreur', e.response?.data?.message || 'Erreur');
        }
      }}
    ]);
  };

  const openEdit = (s: Service) => {
    setForm({ nom: s.nom, description: s.description || '', duree: s.duree.toString(), prix: s.prix });
    setEditingId(s.id);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.empty}>Aucun service</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.serviceName}>{item.nom}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.info}>{item.duree} min | {item.prix} Fcfa</Text>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity onPress={() => openEdit(item)}>
                <Text style={styles.editText}>Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addBtn} onPress={() => { setEditingId(null); setForm({ nom: '', description: '', duree: '', prix: '' }); setModalVisible(true); }}>
        <Text style={styles.addBtnText}>+ Ajouter un service</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingId ? 'Modifier' : 'Nouveau'} Service</Text>
            <TextInput style={styles.input} placeholder="Nom" placeholderTextColor="#666666" value={form.nom} onChangeText={v => setForm({ ...form, nom: v })} />
            <TextInput style={styles.input} placeholder="Description" placeholderTextColor="#666666" value={form.description} onChangeText={v => setForm({ ...form, description: v })} />
            <TextInput style={styles.input} placeholder="Durée (min)" placeholderTextColor="#666666" keyboardType="numeric" value={form.duree} onChangeText={v => setForm({ ...form, duree: v })} />
            <TextInput style={styles.input} placeholder="Prix (Fcfa)" placeholderTextColor="#666666" keyboardType="numeric" value={form.prix} onChangeText={v => setForm({ ...form, prix: v })} />
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>ENREGISTRER</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelBtnText}>ANNULER</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F9FAFB' },
  listContent: { flexGrow: 1 },
  addBtn: { backgroundColor: '#2563EB', padding: 14, borderRadius: 10, marginTop: 16 },
  addBtnText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 10, elevation: 2 },
  cardContent: { flex: 1 },
  serviceName: { fontSize: 18, fontWeight: 'bold', color: '#2563EB' },
  description: { color: '#6B7280', marginTop: 4 },
  info: { marginTop: 8, fontWeight: '600' },
  cardActions: { flexDirection: 'row', marginTop: 10, gap: 16 },
  editText: { color: '#2563EB', fontWeight: '600' },
  deleteText: { color: '#EF4444', fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 12 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { backgroundColor: '#F3F4F6', padding: 12, borderRadius: 8, marginBottom: 10 },
  saveBtn: { backgroundColor: '#10B981', padding: 14, borderRadius: 8, marginTop: 10 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  cancelBtn: { backgroundColor: '#6B7280', padding: 14, borderRadius: 8, marginTop: 10 },
  cancelBtnText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
});