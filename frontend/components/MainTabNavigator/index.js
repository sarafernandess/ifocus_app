import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../../screens/HomeScreen';
import OfferHelpScreen from '../../screens/OfferHelpScreen';
import MessagesScreen from '../../screens/MessagesScreen';
import ProfileScreen from '../../screens/ProfileScreen';
import AdminPanelScreen from '../../screens/AdminPanelScreen/AdminPanelScreen';
import { getAuth } from 'firebase/auth';
import COLORS from '../../constants/colors';

const Tab = createBottomTabNavigator();

// Obtendo dimensões da tela
const screenHeight = Dimensions.get('window').height;
const headerHeight = screenHeight * 0.14; // 14% da altura da tela

// Componente do Header Personalizado
const CustomHeader = () => {
  const user = getAuth().currentUser;

  return (
    <View style={styles.header}>
      {/* Texto de boas-vindas alinhado à esquerda */}
      <Text style={styles.welcomeText}>
        Olá, {user?.displayName || 'Usuário'}!
      </Text>

      {/* Ícone da imagem de perfil alinhado à direita */}
      <Image
        source={user?.photoURL ? { uri: user.photoURL } : require('../../assets/images/IFOCUS.png')}
        style={styles.profileImage}
      />
    </View>
  );
};

// Componente do Header Simples para a Tela de Perfil
const ProfileHeader = () => (
  <View style={styles.profileHeader}>
    <Text style={styles.profileHeaderText}>Perfil</Text>
  </View>
);

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerTitle: () => <CustomHeader />, // Define o Header padrão
        headerStyle: { height: headerHeight, backgroundColor: COLORS.green2 }, // Altura responsiva do header
      }}
    >
      <Tab.Screen name="Tela de receber ajuda" component={HomeScreen} />
      <Tab.Screen name="Tela do ajudador" component={OfferHelpScreen} />
      <Tab.Screen name="Mensagens" component={MessagesScreen} />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          headerTitle: () => <ProfileHeader />, // Apenas título "Perfil"
          headerStyle: { height: headerHeight, backgroundColor: COLORS.green2 }, // Mantém a cor do header
        }} 
      />
      <Tab.Screen name="Gerenciar cursos e disciplinas" component={AdminPanelScreen} />
    </Tab.Navigator>
  );
}

// Estilos do Header
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    width: '100%',
    height: '100%',
  },
  welcomeText: {
    fontSize: screenHeight > 700 ? 22 : 20,
    fontWeight: 'bold',
    color: '#333',
  },
  profileImage: {
    width: screenHeight > 700 ? 65 : 55,
    height: screenHeight > 700 ? 65 : 55,
    borderRadius: screenHeight > 700 ? 32.5 : 27.5,
    borderWidth: 2,
    borderColor: '#13BE96',
  },
  // Estilo do Header na tela Profile
  profileHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  profileHeaderText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default MainTabNavigator;
