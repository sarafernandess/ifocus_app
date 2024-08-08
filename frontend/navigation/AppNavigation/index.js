// navigation/AppNavigator/index.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import OfferHelpScreen from '../../screens/OfferHelpScreen';
import ReceiveHelpScreen from '../../screens/ReceiveHelpScreen';
import MainTabNavigator from '../../components/MainTabNavigator';
import ManageDisciplineScreen from '../../screens/AdminPanelScreen/ManageDisciplineScreen';
import SelectDisciplinesScreen from '../../screens/ReceiveHelpScreen/SelectDisciplinesScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen
          name="Main"
          component={MainTabNavigator}
          options={{ headerShown: false, gestureEnabled: true }}
        />
      {/* <Stack.Screen name="OfferHelp" component={OfferHelpScreen} />
      <Stack.Screen name="ReceiveHelp" component={ReceiveHelpScreen} /> */}
      <Stack.Screen name="ManageDisciplineScreen" component={ManageDisciplineScreen} />
      <Stack.Screen name="SelectDisciplinesScreen" component={SelectDisciplinesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;



