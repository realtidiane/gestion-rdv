import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import API from '../services/api';

interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: string;
  created_at: string;
}

export default function AdminUsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = () => {
    setLoading(true);
    setError(null);
    API.get('/users/admin/users')
      .then(r => {
        setUsers(r.data);
        setLoading(false);
      })
      .catch(e => {
        console.log('Error loading users:', e);
        const errMsg = e.response?.data?.message || e.message || 'Erreur de chargement';
        setError(errMsg);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateRole = (id: number, newRole: string) => {
    API.put(`/users/admin/users/${id}/role`, { role: newRole })
      .then(() => loadUsers())
      .catch(e => Alert.alert('Erreur', e.response?.data?.message || 'Erreur'));
  };

  const deleteUser = (id: number) => {
    Alert.alert('Confirmation', 'Supprimer cet utilisateur?', [
      { text: 'Non', style: 'cancel' },
      { text: 'Oui', style: 'destructive', onPress: () => {
        API.delete(`/users/admin/users/${id}`)
          .then(() => loadUsers())
          .catch(e => Alert.alert('Erreur', e.response?.data?.message || 'Erreur'));
      }}
    ]);
  };

  const renderItem = ({ item }: { item: User }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.prenom} {item.nom}</Text>
        <Text style={[styles.role, { color: item.role === 'admin' ? '#2563EB' : '#10B981' }]}>
          {item.role === 'admin' ? 'Admin' : 'Client'}
        </Text>
      </View>
      <Text style={styles.email}>{item.email}</Text>
      <Text style={styles.phone}>{item.telephone || 'Non renseigné'}</Text>
      <Text style={styles.date}>Inscrit le: {item.created_at?.split('T')[0]}</Text>
      
      <View style={styles.actions}>
        {item.role !== 'admin' && (
          <TouchableOpacity onPress={() => updateRole(item.id, 'admin')}>
            <Text style={styles.promoteBtn}>Promouvoir admin</Text>
          </TouchableOpacity>
        )}
        {item.role === 'admin' && item.role !== 'client' && (
          <TouchableOpacity onPress={() => updateRole(item.id, 'client')}>
            <Text style={styles.downgradeBtn}>Retirer admin</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => deleteUser(item.id)}>
          <Text style={styles.deleteBtn}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Chargement...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={loadUsers}>
          <Text style={styles.retryText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>Aucun utilisateur</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F9FAFB' },
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 12, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  role: { fontWeight: 'bold', fontSize: 14 },
  email: { color: '#6B7280' },
  phone: { color: '#6B7280', marginTop: 4 },
  date: { color: '#9CA3AF', fontSize: 12, marginTop: 8 },
  actions: { flexDirection: 'row', marginTop: 12, gap: 16 },
  promoteBtn: { color: '#2563EB', fontWeight: '600' },
  downgradeBtn: { color: '#F59E0B', fontWeight: '600' },
  deleteBtn: { color: '#EF4444', fontWeight: '600' },
  empty: { textAlign: 'center', color: '#6B7280', marginTop: 40 },
  loading: { textAlign: 'center', color: '#6B7280', marginTop: 40 },
  error: { textAlign: 'center', color: '#EF4444', marginTop: 40, padding: 20 },
  retryBtn: { backgroundColor: '#2563EB', padding: 12, borderRadius: 8, marginTop: 20, marginHorizontal: 40 },
  retryText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});