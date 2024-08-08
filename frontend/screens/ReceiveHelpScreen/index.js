import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const ReceiveHelpScreen = () => {
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [availableHelpers, setAvailableHelpers] = useState([]);
  const navigation = useNavigation();

  const handleAddSubjects = () => {
    navigation.navigate('SelectDisciplinesScreen', { onReturn: (subjects) => setSelectedSubjects(subjects) });
  };

  return (
    <View style={styles.container}>
      {selectedSubjects.length === 0 ? (
        <View style={styles.noSubjectsContainer}>
          <Text style={styles.noSubjectsText}>Nenhuma disciplina selecionada</Text>
          <Button mode="contained" onPress={handleAddSubjects}>
            Adicionar Matéria
          </Button>
        </View>
      ) : (
        <View>
          <Text style={styles.title}>Disciplinas Selecionadas:</Text>
          {selectedSubjects.map(subject => (
            <List.Item
              key={subject.id}
              title={subject.name}
              left={() => <List.Icon icon="book" />}
            />
          ))}

          {availableHelpers.length === 0 ? (
            <Text style={styles.noHelpersText}>
              Não há pessoas para te ajudar nas matérias selecionadas.
            </Text>
          ) : (
            <View>
              <Text style={styles.title}>Pessoas Disponíveis para Ajudar:</Text>
              {availableHelpers.map(helper => (
                <List.Item
                  key={helper.id}
                  title={helper.name}
                  description={helper.subjects.join(', ')}
                  left={() => <List.Icon icon="account" />}
                />
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  noSubjectsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noSubjectsText: {
    fontSize: 18,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noHelpersText: {
    marginTop: 20,
    fontSize: 16,
    color: 'red',
  },
});

export default ReceiveHelpScreen;
