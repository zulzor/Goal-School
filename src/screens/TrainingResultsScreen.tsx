import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, Platform } from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Searchbar,
  Chip,
  ActivityIndicator,
  Modal,
  Menu,
  TextInput,
  DataTable,
  IconButton,
  Avatar,
} from 'react-native-paper';
import { useAuth, UserRole } from '../context/LocalStorageAuthContext';
import { useBranch } from '../context/BranchContext';
import { UnderDevelopmentBanner } from '../components/UnderDevelopmentBanner';
import { COLORS } from '../constants';
import { AppIcon } from '../components/AppIcon';

// Интерфейсы для типов данных
interface Student {
  id: string;
  name: string;
  email: string;
  ageGroup: string;
}

interface TrainingSession {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  ageGroup: string;
}

interface TrainingResult {
  id: string;
  studentId: string;
  trainingId: string;
  coachId: string;
  technicalSkills: number; // 1-5
  physicalFitness: number; // 1-5
  teamwork: number; // 1-5
  attitude: number; // 1-5
  overallRating: number; // 1-5
  notes: string;
  dateRecorded: string;
  student?: Student;
  training?: TrainingSession;
}

export const TrainingResultsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const { branches } = useBranch();
  const currentBranch = branches[0]; // Для простоты берем первый филиал

  const [students, setStudents] = useState<Student[]>([]);
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([]);
  const [results, setResults] = useState<TrainingResult[]>([]);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedTraining, setSelectedTraining] = useState<TrainingSession | null>(null);

  const [technicalSkills, setTechnicalSkills] = useState<number>(3);
  const [physicalFitness, setPhysicalFitness] = useState<number>(3);
  const [teamwork, setTeamwork] = useState<number>(3);
  const [attitude, setAttitude] = useState<number>(3);
  const [notes, setNotes] = useState<string>('');

  const [isAddingResult, setIsAddingResult] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [studentsLoading, setStudentsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [studentMenuVisible, setStudentMenuVisible] = useState<boolean>(false);
  const [trainingMenuVisible, setTrainingMenuVisible] = useState<boolean>(false);

  // Показываем заглушку для экрана в разработке
  if (user?.role === UserRole.MANAGER) {
    return (
      <UnderDevelopmentBanner
        title="Результаты тренировок"
        description="Этот раздел находится в активной разработке. Функционал внесения результатов тренировок будет доступен в следующем обновлении."
        onBackPress={() => navigation.goBack()}
      />
    );
  }

  if (!user || user.role !== UserRole.COACH) {
    return (
      <View style={styles.container}>
        <Card style={styles.errorCard}>
          <Card.Content style={styles.errorContent}>
            <Text style={styles.errorText}>Доступ к этой функции имеют только тренеры</Text>
            <Button mode="contained" onPress={() => navigation.goBack()} style={styles.backButton}>
              Назад
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  // Загрузка данных
  useEffect(() => {
    loadData();
  }, [currentBranch]);

  const loadData = async () => {
    if (!user || !currentBranch) {
      return;
    }

    try {
      setLoading(true);

      // Загрузка учеников филиала
      const branchStudents = await loadStudentsForBranch(currentBranch.id);
      setStudents(branchStudents);

      // Загрузка тренировок тренера
      const coachTrainings = await loadTrainingsForCoach(user.id);
      setTrainingSessions(coachTrainings);

      // Загрузка существующих результатов
      const existingResults = await loadExistingResults(user.id);
      setResults(existingResults);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };

  // Загрузка учеников филиала
  const loadStudentsForBranch = async (branchId: string): Promise<Student[]> => {
    try {
      // В реальном приложении здесь будет запрос к сервису
      // Пока используем моковые данные
      return [
        {
          id: 'student1',
          name: 'Иванов Иван',
          email: 'ivanov@example.com',
          ageGroup: 'U-10',
        },
        {
          id: 'student2',
          name: 'Петров Петр',
          email: 'petrov@example.com',
          ageGroup: 'U-10',
        },
        {
          id: 'student3',
          name: 'Сидоров Сидор',
          email: 'sidorov@example.com',
          ageGroup: 'U-12',
        },
      ];
    } catch (error) {
      console.error('Ошибка загрузки учеников:', error);
      return [];
    }
  };

  // Загрузка тренировок тренера
  const loadTrainingsForCoach = async (coachId: string): Promise<TrainingSession[]> => {
    try {
      // В реальном приложении здесь будет запрос к сервису
      // Пока используем моковые данные
      return [
        {
          id: 'training1',
          title: 'Тренировка U-10',
          date: '2025-09-10',
          startTime: '10:00',
          endTime: '11:30',
          location: 'Главное поле',
          ageGroup: 'U-10',
        },
        {
          id: 'training2',
          title: 'Тренировка U-12',
          date: '2025-09-12',
          startTime: '14:00',
          endTime: '15:30',
          location: 'Поле A',
          ageGroup: 'U-12',
        },
      ];
    } catch (error) {
      console.error('Ошибка загрузки тренировок:', error);
      return [];
    }
  };

  // Загрузка существующих результатов
  const loadExistingResults = async (coachId: string): Promise<TrainingResult[]> => {
    try {
      // В реальном приложении здесь будет запрос к сервису
      // Пока используем моковые данные
      return [
        {
          id: 'result1',
          studentId: 'student1',
          trainingId: 'training1',
          coachId: coachId,
          technicalSkills: 4,
          physicalFitness: 3,
          teamwork: 5,
          attitude: 4,
          overallRating: 4,
          notes: 'Хорошие технические навыки',
          dateRecorded: '2025-09-10T11:00:00Z',
          student: {
            id: 'student1',
            name: 'Иванов Иван',
            email: 'ivanov@example.com',
            ageGroup: 'U-10',
          },
          training: {
            id: 'training1',
            title: 'Тренировка U-10',
            date: '2025-09-10',
            startTime: '10:00',
            endTime: '11:30',
            location: 'Главное поле',
            ageGroup: 'U-10',
          },
        },
      ];
    } catch (error) {
      console.error('Ошибка загрузки результатов:', error);
      return [];
    }
  };

  // Добавление нового результата
  const handleAddResult = async () => {
    if (!selectedStudent || !selectedTraining) {
      Alert.alert('Ошибка', 'Пожалуйста, выберите ученика и тренировку');
      return;
    }

    try {
      const newResult: TrainingResult = {
        id: `result_${Date.now()}`,
        studentId: selectedStudent.id,
        trainingId: selectedTraining.id,
        coachId: user.id,
        technicalSkills,
        physicalFitness,
        teamwork,
        attitude,
        overallRating: Math.round((technicalSkills + physicalFitness + teamwork + attitude) / 4),
        notes,
        dateRecorded: new Date().toISOString(),
        student: selectedStudent,
        training: selectedTraining,
      };

      // В реальном приложении здесь будет сохранение в сервис
      // Пока просто добавляем в локальное состояние
      setResults(prev => [newResult, ...prev]);

      Alert.alert('Успех', 'Результат успешно добавлен');
      resetForm();
      setIsAddingResult(false);
    } catch (error: any) {
      Alert.alert('Ошибка', error.message || 'Не удалось добавить результат');
    }
  };

  // Сброс формы
  const resetForm = () => {
    setSelectedStudent(null);
    setSelectedTraining(null);
    setTechnicalSkills(3);
    setPhysicalFitness(3);
    setTeamwork(3);
    setAttitude(3);
    setNotes('');
  };

  // Удаление результата
  const handleDeleteResult = async (resultId: string) => {
    Alert.alert('Подтверждение', 'Вы уверены, что хотите удалить этот результат?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          try {
            // В реальном приложении здесь будет удаление из сервиса
            // Пока просто удаляем из локального состояния
            setResults(prev => prev.filter(result => result.id !== resultId));
            Alert.alert('Успех', 'Результат успешно удален');
          } catch (error: any) {
            Alert.alert('Ошибка', error.message || 'Не удалось удалить результат');
          }
        },
      },
    ]);
  };

  // Фильтрация результатов по поисковому запросу
  const filteredResults = results.filter(result => {
    const studentName = result.student?.name.toLowerCase() || '';
    const trainingTitle = result.training?.title.toLowerCase() || '';
    const query = searchQuery.toLowerCase();

    return studentName.includes(query) || trainingTitle.includes(query);
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Загрузка данных...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Title style={styles.title}>Результаты тренировок</Title>
        <Paragraph style={styles.subtitle}>Внесение и управление результатами учеников</Paragraph>
      </View>

      {/* Кнопка для добавления результата */}
      <View style={styles.addButtonContainer}>
        <Button
          mode="contained"
          onPress={() => setIsAddingResult(true)}
          style={styles.addButton}
          icon={() => <AppIcon name="add" size={20} color="white" />}>
          Добавить результат
        </Button>
      </View>

      {/* Поиск */}
      <Searchbar
        placeholder="Поиск по ученикам или тренировкам..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      {/* Список результатов */}
      <Card style={styles.resultsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Последние результаты</Title>

          {filteredResults.length === 0 ? (
            <View style={styles.emptyContainer}>
              <AppIcon name="file" size={48} color={COLORS.textSecondary} />
              <Paragraph style={styles.emptyText}>Нет результатов для отображения</Paragraph>
              <Paragraph style={styles.emptySubtext}>
                Нажмите "Добавить результат", чтобы внести данные о тренировке ученика
              </Paragraph>
            </View>
          ) : (
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Ученик</DataTable.Title>
                <DataTable.Title>Тренировка</DataTable.Title>
                <DataTable.Title numeric>Оценка</DataTable.Title>
                <DataTable.Title>Дата</DataTable.Title>
                <DataTable.Title>Действия</DataTable.Title>
              </DataTable.Header>

              <FlatList
                data={filteredResults}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <DataTable.Row key={item.id}>
                    <DataTable.Cell>
                      <View style={styles.studentCell}>
                        <Avatar.Text size={32} label={item.student?.name.charAt(0) || ''} />
                        <View style={styles.studentInfo}>
                          <Text style={styles.studentName}>
                            {item.student?.name || 'Неизвестно'}
                          </Text>
                          <Text style={styles.studentAgeGroup}>{item.student?.ageGroup || ''}</Text>
                        </View>
                      </View>
                    </DataTable.Cell>
                    <DataTable.Cell>{item.training?.title || 'Неизвестно'}</DataTable.Cell>
                    <DataTable.Cell numeric>
                      <Chip style={styles.ratingChip} textStyle={styles.ratingText}>
                        {item.overallRating}
                      </Chip>
                    </DataTable.Cell>
                    <DataTable.Cell>
                      {new Date(item.dateRecorded).toLocaleDateString('ru-RU')}
                    </DataTable.Cell>
                    <DataTable.Cell>
                      <IconButton
                        icon={() => <AppIcon name="delete" size={20} color={COLORS.error} />}
                        onPress={() => handleDeleteResult(item.id)}
                      />
                    </DataTable.Cell>
                  </DataTable.Row>
                )}
              />
            </DataTable>
          )}
        </Card.Content>
      </Card>

      {/* Модальное окно для добавления результата */}
      <Modal
        visible={isAddingResult}
        onDismiss={() => {
          setIsAddingResult(false);
          resetForm();
        }}
        contentContainerStyle={styles.modalContainer}>
        <Card>
          <Card.Content>
            <Title>Добавить результат тренировки</Title>

            {/* Выбор ученика */}
            <Menu
              visible={studentMenuVisible}
              onDismiss={() => setStudentMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  style={styles.input}
                  onPress={() => setStudentMenuVisible(true)}
                  icon={() => <AppIcon name="profile" size={16} color={COLORS.text} />}>
                  {selectedStudent ? selectedStudent.name : 'Выберите ученика *'}
                </Button>
              }>
              {students.map(student => (
                <Menu.Item
                  key={student.id}
                  onPress={() => {
                    setSelectedStudent(student);
                    setStudentMenuVisible(false);
                  }}
                  title={student.name}
                />
              ))}
            </Menu>

            {/* Выбор тренировки */}
            <Menu
              visible={trainingMenuVisible}
              onDismiss={() => setTrainingMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  style={styles.input}
                  onPress={() => setTrainingMenuVisible(true)}
                  icon={() => <AppIcon name="calendar" size={16} color={COLORS.text} />}>
                  {selectedTraining ? selectedTraining.title : 'Выберите тренировку *'}
                </Button>
              }>
              {trainingSessions.map(training => (
                <Menu.Item
                  key={training.id}
                  onPress={() => {
                    setSelectedTraining(training);
                    setTrainingMenuVisible(false);
                  }}
                  title={training.title}
                />
              ))}
            </Menu>

            {/* Оценки */}
            <View style={styles.ratingSection}>
              <Text style={styles.ratingLabel}>Технические навыки:</Text>
              <View style={styles.ratingButtons}>
                {[1, 2, 3, 4, 5].map(rating => (
                  <Button
                    key={rating}
                    mode={technicalSkills === rating ? 'contained' : 'outlined'}
                    onPress={() => setTechnicalSkills(rating)}
                    style={styles.ratingButton}>
                    {rating}
                  </Button>
                ))}
              </View>
            </View>

            <View style={styles.ratingSection}>
              <Text style={styles.ratingLabel}>Физическая подготовка:</Text>
              <View style={styles.ratingButtons}>
                {[1, 2, 3, 4, 5].map(rating => (
                  <Button
                    key={rating}
                    mode={physicalFitness === rating ? 'contained' : 'outlined'}
                    onPress={() => setPhysicalFitness(rating)}
                    style={styles.ratingButton}>
                    {rating}
                  </Button>
                ))}
              </View>
            </View>

            <View style={styles.ratingSection}>
              <Text style={styles.ratingLabel}>Работа в команде:</Text>
              <View style={styles.ratingButtons}>
                {[1, 2, 3, 4, 5].map(rating => (
                  <Button
                    key={rating}
                    mode={teamwork === rating ? 'contained' : 'outlined'}
                    onPress={() => setTeamwork(rating)}
                    style={styles.ratingButton}>
                    {rating}
                  </Button>
                ))}
              </View>
            </View>

            <View style={styles.ratingSection}>
              <Text style={styles.ratingLabel}>Отношение:</Text>
              <View style={styles.ratingButtons}>
                {[1, 2, 3, 4, 5].map(rating => (
                  <Button
                    key={rating}
                    mode={attitude === rating ? 'contained' : 'outlined'}
                    onPress={() => setAttitude(rating)}
                    style={styles.ratingButton}>
                    {rating}
                  </Button>
                ))}
              </View>
            </View>

            {/* Общая оценка */}
            <View style={styles.overallRatingContainer}>
              <Text style={styles.overallRatingLabel}>
                Общая оценка:{' '}
                {Math.round((technicalSkills + physicalFitness + teamwork + attitude) / 4)}
              </Text>
            </View>

            {/* Примечания */}
            <TextInput
              label="Примечания"
              value={notes}
              onChangeText={setNotes}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
              placeholder="Дополнительные комментарии о тренировке"
            />

            {/* Кнопки действий */}
            <View style={styles.modalActions}>
              <Button
                mode="outlined"
                onPress={() => {
                  setIsAddingResult(false);
                  resetForm();
                }}
                style={styles.modalButton}>
                Отмена
              </Button>
              <Button
                mode="contained"
                onPress={handleAddResult}
                style={styles.modalButton}
                disabled={!selectedStudent || !selectedTraining}>
                Добавить
              </Button>
            </View>
          </Card.Content>
        </Card>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: COLORS.textSecondary,
  },
  headerContainer: {
    alignItems: 'center',
    padding: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  addButtonContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: COLORS.primary,
  },
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  resultsCard: {
    flex: 1,
    margin: 16,
    marginTop: 0,
    backgroundColor: COLORS.surface,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: COLORS.text,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  studentCell: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentInfo: {
    marginLeft: 12,
  },
  studentName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  studentAgeGroup: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  ratingChip: {
    backgroundColor: COLORS.primary,
  },
  ratingText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorCard: {
    margin: 16,
    backgroundColor: COLORS.surface,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  errorContent: {
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    color: COLORS.textSecondary,
  },
  backButton: {
    marginTop: 8,
  },
  modalContainer: {
    backgroundColor: COLORS.surface,
    margin: 20,
    padding: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  input: {
    marginBottom: 16,
  },
  ratingSection: {
    marginBottom: 16,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: COLORS.text,
  },
  ratingButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingButton: {
    minWidth: 50,
    marginHorizontal: 2,
  },
  overallRatingContainer: {
    alignItems: 'center',
    marginVertical: 16,
    padding: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  overallRatingLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  modalButton: {
    marginLeft: 8,
  },
});
