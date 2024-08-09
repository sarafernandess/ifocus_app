import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AppNavigator from './navigation/AppNavigation';
import AuthNavigator from './navigation/AuthNavigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Provider as PaperProvider } from 'react-native-paper'; // Importe o Provider
import { NavigationProvider } from './navigation/NavigationContext'; // Importe o NavigationProvider

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
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationProvider>
      <PaperProvider>
        {user ? <AppNavigator /> : <AuthNavigator />}
      </PaperProvider>
    </NavigationProvider>
  );
}
