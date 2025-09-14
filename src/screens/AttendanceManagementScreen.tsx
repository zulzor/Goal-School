import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Searchbar,
  Chip,
  ActivityIndicator,
  List,
  Divider,
  FAB,
  Portal,
  Modal,
  TextInput,
  Surface,
  Avatar,
} from 'react-native-paper';
import { useAuth, UserRole } from '../context/LocalStorageAuthContext';
import { attendanceService } from '../services';
import { COLORS, SIZES } from '../constants';
import { useFocusEffect } from '@react-navigation/native';
import { AnimatedCard } from '../components/AnimatedCard';
import { ArsenalBanner } from '../components/ArsenalBanner';
import { UnderDevelopmentBanner } from '../components/UnderDevelopmentBanner';

interface Training {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  registered_count: number;
  attended_count: number;
  can_mark_attendance: boolean;
}

interface Student {
  id: string;
  name: string;
  email: string;
  is_registered: boolean;
  attendance_status?: 'present' | 'absent' | 'late' | 'excused';
}

export default function AttendanceManagementScreen() {
  const { user } = useAuth();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [feedbackData, setFeedbackData] = useState<any>({});

  // Моковые данные для демонстрации
  const mockTrainings: Training[] = [
    {
      id: '1',
      title: 'Тренировка U-10',
      date: '2025-09-05',
      start_time: '10:00',
      end_time: '11:30',
      location: 'Поле A',
      registered_count: 15,
      attended_count: 12,
      can_mark_attendance: true,
    },
    {
      id: '2',
      title: 'Тренировка U-12',
      date: '2025-09-06',
      start_time: '14:00',
      end_time: '15:30',
      location: 'Главное поле',
      registered_count: 18,
      attended_count: 16,
      can_mark_attendance: true,
    },
    {
      id: '3',
      title: 'Тренировка U-8',
      date: '2025-09-07',
      start_time: '16:00',
      end_time: '17:00',
      location: 'Поле B',
      registered_count: 12,
      attended_count: 10,
      can_mark_attendance: true,
    },
  ];

  const mockStudents: Student[] = [
    {
      id: '1',
      name: 'Иванов Иван',
      email: 'ivanov@example.com',
      is_registered: true,
      attendance_status: 'present',
    },
    {
      id: '2',
      name: 'Петров Петр',
      email: 'petrov@example.com',
      is_registered: true,
      attendance_status: 'late',
    },
    {
      id: '3',
      name: 'Сидоров Сидор',
      email: 'sidorov@example.com',
      is_registered: true,
      attendance_status: 'absent',
    },
    {
      id: '4',
      name: 'Козлов Алексей',
      email: 'kozlov@example.com',
      is_registered: true,
      attendance_status: undefined,
    },
    {
      id: '5',
      name: 'Морозов Дмитрий',
      email: 'morozov@example.com',
      is_registered: true,
      attendance_status: 'present',
    },
  ];

  // Загрузка тренировок тренера
  useFocusEffect(
    useCallback(() => {
      loadCoachTrainings();
    }, [user])
  );

  const loadCoachTrainings = async () => {
    if (!user || user.role !== UserRole.COACH) {
      return;
    }

    try {
      setLoading(true);
      // В реальном приложении здесь будет запрос к сервису
      // Пока используем моковые данные
      setTrainings(mockTrainings);
    } catch (error) {
      console.error('Ошибка загрузки тренировок:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить тренировки');
    } finally {
      setLoading(false);
    }
  };

  // Загрузка учеников конкретной тренировки
  const loadTrainingStudents = async (trainingId: string) => {
    try {
      setStudentsLoading(true);
      // В реальном приложении здесь будет запрос к сервису
      // Пока используем моковые данные
      setStudents(mockStudents);
    } catch (error) {
      console.error('Ошибка загрузки учеников:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить список учеников');
    } finally {
      setStudentsLoading(false);
    }
  };

  // Выбор тренировки
  const selectTraining = (training: Training) => {
    setSelectedTraining(training);
    loadTrainingStudents(training.id);
  };

  // Отметка посещаемости
  const markAttendance = async (
    studentId: string,
    status: 'present' | 'absent' | 'late' | 'excused'
  ) => {
    if (!selectedTraining || !user) {
      return;
    }

    try {
      // Обновляем локальное состояние для демонстрации
      setStudents(prevStudents =>
        prevStudents.map(student =>
          student.id === studentId ? { ...student, attendance_status: status } : student
        )
      );

      Alert.alert('Успешно', 'Посещаемость отмечена');
    } catch (error) {
      console.error('Ошибка отметки посещаемости:', error);
      Alert.alert('Ошибка', 'Не удалось отметить посещаемость');
    }
  };

  // Массовая отметка присутствующих
  const markAllPresent = async () => {
    if (!selectedTraining || !user) {
      return;
    }

    Alert.alert('Подтверждение', 'Отметить всех зарегистрированных учеников как присутствующих?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Да',
        onPress: async () => {
          try {
            // Обновляем локальное состояние для демонстрации
            setStudents(prevStudents =>
              prevStudents.map(student =>
                student.is_registered && !student.attendance_status
                  ? { ...student, attendance_status: 'present' }
                  : student
              )
            );

            Alert.alert('Успешно', 'Все ученики отмечены как присутствующие');
          } catch (error) {
            console.error('Ошибка массовой отметки:', error);
            Alert.alert('Ошибка', 'Не удалось отметить всех учеников');
          }
        },
      },
    ]);
  };

  // Показать форму обратной связи
  const showFeedbackForm = (student: Student) => {
    setSelectedStudent(student);
    setFeedbackData({
      training_id: selectedTraining?.id,
      student_id: student.id,
      overall_rating: 3,
      technical_skills: 3,
      physical_fitness: 3,
      teamwork: 3,
      attitude: 3,
    });
    setShowFeedbackModal(true);
  };

  // Сохранить обратную связь
  const saveFeedback = async () => {
    if (!feedbackData.training_id || !feedbackData.student_id) {
      return;
    }

    try {
      setShowFeedbackModal(false);
      Alert.alert('Успешно', 'Обратная связь сохранена');
    } catch (error) {
      console.error('Ошибка сохранения обратной связи:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить обратную связь');
    }
  };

  // Обработка изменения посещаемости
  const handleAttendanceChange = (
    studentId: string,
    status: 'present' | 'absent' | 'late' | 'excused'
  ) => {
    markAttendance(studentId, status);
  };

  // Фильтрация учеников с мемоизацией
  const filteredStudents = useMemo(() => {
    return students.filter(student =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [students, searchQuery]);

  // Получить цвет статуса с мемоизацией
  const getStatusColor = useMemo(() => {
    return (status?: string) => {
      switch (status) {
        case 'present':
          return COLORS.success; // Используем цвет Arsenal
        case 'late':
          return COLORS.warning; // Используем цвет Arsenal
        case 'absent':
          return COLORS.error; // Используем цвет Arsenal
        case 'excused':
          return '#8b5cf6'; // Оставляем фиолетовый для уважительных причин
        default:
          return COLORS.textSecondary; // Используем цвет Arsenal
      }
    };
  }, []);

  // Получить текст статуса с мемоизацией
  const getStatusText = useMemo(() => {
    return (status?: string) => {
      switch (status) {
        case 'present':
          return 'Присутствует';
        case 'late':
          return 'Опоздал';
        case 'absent':
          return 'Отсутствует';
        case 'excused':
          return 'Уважительная';
        default:
          return 'Не отмечен';
      }
    };
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Загрузка тренировок...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Показываем заглушку для экрана в разработке
  if (user?.role === UserRole.COACH) {
    return (
      <UnderDevelopmentBanner
        title="Управление посещаемостью"
        description="Этот раздел находится в активной разработке. Функционал управления посещаемостью будет доступен в следующем обновлении."
      />
    );
  }

  if (!selectedTraining) {
    return (
      <SafeAreaView style={styles.container}>
        <ArsenalBanner
          title="Управление посещаемостью"
          subtitle="Выберите тренировку для отметки посещаемости"
        />

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {trainings.length === 0 ? (
            <AnimatedCard animationType="fade" delay={0}>
              <Card style={styles.emptyCard}>
                <Card.Content>
                  <Title>Нет тренировок</Title>
                  <Paragraph>У вас нет тренировок для отметки посещаемости</Paragraph>
                </Card.Content>
              </Card>
            </AnimatedCard>
          ) : (
            trainings.map((training, index) => (
              <AnimatedCard key={training.id} animationType="scale" delay={index * 100}>
                <Card style={styles.trainingCard} onPress={() => selectTraining(training)}>
                  <Card.Content>
                    <View style={styles.trainingHeader}>
                      <View style={styles.trainingInfo}>
                        <Title style={styles.trainingTitle}>{training.title}</Title>
                        <Paragraph>{training.location}</Paragraph>
                        <Paragraph>
                          {new Date(training.date).toLocaleDateString('ru-RU')} в{' '}
                          {training.start_time}
                        </Paragraph>
                      </View>
                      <View style={styles.trainingStats}>
                        <Chip icon="account-group" mode="outlined">
                          {training.attended_count}/{training.registered_count}
                        </Chip>
                        {training.can_mark_attendance && (
                          <Chip icon="check" mode="outlined" style={styles.canMarkChip}>
                            Можно отметить
                          </Chip>
                        )}
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              </AnimatedCard>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => setSelectedTraining(null)}>
          <Text style={styles.backButtonText}>← Назад</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Title style={styles.headerTitle}>{selectedTraining.title}</Title>
          <Paragraph>
            {new Date(selectedTraining.date).toLocaleDateString('ru-RU')} в{' '}
            {selectedTraining.start_time}
          </Paragraph>
        </View>
      </View>

      <Searchbar
        placeholder="Поиск учеников..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      {studentsLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Загрузка учеников...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredStudents}
          renderItem={({ item }) => (
            <StudentItem
              student={item}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              showFeedbackForm={showFeedbackForm}
              onAttendanceChange={handleAttendanceChange}
            />
          )}
          keyExtractor={item => item.id}
          style={styles.studentsList}
        />
      )}

      <FAB icon="check-all" label="Отметить всех" onPress={markAllPresent} style={styles.fab} />

      {/* Модальное окно обратной связи */}
      <Portal>
        <Modal
          visible={showFeedbackModal}
          onDismiss={() => setShowFeedbackModal(false)}
          contentContainerStyle={styles.modalContainer}>
          <ScrollView>
            <Title>Обратная связь для {selectedStudent?.name}</Title>

            <View style={styles.ratingSection}>
              <Text style={styles.ratingLabel}>Общая оценка:</Text>
              <View style={styles.ratingButtons}>
                {[1, 2, 3, 4, 5].map(rating => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.ratingButton,
                      feedbackData.overall_rating === rating && styles.selectedRating,
                    ]}
                    onPress={() =>
                      setFeedbackData((prev: any) => ({ ...prev, overall_rating: rating }))
                    }>
                    <Text style={styles.ratingButtonText}>{rating}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TextInput
              style={styles.textInput}
              placeholder="Публичный отзыв (виден родителям и ученику)"
              multiline
              numberOfLines={3}
              value={feedbackData.public_feedback}
              onChangeText={text =>
                setFeedbackData((prev: any) => ({ ...prev, public_feedback: text }))
              }
            />

            <TextInput
              style={styles.textInput}
              placeholder="Приватные заметки (только для тренеров)"
              multiline
              numberOfLines={2}
              value={feedbackData.private_notes}
              onChangeText={text =>
                setFeedbackData((prev: any) => ({ ...prev, private_notes: text }))
              }
            />

            <View style={styles.modalActions}>
              <Button
                mode="outlined"
                onPress={() => setShowFeedbackModal(false)}
                style={styles.modalButton}>
                Отмена
              </Button>
              <Button mode="contained" onPress={saveFeedback} style={styles.modalButton}>
                Сохранить
              </Button>
            </View>
          </ScrollView>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // Используем цвет Arsenal
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: COLORS.textSecondary, // Используем цвет Arsenal
  },
  loadingText: {
    marginTop: 16,
    color: COLORS.textSecondary, // Используем цвет Arsenal
  },
  emptyCard: {
    marginBottom: 16,
  },
  trainingCard: {
    marginBottom: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  trainingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  trainingInfo: {
    flex: 1,
  },
  trainingTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  trainingStats: {
    alignItems: 'flex-end',
  },
  canMarkChip: {
    marginTop: 8,
    backgroundColor: COLORS.success, // Используем цвет Arsenal
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.surface, // Используем цвет Arsenal
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: COLORS.primary, // Используем цвет Arsenal
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  searchbar: {
    margin: 16,
  },
  studentsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  studentCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: COLORS.surface, // Используем цвет Arsenal
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  studentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  studentAvatar: {
    marginRight: 12,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text, // Используем цвет Arsenal
  },
  studentEmail: {
    fontSize: 14,
    color: COLORS.textSecondary, // Используем цвет Arsenal
  },
  statusChip: {
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
  },
  divider: {
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 2,
    marginBottom: 8,
  },
  feedbackButton: {
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary, // Используем цвет Arsenal
  },
  modalContainer: {
    backgroundColor: COLORS.surface, // Используем цвет Arsenal
    padding: 20,
    margin: 20,
    borderRadius: 12,
    maxHeight: '80%',
  },
  ratingSection: {
    marginVertical: 16,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: COLORS.text, // Используем цвет Arsenal
  },
  ratingButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  ratingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.border, // Используем цвет Arsenal
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRating: {
    backgroundColor: COLORS.primary, // Используем цвет Arsenal
    borderColor: COLORS.primary, // Используем цвет Arsenal
  },
  ratingButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text, // Используем цвет Arsenal
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.border, // Используем цвет Arsenal
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    textAlignVertical: 'top',
    color: COLORS.text, // Используем цвет Arsenal
    backgroundColor: COLORS.surface, // Используем цвет Arsenal
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

// Мемоизированный компонент для отображения ученика
const StudentItem = memo(
  ({
    student,
    getStatusColor,
    getStatusText,
    showFeedbackForm,
    onAttendanceChange,
  }: {
    student: Student;
    getStatusColor: (status?: string) => string;
    getStatusText: (status?: string) => string;
    showFeedbackForm: (student: Student) => void;
    onAttendanceChange: (
      studentId: string,
      status: 'present' | 'absent' | 'late' | 'excused'
    ) => void;
  }) => {
    return (
      <Surface style={styles.studentCard}>
        <View style={styles.studentHeader}>
          <View style={styles.studentInfo}>
            <Avatar.Text size={40} label={student.name.charAt(0)} style={styles.studentAvatar} />
            <View>
              <Text style={styles.studentName}>{student.name}</Text>
              <Text style={styles.studentEmail}>{student.email}</Text>
            </View>
          </View>
          <Chip
            icon="circle"
            style={[
              styles.statusChip,
              { backgroundColor: getStatusColor(student.attendance_status) },
            ]}
            textStyle={styles.statusText}>
            {getStatusText(student.attendance_status)}
          </Chip>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.actionButtons}>
          <Button
            mode="outlined"
            style={styles.actionButton}
            onPress={() => onAttendanceChange(student.id, 'present')}>
            Присутствует
          </Button>
          <Button
            mode="outlined"
            style={styles.actionButton}
            onPress={() => onAttendanceChange(student.id, 'late')}>
            Опоздал
          </Button>
          <Button
            mode="outlined"
            style={styles.actionButton}
            onPress={() => onAttendanceChange(student.id, 'absent')}>
            Отсутствует
          </Button>
          <Button
            mode="outlined"
            style={styles.actionButton}
            onPress={() => onAttendanceChange(student.id, 'excused')}>
            Уважительная
          </Button>
        </View>

        <Button mode="text" onPress={() => showFeedbackForm(student)} style={styles.feedbackButton}>
          Добавить обратную связь
        </Button>
      </Surface>
    );
  }
);
