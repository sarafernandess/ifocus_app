// navigation/AppNavigator/index.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { NavigationProvider } from '../NavigationContext'; // Atualize o caminho conforme necessário
import MainTabNavigator from '../../components/MainTabNavigator';
import ManageDisciplineScreen from '../../screens/AdminPanelScreen/ManageDisciplineScreen';
import SelectDisciplinesScreen from '../../screens/ReceiveHelpScreen/SelectDisciplinesScreen';
import SelectDisciplineToOfferHelp from '../../screens/OfferHelpScreen/SelectDisciplineToOfferHelp';
import AvailableHelpersScreen from '../../screens/ReceiveHelpScreen/AvailableHelpersScreen';
import ChatScreen from '../../screens/ChatScreen/ChatScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <NavigationProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen
            name="Home"
            component={MainTabNavigator}
            options={{ headerShown: false, gestureEnabled: true }}
          />
          <Stack.Screen name="Gerenciar disciplinas" component={ManageDisciplineScreen} />
          <Stack.Screen name="Selecionar curso e disciplinas" component={SelectDisciplinesScreen} />
          <Stack.Screen name="Selecionar disciplinas" component={SelectDisciplineToOfferHelp} />
          <Stack.Screen name="Encontrar alunos" component={AvailableHelpersScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationProvider>
  );
}

export default AppNavigator;
