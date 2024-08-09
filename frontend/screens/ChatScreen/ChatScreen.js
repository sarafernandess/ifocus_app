import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { IconButton } from 'react-native-paper';
import { getAuth } from 'firebase/auth';
import api from '../../services/api';

const ChatScreen = ({ navigation }) => {
  const route = useRoute();
  const { helperId, helperName, helperPhoto } = route.params;
  const [messages, setMessages] = useState([
    { id: '1', text: 'Olá, como posso ajudar você?', sender: 'helper' },
    { id: '2', text: 'Oi, estou com uma dúvida sobre a matéria de matemática.', sender: 'user' },
    { id: '3', text: 'Claro! Qual é a sua dúvida?', sender: 'helper' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const userId = getAuth().currentUser.uid;

  const fetchMessages = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setMessages([
          { id: '1', text: 'Olá, como posso ajudar você?', sender: 'helper' },
          { id: '2', text: 'Oi, estou com uma dúvida sobre a matéria de matemática.', sender: 'user' },
          { id: '3', text: 'Claro! Qual é a sua dúvida?', sender: 'helper' },
        ]);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Erro ao buscar mensagens.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [helperId]);

  const handleSend = async () => {
    if (newMessage.trim()) {
      try {
        const updatedMessages = [...messages, { id: (messages.length + 1).toString(), text: newMessage, sender: 'user' }];
        setMessages(updatedMessages);
        setNewMessage('');
        setTimeout(() => {
          setMessages([...updatedMessages, { id: (updatedMessages.length + 1).toString(), text: 'Entendi, vou te ajudar com isso.', sender: 'helper' }]);
        }, 1000);
      } catch (err) {
        console.error('Error sending message:', err);
        setError('Erro ao enviar mensagem.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {helperPhoto ? (
          <Image source={{ uri: helperPhoto }} style={styles.photo} />
        ) : (
          <IconButton icon="account" size={40} style={styles.photoPlaceholder} />
        )}
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerName}>{helperName || 'Usuário'}</Text>
        </View>
      </View>
      {loading ? (
        <Text style={styles.loading}>Carregando mensagens...</Text>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={messages}
          renderItem={({ item }) => (
            <View style={[styles.messageContainer, item.sender === 'user' ? styles.userMessage : styles.helperMessage]}>
              <Text style={styles.message}>{item.text}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
          style={styles.messageList}
        />
      )}
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={() => alert('Função de anexar arquivos ainda não implementada')}>
          <IconButton icon="attachment" size={24} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Digite uma mensagem..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity onPress={handleSend}>
          <IconButton icon="send" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#f8f8f8',
  },
  photo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  photoPlaceholder: {
    marginRight: 10,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  loading: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  error: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  messageList: {
    flex: 1,
  },
  messageContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#e1ffc7',
  },
  helperMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
  },
  message: {
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 10,
    color: '#333',
  },
});

export default ChatScreen;
