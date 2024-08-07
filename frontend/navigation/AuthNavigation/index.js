// navigation/AppNavigator/index.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../../screens/LoginScreen';
import SignupScreen from '../../screens/SignupScreen';
import WelcomeScreen from '../../screens/WelcomeScreen';
import ResetPasswordScreen from '../../screens/ResetPasswordScreen';
import MainTabNavigator from '../../components/MainTabNavigator';

const Stack = createNativeStackNavigator();

function AuthNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ gestureEnabled: false }} 
        />
        <Stack.Screen 
          name="SignUp" 
          component={SignupScreen} 
          options={{headerShown: true, gestureEnabled: true }} 
        />
        <Stack.Screen 
          name="ResetPassword" 
          component={ResetPasswordScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AuthNavigator;



