import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import MultiSelect from 'react-native-multiple-select';

const ReceiveHelpScreen = () => {
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const onSelectedItemsChange = (selectedItems) => {
    setSelectedSubjects(selectedItems);
  };

  const handleReceiveHelp = () => {
    // Lógica para salvar o usuário como alguém que quer receber ajuda nas disciplinas selecionadas
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecione as disciplinas que deseja receber ajuda:</Text>
      <MultiSelect
        items={[ /* Lista de disciplinas obtidas da API */ ]}
        uniqueKey="id"
        onSelectedItemsChange={onSelectedItemsChange}
        selectedItems={selectedSubjects}
        selectText="Escolha as disciplinas"
        searchInputPlaceholderText="Buscar disciplinas..."
        // Outras configurações do MultiSelect
      />
      <Button title="Confirmar" onPress={handleReceiveHelp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default ReceiveHelpScreen;
