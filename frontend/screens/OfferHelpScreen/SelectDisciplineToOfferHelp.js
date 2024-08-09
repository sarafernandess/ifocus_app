import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Button, Title, ActivityIndicator } from 'react-native-paper';
import api from '../../services/api';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';

const SelectDisciplineToOfferHelp = () => {
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [courseId, setCourseId] = useState(null);
  const [editing, setEditing] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();

  const { selectedSubjects: initialSelectedSubjects, courseId: initialCourseId } = route.params || {};

  useEffect(() => {
    if (initialSelectedSubjects) {
      setSelectedSubjects(initialSelectedSubjects.map(subject => subject.id));
    }
    if (initialCourseId) {
      setCourseId(initialCourseId);
      setEditing(true);
    }
  }, [initialSelectedSubjects, initialCourseId]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const coursesResponse = await api.get('/courses');
        setCourses(coursesResponse.data);

        if (courseId) {
          const selectedCourse = coursesResponse.data.find(course => course.id === courseId);
          setSelectedCourse(selectedCourse);

          const disciplinesResponse = await api.get(`/courses/${courseId}/disciplines`);
          setDisciplines(disciplinesResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Erro', 'Erro ao buscar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  const handleCourseSelection = async (course) => {
    setSelectedCourse(course);
    setCourseId(course.id);
    setSelectedSubjects([]);

    try {
      const disciplinesResponse = await api.get(`/courses/${course.id}/disciplines`);
      setDisciplines(disciplinesResponse.data);
    } catch (error) {
      console.error('Error fetching disciplines:', error);
      Alert.alert('Erro', 'Erro ao buscar disciplinas');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const typeHelp = 'offer_help'; 

      const payload = {
        user_id: getAuth().currentUser.uid,
        course_id: courseId,
        discipline_ids: selectedSubjects,
        type_help: typeHelp,
      };

      const response = editing
        ? await api.put('/disciplines/update', payload)
        : await api.post('/disciplines/assign', payload);

      if (response.status === 200) {
        Alert.alert('Sucesso', 'Alterações salvas com sucesso');
        navigation.goBack();
      } else {
        Alert.alert('Erro', 'Erro ao salvar as alterações');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      Alert.alert('Erro', 'Erro ao salvar as alterações');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setSelectedCourse(null);
    setCourseId(null);
    setSelectedSubjects([]);
    setDisciplines([]);
    setLoading(true);
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (saving) {
    return (
      <View style={styles.savingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Title style={styles.savingText}>Salvando alterações...</Title>
      </View>
    );
  }

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
        disabled={loading || saving}
      />

      {selectedCourse && (
        <>
          <View style={styles.spacing} />
          <Title style={styles.headerText}>Disciplinas</Title>
          <FlatList
            data={disciplines}
            renderItem={renderSubjectItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
          />
        </>
      )}

      {selectedCourse && selectedSubjects.length > 0 && (
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
    justifyContent: 'flex-start',
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
    color: 'black',
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
    marginBottom: 32,
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
    height: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  savingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  savingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SelectDisciplineToOfferHelp;
