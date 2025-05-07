// navigation/AppNavigator/index.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../../screens/LoginScreen';
import WelcomeScreen from '../../screens/WelcomeScreen';
import ResetPasswordScreen from '../../screens/ResetPasswordScreen';
import SignUpScreen from '../../screens/SignUpScreen';

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
          options={{ gestureEnabled: true, headerShown: false }} 
        />
        <Stack.Screen 
          name="SignUp" 
          component={SignUpScreen} 
          options={{ gestureEnabled: true }} 
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



