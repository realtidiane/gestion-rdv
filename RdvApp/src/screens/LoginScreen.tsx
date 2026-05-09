import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    try {
      const res = await API.post('/auth/login', { email, password });
      await login(res.data.token, res.data.user);
    } catch (err: any) {
      console.log('Login error:', err);
      const message = err.response?.data?.message || err.message || 'Connexion échouée';
      Alert.alert('Erreur', message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#666666" value={email}
        onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Mot de passe" placeholderTextColor="#666666" value={password}
        onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>SE CONNECTER</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Pas de compte ? S'inscrire</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, justifyContent: 'center', backgroundColor: '#F9FAFB' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: '#2563EB' },
  input: { backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  btn: { backgroundColor: '#2563EB', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  link: { textAlign: 'center', marginTop: 20, color: '#2563EB' },
});

const inputStyles = StyleSheet.create({
  placeholder: { color: '#9CA3AF' },
});