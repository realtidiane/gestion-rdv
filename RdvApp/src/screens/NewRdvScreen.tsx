import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import API from '../services/api';
import { initNotifications } from '../services/notifications';

interface Service {
  id: number;
  nom: string;
  prix: number;
  description?: string;
}

interface Props {
  navigation: any;
}

export default function NewRdvScreen({ navigation }: Props) {
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [date, setDate] = useState(new Date());
  const [heure, setHeure] = useState(new Date());
  const [showD, setShowD] = useState(false);
  const [showH, setShowH] = useState(false);
  const [comm, setComm] = useState('');

  useEffect(() => {
    API.get('/services')
      .then((r) => setServices(r.data))
      .catch((e) => console.log(e));
    initNotifications().catch(e => console.log('Notification init error:', e));
  }, []);

  const submit = async () => {
    if (!serviceId) return Alert.alert('Erreur', 'Choisissez un service');
    
    try {
      await API.post('/rendezvous', {
        service_id: serviceId,
        date_rdv: date.toISOString().split('T')[0],
        heure_rdv: heure.toTimeString().split(' ')[0],
        commentaire: comm,
      });
      
      Alert.alert('Succès', 'RDV créé en attente de validation');
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Erreur', e.response?.data?.message || e.message);
    }
  };

  const isSelected = (id: number) => serviceId === id;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Service</Text>
      {services.map((s) => (
        <TouchableOpacity
          key={s.id}
          style={[styles.opt, isSelected(s.id) && styles.optActive]}
          onPress={() => setServiceId(s.id)}
        >
          <Text style={isSelected(s.id) ? styles.optTextActive : undefined}>
            {s.nom}
          </Text>
          <Text style={isSelected(s.id) ? styles.prixActive : styles.prix}>
            {s.prix || 0} Fcfa
          </Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>Date</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowD(true)}>
        <Text>{date.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showD && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event: any, selectedDate?: Date) => {
            setShowD(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Heure</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowH(true)}>
        <Text>{heure.toLocaleTimeString()}</Text>
      </TouchableOpacity>
      {showH && (
        <DateTimePicker
          value={heure}
          mode="time"
          display="default"
          onChange={(event: any, selectedTime?: Date) => {
            setShowH(false);
            if (selectedTime) setHeure(selectedTime);
          }}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Commentaire (optionnel)"
        placeholderTextColor="#666666"
        value={comm}
        onChangeText={setComm}
        multiline
      />

      <TouchableOpacity style={styles.btn} onPress={submit}>
        <Text style={styles.btnText}>VALIDER</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F9FAFB' },
  label: { fontWeight: 'bold', marginTop: 16, marginBottom: 8, fontSize: 16 },
  opt: { padding: 14, backgroundColor: '#fff', borderRadius: 10, marginBottom: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  optActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  optTextActive: { color: '#fff', fontWeight: 'bold' },
  prix: { color: '#6B7280', marginTop: 4 },
  prixActive: { color: '#fff', marginTop: 4 },
  input: { backgroundColor: '#fff', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 12 },
  btn: { backgroundColor: '#2563EB', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 20, marginBottom: 40 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});