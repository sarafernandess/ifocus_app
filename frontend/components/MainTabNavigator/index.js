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
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Editar Modo" component={ModeSelectionScreen} />
      <Tab.Screen name="Mensagens" component={MessagesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Admin" component={AdminPanelScreen} />
    </Tab.Navigator>
  );
}

export default MainTabNavigator;
