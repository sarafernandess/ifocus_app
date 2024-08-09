import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Button, Card, IconButton, ActivityIndicator } from 'react-native-paper';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import api from '../../services/api';

const HomeScreen = () => {
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const userId = getAuth().currentUser.uid;
  const isFocused = useIsFocused();

  const fetchData = async () => {
    setLoading(true);
    try {
      const seekersResponse = await api.get(`/disciplines/saved/seekers?user_id=${userId}`);
      setSelectedSubjects(seekersResponse.data);
    } catch (err) {
      console.error('Error fetching disciplines:', err);
      setError('Erro ao buscar disciplinas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  const handleEditSubjects = () => {
    navigation.navigate('Selecionar curso e disciplinas', { 
      onReturn: (subjects) => setSelectedSubjects(subjects),
      selectedSubjects,
      courseId: "yvm1KcPdwS1i64VPsj9Y" // Substitua pelo ID do curso atual se disponível
    });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minhas Disciplinas (Receber Ajuda):</Text>
        <IconButton
          icon="pencil"
          size={24}
          onPress={handleEditSubjects}
          style={styles.editIcon}
        />
      </View>

      {selectedSubjects.length === 0 ? (
        <View style={styles.noSubjectsContainer}>
          <Text style={styles.noSubjectsText}>Nenhuma disciplina selecionada</Text>
          <Button mode="contained" onPress={handleEditSubjects}>
            Adicionar Matéria
          </Button>
        </View>
      ) : (
        <FlatList
          data={selectedSubjects}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.cardText}>{item.name}</Text>
              </Card.Content>
            </Card>
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <Button
        mode="text"
        onPress={() => navigation.navigate('Encontrar alunos')}
        style={styles.viewHelpersButton}
        labelStyle={styles.viewHelpersLabel}
      >
        Ver Pessoas Disponíveis para Ajudar
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  editIcon: {
    marginRight: 10, // Margem direita para afastar o ícone do canto
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
  card: {
    marginVertical: 8,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  cardText: {
    fontSize: 14,
  },
  listContainer: {
    flexGrow: 1,
  },
  viewHelpersButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
  viewHelpersLabel: {
    fontSize: 16,
    color: '#1e90ff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
