import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, Image, SafeAreaView, 
  KeyboardAvoidingView, Platform, ScrollView, Pressable, Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-paper';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import COLORS from "../../constants/colors";
import Button from '../../components/Button';
import HeaderImage from '../../assets/images/IFOCUS-2.png';
import { createUserWithRole } from '../../services/firebaseConfig';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);

  // Esquema de validação com Yup
  const schema = yup.object().shape({
    name: yup.string().required("Nome é obrigatório"),
    email: yup.string()
      .email("E-mail inválido")
      .matches(/@aluno\.ifsp\.edu\.br$/, "Utilize o e-mail institucional (@aluno.ifsp.edu.br)")
      .required("E-mail é obrigatório"),
    phone: yup.string()
      .matches(/^\d{10,11}$/, "Telefone deve ter entre 10 e 11 números")
      .required("Telefone é obrigatório"),
    password: yup.string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .matches(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
      .matches(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
      .matches(/\d/, "A senha deve conter pelo menos um número"),
    confirmPassword: yup.string()
      .oneOf([yup.ref('password'), null], "As senhas não coincidem")
      .required("Confirmação de senha é obrigatória"),
  });

  // Hook do React Hook Form
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await createUserWithRole(data.email, data.name, data.password, data.phone, "student");
      Alert.alert("Cadastro realizado com sucesso!");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      Alert.alert("Erro", "Não foi possível realizar o cadastro. Tente novamente.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Image source={HeaderImage} style={styles.headerImage} />
            </View>

            {/* Formulário */}
            <View style={styles.form}>
            <Text style={styles.title}>Cadastre-se</Text>
              {/* Nome Completo */}
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label="Nome Completo"
                    mode="outlined"
                    value={value}
                    onChangeText={onChange}
                    style={styles.input}
                    error={!!errors.name}
                  />
                )}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

              {/* Telefone */}
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label="Telefone"
                    mode="outlined"
                    keyboardType="phone-pad"
                    value={value}
                    onChangeText={onChange}
                    style={styles.input}
                    error={!!errors.phone}
                  />
                )}
              />
              {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}

              {/* E-mail Institucional */}
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label="E-mail Institucional"
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                    style={styles.input}
                    error={!!errors.email}
                  />
                )}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

              {/* Senha */}
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label="Senha"
                    mode="outlined"
                    secureTextEntry={securePassword}
                    value={value}
                    onChangeText={onChange}
                    style={styles.input}
                    error={!!errors.password}
                    right={<TextInput.Icon icon={securePassword ? "eye-off" : "eye"} onPress={() => setSecurePassword(!securePassword)} />}
                  />
                )}
              />
              {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

              {/* Confirmar Senha */}
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label="Confirmar Senha"
                    mode="outlined"
                    secureTextEntry={secureConfirmPassword}
                    value={value}
                    onChangeText={onChange}
                    style={styles.input}
                    error={!!errors.confirmPassword}
                    right={<TextInput.Icon icon={secureConfirmPassword ? "eye-off" : "eye"} onPress={() => setSecureConfirmPassword(!secureConfirmPassword)} />}
                  />
                )}
              />
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}

              {/* Botão de Cadastro */}
              <Button title="Cadastrar" onPress={handleSubmit(onSubmit)} filled={true} style={styles.button} />

              {/* Link para Login */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Já possui uma conta?</Text>
                <Pressable onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.loginLink}>Login</Text>
                </Pressable>
              </View>

            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    alignItems: 'center',
  },
  headerImage: {
    width: 300,
    height: 180,
    // resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  form: { width: "100%", paddingHorizontal: 20, paddingBottom: 20 }, // Adicionado padding lateral
  input: { marginBottom: 10 },
  errorText: { color: "red", fontSize: 12, marginBottom: 10 },
  button: { marginTop: 10 },
  loginContainer: { flexDirection: "row", marginTop: 12, justifyContent: "center" },
  loginLink: { fontSize: 16, color: COLORS.green, fontWeight: "bold", marginLeft: 4 },
});

export default SignUpScreen;
