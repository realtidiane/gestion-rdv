import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

export default function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ nom: user?.nom || '', prenom: user?.prenom || '', telephone: user?.telephone || '', photo: user?.photo || '' });
  const [newPhoto, setNewPhoto] = useState<string | null>(null);

  const selectPhoto = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 500,
        maxHeight: 500,
      });
      
      if (result.assets && result.assets[0]?.uri) {
        setNewPhoto(result.assets[0].uri);
        setForm({ ...form, photo: result.assets[0].uri });
      }
    } catch (e) {
      console.log('Error selecting photo:', e);
    }
  };

  const saveProfile = async () => {
    try {
      const dataToSend = {
        nom: form.nom,
        prenom: form.prenom,
        telephone: form.telephone,
        photo: form.photo,
      };
      const res = await API.put('/users/profile', dataToSend);
      
      // Update local user data in context
      setEditing(false);
      Alert.alert('Succès', 'Profil mis à jour');
    } catch (e: any) {
      Alert.alert('Erreur', e.response?.data?.message || 'Erreur');
    }
  };

  const currentPhoto = newPhoto || user?.photo;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={editing ? selectPhoto : undefined}>
        <Image 
          source={currentPhoto ? { uri: currentPhoto } : { uri: 'https://via.placeholder.com/120/2563EB/FFFFFF?text=Photo' }} 
          style={styles.avatar} 
        />
        {editing && <Text style={styles.changePhotoText}>Changer la photo</Text>}
      </TouchableOpacity>

      {editing ? (
        <>
          <TextInput style={styles.input} placeholder="Nom" placeholderTextColor="#666666" value={form.nom} onChangeText={v => setForm({ ...form, nom: v })} />
          <TextInput style={styles.input} placeholder="Prénom" placeholderTextColor="#666666" value={form.prenom} onChangeText={v => setForm({ ...form, prenom: v })} />
          <TextInput style={styles.input} placeholder="Téléphone" placeholderTextColor="#666666" value={form.telephone} onChangeText={v => setForm({ ...form, telephone: v })} />
          <TextInput style={styles.input} placeholder="URL Photo" placeholderTextColor="#666666" value={form.photo} onChangeText={v => setForm({ ...form, photo: v })} />
          <TouchableOpacity style={styles.btnSave} onPress={saveProfile}>
            <Text style={styles.btnText}>ENREGISTRER</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnCancel} onPress={() => { setEditing(false); setNewPhoto(null); }}>
            <Text style={styles.btnTextCancel}>ANNULER</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.name}>{user?.prenom} {user?.nom}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <Text style={styles.email}>{user?.telephone || 'Non renseigné'}</Text>
          <Text style={styles.role}>{user?.role === 'admin' ? 'Administrateur' : 'Client'}</Text>

          <TouchableOpacity style={styles.btnEdit} onPress={() => setEditing(true)}>
            <Text style={styles.btnText}>MODIFIER PROFIL</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity style={styles.btnLogout} onPress={logout}>
        <Text style={styles.btnText}>SE DÉCONNECTER</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 20, backgroundColor: '#F9FAFB' },
  avatar: { width: 120, height: 120, borderRadius: 60, marginTop: 30, backgroundColor: '#E5E7EB' },
  changePhotoText: { textAlign: 'center', color: '#2563EB', marginTop: 8, fontSize: 14 },
  name: { fontSize: 22, fontWeight: 'bold', marginTop: 15 },
  email: { color: '#6B7280', marginTop: 4 },
  role: { color: '#2563EB', marginTop: 8, fontWeight: '600' },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, width: '80%', marginTop: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  btnEdit: { backgroundColor: '#2563EB', padding: 14, borderRadius: 10, marginTop: 20, width: '80%', alignItems: 'center' },
  btnSave: { backgroundColor: '#10B981', padding: 14, borderRadius: 10, marginTop: 20, width: '80%', alignItems: 'center' },
  btnCancel: { backgroundColor: '#6B7280', padding: 14, borderRadius: 10, marginTop: 10, width: '80%', alignItems: 'center' },
  btnLogout: { backgroundColor: '#EF4444', padding: 15, borderRadius: 10, marginTop: 40, width: '80%', alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  btnTextCancel: { color: '#fff', fontWeight: 'bold' }
});