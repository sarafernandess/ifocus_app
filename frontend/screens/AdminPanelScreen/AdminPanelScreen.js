import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { IconButton, Menu, Button, TextInput as PaperTextInput, Dialog, Portal, Provider } from 'react-native-paper';
import api from '../../services/api';
import { useNavigation } from '@react-navigation/native';

const AdminPanelScreen = () => {
  const [courses, setCourses] = useState([]);
  const [addCourseModalVisible, setAddCourseModalVisible] = useState(false);
  const [editCourseModalVisible, setEditCourseModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState({});

  const navigation = useNavigation();

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await api.get('/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      Alert.alert('Erro', 'Erro ao buscar cursos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = async () => {
    setLoading(true);
    try {
      const response = await api.post('/admin/courses', { name: courseName, code: courseCode });
      if (response.status === 201) {
        Alert.alert('Sucesso', `Curso criado com ID: ${response.data.id}`);
        setAddCourseModalVisible(false);
        setCourses([...courses, response.data]);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao criar curso');
      console.error('Error creating course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCourse = async () => {
    setLoading(true);
    try {
      await api.delete(`/courses/${selectedCourse.id}`);
      Alert.alert('Sucesso', 'Curso removido com sucesso');
      setCourses(courses.filter(course => course.id !== selectedCourse.id));
      setDeleteConfirmationVisible(false);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao remover curso');
      console.error('Error removing course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCourse = async () => {
    setLoading(true);
    try {
      await api.put(`/courses/${selectedCourse.id}`, { name: courseName });
      Alert.alert('Sucesso', 'Curso editado com sucesso');
      setCourses(courses.map(course => course.id === selectedCourse.id ? { ...course, name: courseName } : course));
      setEditCourseModalVisible(false);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao editar curso');
      console.error('Error editing course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCoursePress = (course) => {
    navigation.navigate('ManageDisciplineScreen', { courseId: course.id });
  };

  const showMenu = (courseId) => {
    setMenuVisible({ [courseId]: true });
  };

  const hideMenu = (courseId) => {
    setMenuVisible({ [courseId]: false });
  };

  return (
    <Provider>
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
          </View>
        ) : (
          <>
            {courses.length === 0 ? (
              <Text style={styles.noCoursesText}>Nenhum curso para exibir</Text>
            ) : (
              <FlatList
                data={courses}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.courseItem}>
                    <TouchableOpacity onPress={() => handleCoursePress(item)}>
                      <Text style={styles.courseText}>{item.name}</Text>
                    </TouchableOpacity>
                    <Menu
                      visible={menuVisible[item.id]}
                      onDismiss={() => hideMenu(item.id)}
                      anchor={
                        <IconButton
                          icon="dots-vertical"
                          size={24}
                          onPress={() => showMenu(item.id)}
                        />
                      }
                    >
                      <Menu.Item
                        onPress={() => {
                          setSelectedCourse(item);
                          setCourseName(item.name);
                          setCourseCode(item.code);
                          setEditCourseModalVisible(true);
                          hideMenu(item.id);
                        }}
                        title="Editar"
                      />
                      <Menu.Item
                        onPress={() => {
                          setSelectedCourse(item);
                          setDeleteConfirmationVisible(true);
                          hideMenu(item.id);
                        }}
                        title="Remover"
                      />
                    </Menu>
                  </View>
                )}
              />
            )}

            <Button
              mode="contained"
              style={styles.addButton}
              onPress={() => setAddCourseModalVisible(true)}
            >
              Adicionar Curso
            </Button>

            <Portal>
              {/* Modal para Adicionar Curso */}
              <Dialog
                visible={addCourseModalVisible}
                onDismiss={() => setAddCourseModalVisible(false)}
              >
                <Dialog.Title>Adicionar Curso</Dialog.Title>
                <Dialog.Content>
                  <PaperTextInput
                    label="Nome do Curso"
                    value={courseName}
                    onChangeText={setCourseName}
                    style={styles.input}
                  />
                  <PaperTextInput
                    label="Código ou sigla do curso"
                    value={courseCode}
                    onChangeText={setCourseCode}
                    style={styles.input}
                  />
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={() => setAddCourseModalVisible(false)}>Cancelar</Button>
                  <Button onPress={handleCreateCourse}>Criar</Button>
                </Dialog.Actions>
              </Dialog>

              {/* Modal para Editar Curso */}
              <Dialog
                visible={editCourseModalVisible}
                onDismiss={() => setEditCourseModalVisible(false)}
              >
                <Dialog.Title>Editar Curso</Dialog.Title>
                <Dialog.Content>
                  <PaperTextInput
                    label="Nome do Curso"
                    value={courseName}
                    onChangeText={setCourseName}
                    style={styles.input}
                  />
                  <PaperTextInput
                    label="Código ou sigla do curso"
                    value={courseCode}
                    onChangeText={setCourseCode}
                    style={styles.input}
                  />
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={() => setEditCourseModalVisible(false)}>Cancelar</Button>
                  <Button onPress={handleEditCourse}>Salvar</Button>
                </Dialog.Actions>
              </Dialog>

              {/* Modal de Confirmação de Exclusão */}
              <Dialog
                visible={deleteConfirmationVisible}
                onDismiss={() => setDeleteConfirmationVisible(false)}
              >
                <Dialog.Title>Confirmar Exclusão</Dialog.Title>
                <Dialog.Content>
                  <Text>Você tem certeza que deseja excluir este curso?</Text>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={handleRemoveCourse}>Confirmar</Button>
                  <Button onPress={() => setDeleteConfirmationVisible(false)}>Cancelar</Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          </>
        )}
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCoursesText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
  courseItem: {
    padding: 15,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseText: {
    fontSize: 18,
  },
  addButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  input: {
    marginBottom: 10,
  },
});

export default AdminPanelScreen;
