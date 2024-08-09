import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { List, ActivityIndicator, IconButton } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import api from '../../services/api';

const AvailableHelpersScreen = ({ navigation }) => {
  const [availableHelpers, setAvailableHelpers] = useState([]);
  const [filteredHelpers, setFilteredHelpers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const userId = getAuth().currentUser.uid;
  const isFocused = useIsFocused();

  const fetchHelpers = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/disciplines/saved/helpers?user_id=${userId}`);
      setAvailableHelpers(response.data);
      setFilteredHelpers(response.data); // Set filtered helpers initially
    } catch (err) {
      console.error('Error fetching helpers:', err);
      setError('Erro ao buscar pessoas disponíveis para ajudar.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchHelpers();
    }
  }, [isFocused]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = availableHelpers.filter(helper =>
      helper.name.toLowerCase().includes(query.toLowerCase()) ||
      (helper.subjects && helper.subjects.some(subject =>
        subject.toLowerCase().includes(query.toLowerCase())
      ))
    );
    setFilteredHelpers(filtered);
  };

  const handleMessagePress = (helperId) => {
    // Navigate to chat screen with the selected helper
    navigation.navigate('Chat', { helperId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pessoas Disponíveis para Ajudar:</Text>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Digite um nome ou disciplina"
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <TouchableOpacity style={styles.filterButton}>
          <IconButton
            icon="filter"
            size={20}
            color="#333"
            onPress={() => {/* Função para filtrar por matéria */}}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <IconButton
            icon="magnify"
            size={20}
            color="#333"
            onPress={() => {/* Função para pesquisa */}}
          />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator animating={true} size="large" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : filteredHelpers.length === 0 ? (
        <Text style={styles.noHelpersText}>
          Não há pessoas para te ajudar nas matérias selecionadas.
        </Text>
      ) : (
        <FlatList
          data={filteredHelpers}
          renderItem={({ item }) => (
            <View style={styles.helperContainer}>
              <List.Item
                key={item.id}
                title={item.name}
                description={(item.subjects && Array.isArray(item.subjects)) ? item.subjects.join(', ') : 'Nenhuma disciplina'}
                left={() => <List.Icon icon="account" color="#333" />}
                style={styles.listItem}
                titleStyle={styles.listItemTitle}
                descriptionStyle={styles.listItemDescription}
              />
              <IconButton
                icon="message"
                size={20}
                color="#333"
                style={styles.messageIcon}
                onPress={() => handleMessagePress(item.id)}
              />
            </View>
          )}
          keyExtractor={item => item.id}
        />
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#333',
  },
  filterButton: {
    marginLeft: 10,
  },
  noHelpersText: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
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
  errorText: {
    color: 'red',
  },
  helperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#e0f7fa',
    borderRadius: 8,
  },
  listItem: {
    flex: 1,
  },
  listItemTitle: {
    color: '#333',
  },
  listItemDescription: {
    color: '#333',
  },
  messageIcon: {
    marginLeft: 10,
  },
});

export default AvailableHelpersScreen;
