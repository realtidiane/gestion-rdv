import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import API from '../services/api';
import { cancelRappel, scheduleRappel, sendImmediateNotification } from '../services/notifications';

interface Rdv {
  id: number;
  date_rdv: string;
  heure_rdv: string;
  statut: string;
  service_nom: string;
  user_nom: string;
  user_prenom: string;
  user_email: string;
  commentaire: string;
}

export default function AdminRdvsScreen() {
  const [rdvs, setRdvs] = useState<Rdv[]>([]);

  const loadRdvs = () => {
    API.get('/rendezvous/admin/all')
      .then(r => setRdvs(r.data))
      .catch(e => console.log(e));
  };

  useEffect(() => { loadRdvs(); }, []);

  const updateStatut = (item: Rdv, statut: string) => {
    API.put(`/rendezvous/admin/${item.id}/statut`, { statut })
.then(async () => {
        // Si confirmé, programmer le rappel 30min avant + notifier immédiatement
        if (statut === 'confirme') {
          // Annuler d'abord cualquier rappel existant
          await cancelRappel(item.id);
          
          // Envoyer notification immédiate de confirmation
          await sendImmediateNotification(
            'RDV confirmé',
            `Votre rendez-vous "${item.service_nom}" a été confirmé pour le ${item.date_rdv?.split('T')[0]} à ${item.heure_rdv?.substring(0, 5)}`
          );
          
          // Programmer rappel 30 min avant
          const timeStr = item.heure_rdv ? item.heure_rdv.substring(0, 5) : '00:00';
          await scheduleRappel(
            item.id,
            item.service_nom,
            item.date_rdv ? item.date_rdv.split('T')[0] : '',
            timeStr,
            30
          );
          Alert.alert('Succès', 'RDV confirmé. Notification immédiate + rappel 30min avant.');
        } else if (statut === 'annule') {
          await cancelRappel(item.id);
          await sendImmediateNotification(
            'RDV annulé',
            `Votre rendez-vous "${item.service_nom}" a été annulé.`
          );
          Alert.alert('Succès', 'RDV annulé.');
        }
        loadRdvs();
      })
      .catch(e => Alert.alert('Erreur', e.response?.data?.message || 'Erreur'));
  };

  const deleteRdv = (id: number) => {
    Alert.alert('Confirmation', 'Supprimer ce rendez-vous?', [
      { text: 'Non', style: 'cancel' },
      { text: 'Oui', style: 'destructive', onPress: async () => {
        await cancelRappel(id);
        API.delete(`/rendezvous/admin/${id}`)
          .then(() => loadRdvs())
          .catch(e => Alert.alert('Erreur', e.response?.data?.message || 'Erreur'));
      }}
    ]);
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'confirme': return '#10B981';
      case 'termine': return '#6B7280';
      case 'en_attente': return '#F59E0B';
      case 'annule': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const displayStatut = (item: Rdv) => {
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
      <FlatList
        data={rdvs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.serviceName}>{item.service_nom}</Text>
              <Text style={[styles.statut, { color: getStatutColor(displayStatut(item)) }]}>{displayStatut(item)}</Text>
            </View>
            <Text style={styles.client}>{item.user_prenom} {item.user_nom}</Text>
            <Text style={styles.email}>{item.user_email}</Text>
            <Text style={styles.date}>{item.date_rdv?.split('T')[0]} à {item.heure_rdv}</Text>
            {item.commentaire && <Text style={styles.commentaire}>"{item.commentaire}"</Text>}
            
            <View style={styles.actions}>
              {displayStatut(item) !== 'terminé' && item.statut !== 'confirme' && (
                <TouchableOpacity onPress={() => updateStatut(item, 'confirme')}>
                  <Text style={styles.confirmBtn}>Confirmer</Text>
                </TouchableOpacity>
              )}
              {displayStatut(item) !== 'terminé' && item.statut !== 'annule' && (
                <TouchableOpacity onPress={() => updateStatut(item, 'annule')}>
                  <Text style={styles.cancelBtn}>Annuler</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => deleteRdv(item.id)}>
                <Text style={styles.deleteBtn}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Aucun rendez-vous</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F9FAFB' },
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 12, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  serviceName: { fontSize: 18, fontWeight: 'bold', color: '#2563EB', flex: 1 },
  statut: { fontWeight: 'bold', textTransform: 'capitalize' },
  client: { fontSize: 16, fontWeight: '600' },
  email: { color: '#6B7280', fontSize: 14 },
  date: { marginTop: 8, fontWeight: '500' },
  commentaire: { marginTop: 8, fontStyle: 'italic', color: '#6B7280' },
  actions: { flexDirection: 'row', marginTop: 12, gap: 12 },
  confirmBtn: { color: '#10B981', fontWeight: 'bold' },
  cancelBtn: { color: '#F59E0B', fontWeight: 'bold' },
  deleteBtn: { color: '#EF4444', fontWeight: 'bold' },
  empty: { textAlign: 'center', color: '#6B7280', marginTop: 40, fontSize: 16 },
});