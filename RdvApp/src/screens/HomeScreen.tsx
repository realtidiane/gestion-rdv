import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function HomeScreen({ navigation }: any) {
  const { user } = useContext(AuthContext);
  const [rdvs, setRdvs] = useState<any[]>([]);

  const load = async () => {
    try {
      const res = await API.get('/rendezvous');
      setRdvs(res.data);
    } catch (e) { console.log(e); }
  };

  useEffect(() => {
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, [navigation]);

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'confirme': return '#10B981';
      case 'termine': return '#6B7280';
      case 'en_attente': return '#F59E0B';
      case 'annule': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const displayStatut = (item: any) => {
    if (item.statut === 'confirme') {
      const dateStr = item.date_rdv ? item.date_rdv.split('T')[0] : '';
      const timeStr = item.heure_rdv ? item.heure_rdv.substring(0, 5) : '';
      if (dateStr && timeStr) {
        const rdvDate = new Date(dateStr + 'T' + timeStr + ':00');
        const now = new Date();
        if (now.getTime() > rdvDate.getTime()) return 'terminé';
      }
    }
    return item.statut;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Bonjour {user?.prenom} </Text>
      <Text style={styles.subtitle}>Vos rendez-vous</Text>

      <FlatList
        data={rdvs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}
            onPress={() => navigation.navigate('RdvDetail', { id: item.id })}>
            <Text style={styles.service}>{item.service_nom || 'Service'}</Text>
            <Text>{item.date_rdv?.split('T')[0]} à {item.heure_rdv}</Text>
            <Text style={[styles.statut, { color: getStatutColor(displayStatut(item)) }]}>{displayStatut(item)}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Aucun rendez-vous</Text>}
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('NewRdv')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F9FAFB' },
  welcome: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  subtitle: { fontSize: 16, color: '#6B7280', marginVertical: 10 },
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#2563EB' },
  service: { fontWeight: 'bold', fontSize: 16 },
  statut: { marginTop: 4, fontWeight: '600' },
  empty: { textAlign: 'center', color: '#6B7280', marginTop: 30 },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#2563EB', width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', elevation: 5 },
  fabText: { color: '#fff', fontSize: 32 },
});