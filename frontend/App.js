import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AppNavigator from './navigation/AppNavigation';
import AuthNavigator from './navigation/AuthNavigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper'; // Importando o DefaultTheme
import { NavigationProvider } from './navigation/NavigationContext';

// Crie um tema customizado com a cor primária desejada
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#13BE96', // Define a cor primária
  },
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      </View>
    );
  }

  return (
    <NavigationProvider>
      <PaperProvider theme={theme}>
        {user ? <AppNavigator /> : <AuthNavigator />}
      </PaperProvider>
    </NavigationProvider>
  );
}
