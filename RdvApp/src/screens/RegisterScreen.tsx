import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import API from '../services/api';

export default function RegisterScreen({ navigation }: any) {
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', telephone: '', password: '' });

  const handleRegister = async () => {
    try {
      await API.post('/auth/register', form);
      Alert.alert('Succès', 'Inscription réussie');
      navigation.navigate('Login');
    } catch (err: any) {
      Alert.alert('Erreur', err.response?.data?.message || 'Erreur');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Inscription</Text>
      {['nom', 'prenom', 'email', 'telephone', 'password'].map(f => (
        <TextInput key={f} style={styles.input} placeholder={f} placeholderTextColor="#666666"
          value={form[f as keyof typeof form]} onChangeText={v => setForm({ ...form, [f]: v })}
          secureTextEntry={f === 'password'} autoCapitalize="none" />
      ))}
      <TouchableOpacity style={styles.btn} onPress={handleRegister}>
        <Text style={styles.btnText}>S'INSCRIRE</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 60, backgroundColor: '#F9FAFB', flexGrow: 1, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 25, color: '#2563EB' },
  input: { backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  btn: { backgroundColor: '#10B981', padding: 15, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
});