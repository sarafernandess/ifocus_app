import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import Button from '../../components/Button';
import COLORS from '../../constants/colors';

const OfferHelpScreen = () => {
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const onSelectedItemsChange = (selectedItems) => {
    setSelectedSubjects(selectedItems);
  };

  const handleOfferHelp = () => {
    // Lógica para salvar o usuário como disponível para ajudar com as disciplinas selecionadas
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.content}>
          <MultiSelect
            items={[ /* Lista de disciplinas obtidas da API */ ]}
            uniqueKey="id"
            onSelectedItemsChange={onSelectedItemsChange}
            selectedItems={selectedSubjects}
            selectText="Escolha as disciplinas"
            searchInputPlaceholderText="Buscar disciplinas..."
            styleMainWrapper={styles.multiSelectWrapper}
            styleDropdownMenuSubsection={styles.multiSelectDropdown}
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
  multiSelectWrapper: {
    width: '100%',
    marginBottom: 20, // Espaço abaixo do MultiSelect
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

export default OfferHelpScreen;
