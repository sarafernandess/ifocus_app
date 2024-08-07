import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, Alert, Pressable } from 'react-native';
import { auth } from '../../services/firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import COLORS from '../../constants/colors';
import Button from '../../components/Button';

const ResetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert('Sucesso', 'Um email para redefinir sua senha foi enviado.');
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
        Alert.alert('Erro', errorMessage);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Redefinir Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={COLORS.grey}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <Button
          title="Enviar Email"
          onPress={handleResetPassword}
          filled={true}
          style={{
            width: "100%",
            backgroundColor: COLORS.primary,
            color: COLORS.white,
          }}
        />
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.goBack}>Voltar ao Login</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    width: "95%",
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.grey,
    marginBottom: 20,
    shadowRadius: 2,
    elevation: 3,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: COLORS.grey,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: COLORS.black,
  },
  goBack: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.primary,
  },
});

export default ResetPasswordScreen;
