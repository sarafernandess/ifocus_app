import React from 'react';
import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import COLORS from "../../constants/colors";
import Button from '../../components/Button';
import HeaderImage from '../../assets/images/IFOCUS-2.png';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebaseConfig';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Usuário logado:', user);
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
        Alert.alert('Erro', errorMessage);
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ alignItems: 'center', height: "100%", width: "100%" }}>
            {/* Cabeçalho com imagem */}
            <View style={styles.header}>
              <Image source={HeaderImage} style={styles.headerImage} />
              <Text style={styles.title}>Login</Text>
            </View>

            {/* Formulário */}
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={COLORS.grey}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor={COLORS.grey}
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
              />
              <View style={{ marginTop: "2%" }}>
                <Button
                  title="Entrar"
                  onPress={handleLogin}
                  filled={true}
                  style={{
                    width: "100%",
                    backgroundColor: COLORS.primary,
                    color: COLORS.white,
                  }}
                />
                <View style={{
                  flexDirection: "row",
                  marginTop: 12,
                  justifyContent: "center"
                }}>
                  <Text style={{
                    fontSize: 16,
                    color: COLORS.primary,
                  }}> Não possui uma conta? </Text>
                  <Pressable onPress={() => navigation.navigate("SignUp")}>
                    <Text style={{
                      fontSize: 16,
                      color: COLORS.green,
                      fontWeight: "bold",
                      marginLeft: 4
                    }}
                    >Cadastre-se</Text>
                  </Pressable>
                </View>
                <Pressable onPress={() => navigation.navigate("ResetPassword")}>
                  <Text style={styles.forgotPassword}>Esqueci minha senha</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  headerImage: {
    width: 500,
    height: 250,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 10,
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
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: COLORS.grey,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: COLORS.black,
  },
  forgotPassword: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.primary,
    textAlign: 'center',
  },
});

export default LoginScreen;
