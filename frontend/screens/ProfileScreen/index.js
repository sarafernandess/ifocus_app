import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, 
  ScrollView, Alert, Keyboard, TouchableWithoutFeedback, Image 
} from 'react-native';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../services/firebaseConfig';
import { TextInput, Avatar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import COLORS from '../../constants/colors';

const ProfileScreen = () => {
  const auth = getAuth();
  const navigation = useNavigation();
  
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    photoURL: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.log('Nenhum documento encontrado!');
        }
      } else {
        navigation.replace('Welcome');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => console.log('Usuário deslogado'))
      .catch((error) => console.error('Erro ao deslogar:', error));
  };

  const saveProfileChanges = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, userData);
        Alert.alert('Sucesso', 'Alterações salvas com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
    }
  };

  // Função para escolher uma imagem
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setUserData({ ...userData, photoURL: result.assets[0].uri });
    }
  };

  // Função para remover a foto de perfil
  const removeImage = () => {
    setUserData({ ...userData, photoURL: '' });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>

          {/* Foto de Perfil */}
          <View style={styles.avatarContainer}>
            {userData.photoURL ? (
              <Avatar.Image size={100} source={{ uri: userData.photoURL }} />
            ) : (
              <Avatar.Icon size={100} icon="camera" />
            )}
            <View style={styles.avatarButtons}>
              <TouchableOpacity onPress={pickImage}>
                <Text style={styles.avatarText}>Alterar Foto</Text>
              </TouchableOpacity>
              {userData.photoURL ? (
                <TouchableOpacity onPress={removeImage}>
                  <Text style={styles.avatarText}>Remover Foto</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          {/* Nome */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Nome:</Text>
            <TextInput
              mode="outlined"
              value={userData.name}
              onChangeText={(text) => setUserData({ ...userData, name: text })}
              style={styles.input}
            />
          </View>

          {/* E-mail (Não editável) */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>E-mail:</Text>
            <TextInput
              mode="outlined"
              value={userData.email}
              editable={false} // Email não pode ser alterado
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          </View>

          {/* Telefone */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Telefone:</Text>
            <TextInput
              mode="outlined"
              value={userData.phone}
              keyboardType="phone-pad"
              onChangeText={(text) => setUserData({ ...userData, phone: text })}
              style={styles.input}
            />
          </View>

          {/* Botões */}
          <TouchableOpacity style={styles.saveButton} onPress={saveProfileChanges}>
            <Text style={styles.saveButtonText}>Salvar Alterações</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarButtons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  avatarText: {
    fontSize: 14,
    color: COLORS.primary,
    marginHorizontal: 10,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 5,
  },
  input: {
    backgroundColor: COLORS.white,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  logoutButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
});

export default ProfileScreen;
