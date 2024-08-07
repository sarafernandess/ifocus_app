// ModeSelectionScreen.js

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../../constants/colors';
import Button from '../../components/Button';

const ModeSelectionScreen = () => {
  const navigation = useNavigation();

  const navigateToOfferHelp = () => {
    navigation.navigate('SubjectSelection', { mode: 'offer' }); // Navigate to offer help screen
  };

  const navigateToReceiveHelp = () => {
    navigation.navigate('SubjectSelection', { mode: 'receive' }); // Navigate to receive help screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Escolha seu modo</Text>
          <View style={styles.buttonContainer}>
            <Button
              title="Oferecer Ajuda"
              onPress={navigateToOfferHelp}
              style={{ backgroundColor: COLORS.primary }}
            />
            <Button
              title="Receber Ajuda"
              onPress={navigateToReceiveHelp}
              style={{ backgroundColor: COLORS.secondary, marginTop: 20 }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS.primary,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 40,
  },
});

export default ModeSelectionScreen;
