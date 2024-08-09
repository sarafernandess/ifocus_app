import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Button, Card, IconButton, ActivityIndicator, List } from 'react-native-paper';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import api from '../../services/api';

const OfferHelpScreen = () => {
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const userId = getAuth().currentUser.uid;
  const isFocused = useIsFocused();

  const fetchData = async () => {
    setLoading(true);
    try {
      const helpersResponse = await api.get(`/disciplines/saved/helpers?user_id=${userId}`);
      // Simulando notificações para o usuário
      setNotifications([
        { id: '1', message: 'Você tem uma nova mensagem!' },
        { id: '2', message: 'Pedro avaliou sua ajuda em Cálculo' },
        { id: '2', message: 'Ana solicitou a sua ajuda em POO' },
      ]);
      setSelectedSubjects(helpersResponse.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Erro ao buscar dados.');
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
    navigation.navigate('Selecionar disciplinas', { 
      onReturn: (subjects) => setSelectedSubjects(subjects),
      selectedSubjects,
      courseId: "yvm1KcPdwS1i64VPsj9Y" // Substitua isso pelo ID do curso atual se disponível
    });
  };

  const handleNotificationPress = (notification) => {
    // Exemplo de navegação para a tela de detalhes da notificação
    Alert.alert('Notificação Clicada', notification.message);
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
      {notifications.length > 0 && (
        <View style={styles.notificationsContainer}>
          <Text style={styles.notificationsTitle}>Notificações:</Text>
          <FlatList
            data={notifications}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleNotificationPress(item)}>
                <Card style={styles.notificationCard}>
                  <Card.Content style={styles.notificationContent}>
                    <Text>{item.message}</Text>
                    <IconButton icon="chevron-right" size={20} />
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
          />
        </View>
      )}

      <View style={styles.header}>
        <Text style={styles.title}>Minhas Disciplinas (Modo Ajudador):</Text>
        <IconButton
          icon="pencil"
          size={20}
          onPress={handleEditSubjects}
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
        <View style={styles.selectedSubjectsContainer}>
          {selectedSubjects.map(subject => (
            <View key={subject.id} style={styles.subjectItem}>
              <Text style={styles.subjectText}>{subject.name}</Text>
            </View>
          ))}
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
  noSubjectsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noSubjectsText: {
    fontSize: 18,
    marginBottom: 20,
  },
  selectedSubjectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  subjectItem: {
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 8,
    margin: 5,
  },
  subjectText: {
    fontSize: 14,
  },
  notificationsContainer: {
    marginBottom: 20,
  },
  notificationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  notificationCard: {
    marginVertical: 8,
    backgroundColor: '#e0f7fa',
    borderRadius: 8,
  },
  notificationContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

export default OfferHelpScreen;
