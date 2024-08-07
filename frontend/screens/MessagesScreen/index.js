// MessageScreen.js

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../../constants/colors';

const MessagesScreen = () => {
  const navigation = useNavigation();

  // Exemplo de dados de mensagens
  const messagesData = [
    { id: '1', sender: 'Pedro', message: 'Olá, tudo bem?' },
    { id: '2', sender: 'Maria', message: 'Oi, estou interessado em ajuda com matemática.' },
    { id: '3', sender: 'João', message: 'Posso te ajudar com desenvolvimento web.' },
    // Adicione mais mensagens conforme necessário
  ];

  // Função para navegar para a tela de conversa detalhada
  const navigateToConversation = (message) => {
    // Aqui você pode navegar para a tela de conversa passando informações relevantes, como o ID da conversa ou dados do usuário
    navigation.navigate('Conversation', { message });
  };

  // Componente para renderizar cada item da lista de mensagens
  const renderMessageItem = ({ item }) => (
    <TouchableOpacity style={styles.messageItem} onPress={() => navigateToConversation(item)}>
      <Text style={styles.senderName}>{item.sender}</Text>
      <Text style={styles.messageText}>{item.message}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Mensagens</Text>
        <FlatList
          data={messagesData}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          style={styles.messageList}
        />
        <Button title="Back" onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
  },
  messageList: {
    flex: 1,
    width: '100%',
  },
  messageItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey,
  },
  senderName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  messageText: {
    fontSize: 16,
    color: COLORS.black,
    marginTop: 5,
  },
});

export default MessagesScreen;
