import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Button, Title, ActivityIndicator } from 'react-native-paper';
import api from '../../services/api';

const SelectDisciplinesScreen = () => {
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [courseId, setCourseId] = useState(null);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await api.get('/courses');
      console.log('Courses:', response.data); // Verifique a resposta aqui
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      Alert.alert('Erro', 'Erro ao buscar cursos');
    } finally {
      setLoading(false);
    }
  };

  const fetchDisciplines = async () => {
    if (!courseId) return;

    setLoading(true);
    try {
      const response = await api.get(`/courses/${courseId}/disciplines`);
      console.log('Disciplines:', response.data); // Verifique a resposta aqui
      setDisciplines(response.data);
    } catch (error) {
      console.error('Error fetching disciplines:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    fetchDisciplines();
  }, [courseId]);

  const toggleSubjectSelection = (subjectId) => {
    setSelectedSubjects((prev) => {
      if (prev.includes(subjectId)) {
        return prev.filter((id) => id !== subjectId);
      } else {
        return [...prev, subjectId];
      }
    });
  };

  const renderSubjectItem = ({ item }) => (
    <Button
      mode={selectedSubjects.includes(item.id) ? 'contained' : 'outlined'}
      onPress={() => toggleSubjectSelection(item.id)}
      style={styles.subjectButton}
    >
      {item.name}
    </Button>
  );

  const handleCourseSelection = (course) => {
    setSelectedCourse(course);
    setCourseId(course.id); // Atualizar o courseId com o id do curso
    setSelectedSubjects([]); // Resetar disciplinas selecionadas ao escolher um novo curso
  };

  const handleSave = () => {
    console.log('Alterações salvas:', selectedCourse, selectedSubjects);
  };

  const handleCancel = () => {
    setSelectedCourse(null);
    setCourseId(null);
    setSelectedSubjects([]);
    setDisciplines([]);
    console.log('Alterações canceladas');
  };

  return (
    <View style={styles.container}>
      <Title style={styles.headerText}>Selecione um Curso</Title>

      <Dropdown
        data={courses}
        labelField="name"
        valueField="id"
        placeholder={selectedCourse ? selectedCourse.name : 'Selecione um curso'}
        value={selectedCourse?.id}
        onChange={handleCourseSelection}
        style={styles.dropdown}
        containerStyle={styles.dropdownContainer}
        disabled={loading}
      />

      {selectedCourse && (
        <>
          <View style={styles.spacing} />
          <Title style={styles.headerText}>Disciplinas</Title>
          
          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <FlatList
              data={disciplines}
              renderItem={renderSubjectItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
            />
          )}
        </>
      )}

      {selectedCourse && selectedSubjects.length > 0 && ( // Condicional para mostrar os botões apenas quando uma disciplina for selecionada
        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
            Salvar
          </Button>
          <Button mode="outlined" onPress={handleCancel} style={styles.cancelButton}>
            Cancelar
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'flex-start', // Ajustar o conteúdo para começar do topo
  },
  dropdown: {
    backgroundColor: '#fff',
    borderColor: '#007bff',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 50,
  },
  dropdownContainer: {
    marginTop: 8,
    borderRadius: 4,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black', // Cor do texto para preto
  },
  listContainer: {
    paddingBottom: 16,
  },
  subjectButton: {
    marginBottom: 8,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 32, // Adicionar margem inferior para os botões
  },
  saveButton: {
    flex: 1,
    marginRight: 8,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 8,
  },
  spacing: {
    height: 16, // Espaçamento entre o campo de curso e disciplinas
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 5,
    borderColor: 'black',
    borderTopColor: 'transparent',
    borderStyle: 'solid',
    transform: [{ rotate: '45deg' }],
  },
});

export default SelectDisciplinesScreen;
