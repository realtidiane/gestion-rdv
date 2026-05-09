import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import API from '../services/api';

export default function RdvDetailScreen({ route, navigation }: any) {
  const { id } = route.params;
  const [rdv, setRdv] = useState<any>(null);

  useEffect(() => {
    API.get(`/rendezvous/${id}`).then(r => setRdv(r.data)).catch(e => console.log(e));
  }, [id]);

  const getDisplayStatut = () => {
    if (!rdv) return '';
    if (rdv.statut === 'confirme') {
      const dateStr = rdv.date_rdv ? rdv.date_rdv.split('T')[0] : '';
      const timeStr = rdv.heure_rdv ? rdv.heure_rdv.substring(0, 5) : '';
      if (dateStr && timeStr) {
        const rdvDate = new Date(dateStr + 'T' + timeStr + ':00');
        const now = new Date();
        if (now.getTime() > rdvDate.getTime()) return 'terminé';
      }
    }
    return rdv.statut;
  };

  const supprimer = () => {
    Alert.alert('Confirmation', 'Voulez-vous annuler ce rendez-vous ?', [
      { text: 'Non', style: 'cancel' },
      { text: 'Oui', style: 'destructive', onPress: async () => {
        try {
          await API.delete(`/rendezvous/${id}`);
          navigation.goBack();
        } catch (e: any) { Alert.alert('Erreur', e.response?.data?.message); }
      }}
    ]);
  };

  if (!rdv) return <View style={styles.container}><Text>Chargement...</Text></View>;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.service}>{rdv.service_nom || 'Service'}</Text>
        <Text style={styles.label}>Date: {rdv.date_rdv?.split('T')[0]}</Text>
        <Text style={styles.label}>Heure: {rdv.heure_rdv}</Text>
        <Text style={styles.label}>Statut: {getDisplayStatut()}</Text>
        {rdv.commentaire && <Text style={styles.label}>Commentaire: {rdv.commentaire}</Text>}
      </View>

      <TouchableOpacity style={styles.btnDelete} onPress={supprimer}>
        <Text style={styles.btnText}>ANNULER LE RDV</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F9FAFB' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, elevation: 2 },
  service: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#2563EB' },
  label: { fontSize: 16, marginBottom: 8, color: '#374151' },
  btnDelete: { backgroundColor: '#EF4444', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 30 },
  btnText: { color: '#fff', fontWeight: 'bold' }
});