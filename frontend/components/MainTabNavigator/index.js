// navigation/MainTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../../screens/HomeScreen';
import ModeSelectionScreen from '../../screens/ModeSelectionScreen';
import MessagesScreen from '../../screens/MessagesScreen';
import ProfileScreen from '../../screens/ProfileScreen';
import OfferHelpScreen from '../../screens/OfferHelpScreen';
import ReceiveHelpScreen from '../../screens/ReceiveHelpScreen';
import AdminPanelScreen from '../../screens/AdminPanelScreen/AdminPanelScreen';

const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Tela de receber ajuda" component={HomeScreen} />
      <Tab.Screen name="Tela do ajudador" component={OfferHelpScreen} />
      <Tab.Screen name="Mensagens" component={MessagesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Gerenciar cursos e disciplinas" component={AdminPanelScreen} />
    </Tab.Navigator>
  );
}

export default MainTabNavigator;
