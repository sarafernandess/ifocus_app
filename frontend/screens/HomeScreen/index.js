import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Text, Switch } from 'react-native';
import MultiSelect from 'react-native-multiple-select'; // Assegure-se de que o componente está instalado e importado
import Button from '../../components/Button';
import COLORS from '../../constants/colors';

const HomeScreen = () => {
  const [isOfferingHelp, setIsOfferingHelp] = useState(false);
  const [isReceivingHelp, setIsReceivingHelp] = useState(false);
  const [selectedOfferSubjects, setSelectedOfferSubjects] = useState([]);
  const [selectedReceiveSubjects, setSelectedReceiveSubjects] = useState([]);

  const onOfferSelectedItemsChange = (selectedItems) => {
    setSelectedOfferSubjects(selectedItems);
  };

  const onReceiveSelectedItemsChange = (selectedItems) => {
    setSelectedReceiveSubjects(selectedItems);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.content}>
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Oferecer Ajuda</Text>
            <Switch
              value={isOfferingHelp}
              onValueChange={(value) => setIsOfferingHelp(value)}
              thumbColor={COLORS.white}
              trackColor={{ false: COLORS.grey, true: COLORS.primary }}
            />
          </View>
          {isOfferingHelp && (
            <MultiSelect
              items={[ /* Lista de disciplinas obtidas da API */ ]}
              uniqueKey="id"
              onSelectedItemsChange={onOfferSelectedItemsChange}
              selectedItems={selectedOfferSubjects}
              selectText="Escolha as disciplinas para oferecer ajuda"
              searchInputPlaceholderText="Buscar disciplinas..."
              styleMainWrapper={styles.multiSelectWrapper}
              styleDropdownMenuSubsection={styles.multiSelectDropdown}
            />
          )}

          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Receber Ajuda</Text>
            <Switch
              value={isReceivingHelp}
              onValueChange={(value) => setIsReceivingHelp(value)}
              thumbColor={COLORS.white}
              trackColor={{ false: COLORS.grey, true: COLORS.primary }}
            />
          </View>
          {isReceivingHelp && (
            <MultiSelect
              items={[ /* Lista de disciplinas obtidas da API */ ]}
              uniqueKey="id"
              onSelectedItemsChange={onReceiveSelectedItemsChange}
              selectedItems={selectedReceiveSubjects}
              selectText="Escolha as disciplinas para receber ajuda"
              searchInputPlaceholderText="Buscar disciplinas..."
              styleMainWrapper={styles.multiSelectWrapper}
              styleDropdownMenuSubsection={styles.multiSelectDropdown}
            />
          )}

          <Button
            title="Confirmar"
            onPress={() => {
              // Lógica para confirmar as seleções
              console.log('Oferecer Ajuda:', selectedOfferSubjects);
              console.log('Receber Ajuda:', selectedReceiveSubjects);
            }}
            style={styles.confirmButton}
            textColor={COLORS.white}
          />
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
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  toggleLabel: {
    fontSize: 18,
    marginRight: 10,
    color: COLORS.primary,
  },
  multiSelectWrapper: {
    width: '100%',
    marginVertical: 20, // Espaço entre o MultiSelect e o Toggle
  },
  multiSelectDropdown: {
    backgroundColor: COLORS.white,

    padding: 10,
  },
  confirmButton: {
    backgroundColor: COLORS.green,
    width: '100%',
  },
});

export default HomeScreen;
