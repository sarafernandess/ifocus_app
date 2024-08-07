import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../services/firebaseConfig';
import { CommonActions } from '@react-navigation/native';
import COLORS from '../../constants/colors'

const ProfileScreen = () => {
  const auth = getAuth();
  const navigation = useNavigation();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    subjects: [],
    rating: 0,
  });

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('Usuário deslogado');
      })
      .catch((error) => {
        console.error('Erro ao deslogar:', error);
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.log('No such document!');
        }
      } else {
        navigation.replace('Welcome');
      }
    });

    return () => unsubscribe();
  }, []);

  const saveProfileChanges = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, userData);
        Alert.alert('Sucesso', 'Alterações salvas com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar alterações: ', error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Perfil</Text>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Nome:</Text>
            <TextInput
              style={styles.input}
              value={userData.name}
              onChangeText={(text) => setUserData({ ...userData, name: text })}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>E-mail:</Text>
            <TextInput
              style={styles.input}
              value={userData.email}
              editable={false} // Email não editável
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Matérias de Interesse:</Text>
            <TextInput
              style={styles.input}
              value={userData.subjects ? userData.subjects.join(', ') : ''}
              onChangeText={(text) => setUserData({ ...userData, subjects: text.split(', ') })}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Avaliação:</Text>
            <Text style={styles.rating}>
              {userData.rating !== undefined ? userData.rating.toFixed(1) : 'N/A'}
            </Text>
          </View>
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
    height: 40,
    borderColor: COLORS.grey,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: COLORS.black,
  },
  rating: {
    fontSize: 18,
    color: COLORS.black,
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
