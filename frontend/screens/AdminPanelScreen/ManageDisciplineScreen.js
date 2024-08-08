import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Text,
  ActivityIndicator,
  Modal,
  Button,
  TextInput,
  List,
  FAB,
  Portal,
  Dialog,
  Paragraph,
  Menu,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import api from '../../services/api';
import COLORS from '../../constants/colors';
import { useRoute } from '@react-navigation/native';

const ManageDisciplineScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { courseId } = route.params;

  const [disciplines, setDisciplines] = useState([]);
  const [disciplineModalVisible, setDisciplineModalVisible] = useState(false);
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);
  const [disciplineName, setDisciplineName] = useState('');
  const [disciplineCode, setDisciplineCode] = useState('');
  const [semesterNumber, setSemesterNumber] = useState('');
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDisciplines();
  }, [courseId]);

  const fetchDisciplines = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/courses/${courseId}/disciplines`);
      setDisciplines(response.data);
    } catch (error) {
      console.error('Error fetching disciplines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDiscipline = async () => {
    try {
      const id = null
      const response = await api.post(`/admin/courses/${courseId}/disciplines`, {
        id: id,
        name: disciplineName,
        code: disciplineCode,
        semester: semesterNumber,
      });
      if (response.status === 201) {
        Alert.alert('Sucesso', `Disciplina criada com ID: ${response.data.id}`);
        setDisciplineModalVisible(false);
        setDisciplines([...disciplines, response.data]);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao criar disciplina');
      console.error('Error creating discipline:', error);
    }
  };

  const handleRemoveDiscipline = async () => {
    try {
      await api.delete(`/courses/${courseId}/disciplines/${selectedDiscipline.id}`);
      Alert.alert('Sucesso', 'Disciplina removida com sucesso');
      setDisciplines(disciplines.filter(discipline => discipline.id !== selectedDiscipline.id));
      setDeleteConfirmationVisible(false);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao remover disciplina');
      console.error('Error removing discipline:', error);
    }
  };

  const handleEditDiscipline = async () => {
    try {
      await api.put(`/courses/${courseId}/disciplines/${selectedDiscipline.id}`, { name: disciplineName, code: disciplineCode, semester: semesterNumber });
      Alert.alert('Sucesso', 'Disciplina editada com sucesso');
      setDisciplines(disciplines.map(discipline => discipline.id === selectedDiscipline.id ? { ...discipline, name: disciplineName, code: disciplineCode, semester: semesterNumber } : discipline));
      setDisciplineModalVisible(false);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao editar disciplina');
      console.error('Error editing discipline:', error);
    }
  };

  const handleDisciplinePress = (discipline) => {
    setSelectedDiscipline(discipline);
    setDisciplineName(discipline.name);
    setDisciplineCode(discipline.code || '');
    setSemesterNumber(discipline.semester ? discipline.semester.toString() : '');
    setDisciplineModalVisible(true);
  };

  const openMenu = (disciplineId) => {
    setMenuVisible(prevState => ({ ...prevState, [disciplineId]: true }));
  };

  const closeMenu = (disciplineId) => {
    setMenuVisible(prevState => ({ ...prevState, [disciplineId]: false }));
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <>
          <FlatList
            data={disciplines}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.disciplineItemContainer}>
                <List.Item
                  title={item.name}
                  style={styles.disciplineItem}
                  titleStyle={styles.disciplineTitle}
                />
                <Menu
                  visible={menuVisible[item.id]}
                  onDismiss={() => closeMenu(item.id)}
                  anchor={
                    <MaterialIcons
                      name="more-vert"
                      size={24}
                      color={COLORS.black}
                      onPress={() => openMenu(item.id)}
                    />
                  }
                  style={styles.menuContainer}
                >
                  <Menu.Item
                    onPress={() => {
                      closeMenu(item.id);
                      handleDisciplinePress(item);
                    }}
                    title="Editar"
                    titleStyle={styles.menuItemText}
                  />
                  <Menu.Item
                    onPress={() => {
                      closeMenu(item.id);
                      setSelectedDiscipline(item);
                      setDeleteConfirmationVisible(true);
                    }}
                    title="Remover"
                    titleStyle={styles.menuItemText}
                  />
                </Menu>
              </View>
            )}
          />
          <FAB
            style={styles.fab}
            icon="plus"
            label="Adicionar Disciplina"
            onPress={() => {
              setSelectedDiscipline(null);
              setDisciplineName('');
              setDisciplineCode('');
              setSemesterNumber('');
              setDisciplineModalVisible(true);
            }}
          />

          <Portal>
            <Modal
              visible={disciplineModalVisible}
              onDismiss={() => setDisciplineModalVisible(false)}
              contentContainerStyle={styles.modalContainer}
            >
              <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View>
                  <Text style={styles.modalTitle}>{selectedDiscipline ? 'Editar Disciplina' : 'Adicionar Disciplina'}</Text>
                  <TextInput
                    label="Nome da Disciplina"
                    value={disciplineName}
                    onChangeText={setDisciplineName}
                    mode="outlined"
                    style={styles.input}
                    theme={{
                      colors: {
                        primary: COLORS.primary,
                        background: COLORS.white,
                        text: COLORS.black, // Texto preto para o input
                        placeholder: COLORS.black, // Texto preto para o placeholder
                      },
                    }}
                  />
                  <TextInput
                    label="Código ou sigla da disciplina"
                    value={disciplineCode}
                    onChangeText={setDisciplineCode}
                    mode="outlined"
                    style={styles.input}
                    theme={{
                      colors: {
                        primary: COLORS.primary,
                        background: COLORS.white,
                        text: COLORS.black, // Texto preto para o input
                        placeholder: COLORS.black, // Texto preto para o placeholder
                      },
                    }}
                  />
                  <TextInput
                    label="Número do Semestre"
                    value={semesterNumber}
                    onChangeText={setSemesterNumber}
                    keyboardType="numeric"
                    mode="outlined"
                    style={styles.input}
                    theme={{
                      colors: {
                        primary: COLORS.primary,
                        background: COLORS.white,
                        text: COLORS.black, // Texto preto para o input
                        placeholder: COLORS.black, // Texto preto para o placeholder
                      },
                    }}
                  />

                  <View style={styles.modalButtonsContainer}>
                    {selectedDiscipline && (
                      <>
                        <Button
                          mode="contained"
                          onPress={handleEditDiscipline}
                          style={styles.modalButtonConfirm}
                          labelStyle={styles.modalButtonLabel}
                        >
                          Salvar
                        </Button>
                      </>
                    )}
                    {!selectedDiscipline && (
                      <Button
                        mode="contained"
                        onPress={handleCreateDiscipline}
                        style={styles.modalButtonConfirm}
                        labelStyle={styles.modalButtonLabel}
                      >
                        Criar
                      </Button>
                    )}
                    <Button
                      mode="contained"
                      onPress={() => setDisciplineModalVisible(false)}
                      style={styles.modalButtonCancel}
                      labelStyle={styles.modalButtonLabel}
                    >
                      Cancelar
                    </Button>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>

            <Dialog
              visible={deleteConfirmationVisible}
              onDismiss={() => setDeleteConfirmationVisible(false)}
              style={styles.dialogContainer} // Atualizado para fundo branco
            >
              <Dialog.Title style={styles.dialogTitle}>Confirmar Exclusão</Dialog.Title>
              <Dialog.Content>
                <Paragraph style={styles.dialogContent}>Você tem certeza que deseja excluir esta disciplina?</Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  onPress={() => setDeleteConfirmationVisible(false)}
                  style={styles.dialogButtonCancel}
                  labelStyle={styles.dialogButtonLabel} // Texto preto
                >
                  Cancelar
                </Button>
                <Button
                  onPress={handleRemoveDiscipline}
                  style={styles.dialogButtonConfirm}
                  labelStyle={styles.dialogButtonLabel} // Texto preto
                >
                  Confirmar
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disciplineItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey,
  },
  disciplineItem: {
    flex: 1,
    backgroundColor: "#fff"
  },
  disciplineTitle: {
    color: COLORS.black,
  },
  menuContainer: {
    backgroundColor: "#fff",
    color: "#fff" // Fundo branco para o menu
  },
  menuItemText: {
    color: COLORS.white, // Texto preto para o item do menu
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 15,
    backgroundColor: COLORS.green,
    color: "#fff"
  },
  modalContainer: {
    backgroundColor: COLORS.white, // Fundo branco para o modal
    padding: 24,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: COLORS.black, // Texto preto para o título do modal
  },
  input: {
    marginBottom: 16,
    color: COLORS.black,
    text: COLORS.black
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButtonConfirm: {
    backgroundColor: COLORS.primary,
  },
  modalButtonRemove: {
    backgroundColor: COLORS.red,
  },
  modalButtonCancel: {
    backgroundColor: COLORS.grey,
  },
  modalButtonLabel: {
    color: COLORS.white, // Texto branco para os botões
  },
  dialogContainer: {
    backgroundColor: COLORS.white, // Fundo branco para o diálogo de confirmação
  },
  dialogTitle: {
    fontSize: 18,
    color: COLORS.black, // Texto preto para o título do diálogo
  },
  dialogContent: {
    fontSize: 16,
    color: COLORS.black, // Texto preto para o conteúdo do diálogo
  },
  dialogButtonCancel: {
    backgroundColor: COLORS.grey,
  },
  dialogButtonConfirm: {
    backgroundColor: COLORS.primary,
  },
  dialogButtonLabel: {
    color: COLORS.black, // Texto preto para os botões do diálogo
  },
});

export default ManageDisciplineScreen;
