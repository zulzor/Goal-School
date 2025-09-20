import React, { useState, useEffect, memo } from 'react';
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
} from 'react-native-paper';
import { useAuth, UserRole } from '../context/LocalStorageAuthContext';
import { DisciplineService } from '../services';
import { UnderDevelopmentBanner } from '../components/UnderDevelopmentBanner';
import { COLORS } from '../constants'; // Импортируем цвета Arsenal

// Возрастные группы
const AGE_GROUPS = ['U-6', 'U-8', 'U-10', 'U-12', 'U-14', 'U-16', 'U-18'];

interface DisciplineResultsScreenProps {
  navigation: any;
}

export const DisciplineResultsScreen: React.FC<DisciplineResultsScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [disciplines, setDisciplines] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedDiscipline, setSelectedDiscipline] = useState<any>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('');
  const [resultValue, setResultValue] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isAddingResult, setIsAddingResult] = useState<boolean>(false);
  const [isAddingDiscipline, setIsAddingDiscipline] = useState<boolean>(false);
  const [newDisciplineName, setNewDisciplineName] = useState<string>('');
  const [newDisciplineDescription, setNewDisciplineDescription] = useState<string>('');
  const [newDisciplineUnit, setNewDisciplineUnit] = useState<string>('time');
  const [disciplineMenuVisible, setDisciplineMenuVisible] = useState(false);
  const [studentMenuVisible, setStudentMenuVisible] = useState(false);
  const [ageGroupMenuVisible, setAgeGroupMenuVisible] = useState(false);
  const [disciplineUnitMenuVisible, setDisciplineUnitMenuVisible] = useState(false);
  const [standardResult, setStandardResult] = useState<string>('');
  const [selectedStandardDiscipline, setSelectedStandardDiscipline] = useState<any>(null);
  const [selectedStandardAgeGroup, setSelectedStandardAgeGroup] = useState<string>('');
  const [showSetStandardResult, setShowSetStandardResult] = useState<boolean>(false);
  const [currentStandardResult, setCurrentStandardResult] = useState<number | null>(null);
  const [standardDisciplineMenuVisible, setStandardDisciplineMenuVisible] = useState(false);
  const [standardAgeGroupMenuVisible, setStandardAgeGroupMenuVisible] = useState(false);
  const [showTopResults, setShowTopResults] = useState(false);
  const [topResults, setTopResults] = useState<any[]>([]);
  const [selectedTopDiscipline, setSelectedTopDiscipline] = useState<any>(null);
  const [selectedTopAgeGroup, setSelectedTopAgeGroup] = useState<string>('');
  const [topDisciplineMenuVisible, setTopDisciplineMenuVisible] = useState(false);
  const [topAgeGroupMenuVisible, setTopAgeGroupMenuVisible] = useState(false);

  // Показываем заглушку для экрана в разработке
  if (user?.role === UserRole.MANAGER) {
    return (
      <UnderDevelopmentBanner
        title="Результаты по дисциплинам"
        description="Этот раздел находится в активной разработке. Функционал внесения результатов по дисциплинам будет доступен в следующем обновлении."
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
  }, []);

  const loadData = async () => {
    if (!user) {
      return;
    }

    // Загрузка дисциплин
    const activeDisciplines = await DisciplineService.getActiveDisciplines();
    setDisciplines(activeDisciplines);

    // Загрузка результатов тренера
    if (user.role === UserRole.COACH) {
      const coachResults = await DisciplineService.getCoachResults(user.id);
      setResults(coachResults);

      // Загрузка списка учеников для тренера
      const coachStudents = await loadStudentsForCoach(user.id);
      setStudents(coachStudents);
    }
  };

  // Загрузка учеников тренера
  const loadStudentsForCoach = async (coachId: string) => {
    try {
      // Поскольку у нас теперь локальное хранилище, нам нужно реализовать загрузку учеников по-другому
      // Пока используем заглушку, в реальном приложении это будет реализовано через запросы к локальному хранилищу
      return [];
    } catch (error) {
      console.error('Ошибка загрузки учеников:', error);
      return [];
    }
  };

  // Добавление нового результата
  const handleAddResult = async () => {
    if (!selectedDiscipline || !selectedStudent || !resultValue || !selectedAgeGroup) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все обязательные поля');
      return;
    }

    try {
      const resultData = {
        discipline_id: selectedDiscipline.id,
        user_id: selectedStudent.id,
        result_value: parseFloat(resultValue),
        age_group: selectedAgeGroup,
        coach_id: user?.id || '',
        date_recorded: new Date().toISOString(),
        notes: notes || '',
        is_archived: false,
        standard_result: null,
      };

      const newResult = await DisciplineService.addResult(resultData);

      if (newResult) {
        Alert.alert('Успех', 'Результат успешно добавлен');
        setIsAddingResult(false);
        setSelectedDiscipline(null);
        setSelectedStudent(null);
        setSelectedAgeGroup('');
        setResultValue('');
        setNotes('');
        loadData(); // Перезагрузка данных
      } else {
        throw new Error('Не удалось добавить результат');
      }
    } catch (error: any) {
      Alert.alert('Ошибка', error.message || 'Не удалось добавить результат');
    }
  };

  // Архивирование результата (исключение из топа)
  const handleArchiveResult = async (resultId: string) => {
    try {
      const success = await DisciplineService.archiveResult(resultId);

      if (success) {
        Alert.alert('Успех', 'Результат исключен из топа');
        loadData(); // Перезагрузка данных
      } else {
        throw new Error('Не удалось архивировать результат');
      }
    } catch (error: any) {
      Alert.alert('Ошибка', error.message || 'Не удалось архивировать результат');
    }
  };

  // Добавление новой дисциплины
  const handleAddDiscipline = async () => {
    if (!newDisciplineName) {
      Alert.alert('Ошибка', 'Пожалуйста, введите название дисциплины');
      return;
    }

    try {
      const disciplineData = {
        name: newDisciplineName,
        description: newDisciplineDescription || '',
        unit: newDisciplineUnit,
        is_active: true,
        created_by: user?.id || '',
      };

      const newDiscipline = await DisciplineService.createDiscipline(disciplineData);

      if (newDiscipline) {
        Alert.alert('Успех', 'Дисциплина успешно добавлена');
        setIsAddingDiscipline(false);
        setNewDisciplineName('');
        setNewDisciplineDescription('');
        loadData(); // Перезагрузка данных
      } else {
        throw new Error('Не удалось добавить дисциплину');
      }
    } catch (error: any) {
      Alert.alert('Ошибка', error.message || 'Не удалось добавить дисциплину');
    }
  };

  // Форматирование времени для отображения
  const formatTime = (milliseconds: number) => {
    const totalSeconds = milliseconds / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const ms = Math.floor(milliseconds % 1000);

    return `${minutes} мин ${seconds} сек ${ms} мс`;
  };

  // Форматирование значения в зависимости от единицы измерения
  const formatResultValue = (value: number, unit: string) => {
    switch (unit) {
      case 'time':
        return formatTime(value);
      case 'distance':
        return `${value} см`;
      case 'points':
        return `${value} очков`;
      default:
        return value.toString();
    }
  };

  // Форматирование разницы между результатом и стандартом
  const formatResultDifference = (
    resultValue: number,
    standardValue: number | null,
    unit: string
  ) => {
    if (standardValue === null) {
      return '';
    }

    const difference = resultValue - standardValue;

    // Для времени меньшее значение лучше, для остальных большее
    const isBetter = unit === 'time' ? difference < 0 : difference > 0;
    const absDifference = Math.abs(difference);

    let differenceText = '';
    if (unit === 'time') {
      differenceText = formatTime(absDifference);
    } else if (unit === 'distance') {
      differenceText = `${absDifference} см`;
    } else if (unit === 'points') {
      differenceText = `${absDifference} очков`;
    } else {
      differenceText = absDifference.toString();
    }

    return isBetter ? `+${differenceText}` : `-${differenceText}`;
  };

  // Получение топ результатов
  const loadTopResults = async () => {
    if (!selectedTopDiscipline || !selectedTopAgeGroup) {
      Alert.alert('Ошибка', 'Пожалуйста, выберите дисциплину и возрастную группу');
      return;
    }

    try {
      const results = await DisciplineService.getTopResults(
        selectedTopDiscipline.id,
        selectedTopAgeGroup,
        10
      );
      setTopResults(results);
      setShowTopResults(true);
    } catch (error: any) {
      Alert.alert('Ошибка', error.message || 'Не удалось загрузить топ результаты');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Title style={styles.title}>Результаты по дисциплинам</Title>
        <Paragraph style={styles.subtitle}>Внесение и управление результатами учеников</Paragraph>
      </View>

      {/* Кнопки для добавления результатов и дисциплин */}
      <View style={styles.actionButtonsContainer}>
        <Button
          mode="contained"
          onPress={() => setIsAddingResult(true)}
          style={styles.actionButton}
          icon="plus">
          Добавить результат
        </Button>

        <Button
          mode="outlined"
          onPress={() => setIsAddingDiscipline(true)}
          style={styles.actionButton}
          icon="plus-circle">
          Новая дисциплина
        </Button>

        <Button
          mode="outlined"
          onPress={() => {
            setSelectedTopDiscipline(null);
            setSelectedTopAgeGroup('');
            setTopResults([]);
            setShowTopResults(true);
          }}
          style={styles.actionButton}
          icon="trophy">
          Топ
        </Button>
      </View>

      {/* Список результатов */}
      <Card style={styles.resultsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Последние результаты</Title>

          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Ученик</DataTable.Title>
              <DataTable.Title>Дисциплина</DataTable.Title>
              <DataTable.Title>Результат</DataTable.Title>
              <DataTable.Title>Стандарт</DataTable.Title>
              <DataTable.Title>Возраст</DataTable.Title>
              <DataTable.Title>Дата</DataTable.Title>
              <DataTable.Title>Действия</DataTable.Title>
            </DataTable.Header>

            <FlatList
              data={results.slice(0, 10)}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <ResultRow
                  result={item}
                  formatResultValue={formatResultValue}
                  formatResultDifference={formatResultDifference}
                  onArchiveResult={handleArchiveResult}
                />
              )}
            />
          </DataTable>
        </Card.Content>
      </Card>

      {/* Список дисциплин */}
      <Card style={styles.disciplinesCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Доступные дисциплины</Title>

          <View style={styles.disciplinesContainer}>
            {disciplines.map(discipline => (
              <DisciplineChip key={discipline.id} discipline={discipline} />
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Модальное окно для добавления результата */}
      <Modal
        visible={isAddingResult}
        onDismiss={() => setIsAddingResult(false)}
        contentContainerStyle={styles.modalContainer}>
        <Card>
          <Card.Content>
            <Title>Добавить результат</Title>

            {/* Выбор дисциплины */}
            <Menu
              visible={disciplineMenuVisible}
              onDismiss={() => setDisciplineMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  style={styles.input}
                  onPress={() => setDisciplineMenuVisible(true)}>
                  {selectedDiscipline ? selectedDiscipline.name : 'Выберите дисциплину'}
                </Button>
              }>
              {disciplines.map(discipline => (
                <DisciplineMenuItem
                  key={discipline.id}
                  discipline={discipline}
                  onSelect={selectedDiscipline => {
                    setSelectedDiscipline(selectedDiscipline);
                    setDisciplineMenuVisible(false);
                  }}
                />
              ))}
            </Menu>

            {/* Выбор ученика */}
            <Menu
              visible={studentMenuVisible}
              onDismiss={() => setStudentMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  style={styles.input}
                  onPress={() => setStudentMenuVisible(true)}>
                  {selectedStudent ? selectedStudent.name : 'Выберите ученика'}
                </Button>
              }>
              {students.map(student => (
                <StudentMenuItem
                  key={student.id}
                  student={student}
                  onSelect={selectedStudent => {
                    setSelectedStudent(selectedStudent);
                    setStudentMenuVisible(false);
                  }}
                />
              ))}
            </Menu>

            {/* Выбор возрастной группы */}
            <Menu
              visible={ageGroupMenuVisible}
              onDismiss={() => setAgeGroupMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  style={styles.input}
                  onPress={() => setAgeGroupMenuVisible(true)}>
                  {selectedAgeGroup || 'Выберите возрастную группу'}
                </Button>
              }>
              {AGE_GROUPS.map(ageGroup => (
                <AgeGroupMenuItem
                  key={ageGroup}
                  ageGroup={ageGroup}
                  onSelect={selectedAgeGroup => {
                    setSelectedAgeGroup(selectedAgeGroup);
                    setAgeGroupMenuVisible(false);
                  }}
                />
              ))}
            </Menu>

            {/* Значение результата */}
            <TextInput
              label="Результат (мс для времени)"
              value={resultValue}
              onChangeText={setResultValue}
              mode="outlined"
              keyboardType="numeric"
              style={styles.input}
            />

            {/* Примечания */}
            <TextInput
              label="Примечания"
              value={notes}
              onChangeText={setNotes}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
            />

            {/* Кнопки действий */}
            <View style={styles.modalActions}>
              <Button
                mode="outlined"
                onPress={() => setIsAddingResult(false)}
                style={styles.modalButton}>
                Отмена
              </Button>
              <Button mode="contained" onPress={handleAddResult} style={styles.modalButton}>
                Добавить
              </Button>
            </View>
          </Card.Content>
        </Card>
      </Modal>

      {/* Модальное окно для добавления дисциплины */}
      <Modal
        visible={isAddingDiscipline}
        onDismiss={() => setIsAddingDiscipline(false)}
        contentContainerStyle={styles.modalContainer}>
        <Card>
          <Card.Content>
            <Title>Добавить дисциплину</Title>

            <TextInput
              label="Название дисциплины *"
              value={newDisciplineName}
              onChangeText={setNewDisciplineName}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Описание"
              value={newDisciplineDescription}
              onChangeText={setNewDisciplineDescription}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
            />

            <Menu
              visible={disciplineUnitMenuVisible}
              onDismiss={() => setDisciplineUnitMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  style={styles.input}
                  onPress={() => setDisciplineUnitMenuVisible(true)}>
                  Единица измерения:{' '}
                  {newDisciplineUnit === 'time'
                    ? 'Время (мс)'
                    : newDisciplineUnit === 'distance'
                      ? 'Дистанция (см)'
                      : 'Очки'}
                </Button>
              }>
              <Menu.Item
                onPress={() => {
                  setNewDisciplineUnit('time');
                  setDisciplineUnitMenuVisible(false);
                }}
                title="Время (мс)"
              />
              <Menu.Item
                onPress={() => {
                  setNewDisciplineUnit('distance');
                  setDisciplineUnitMenuVisible(false);
                }}
                title="Дистанция (см)"
              />
              <Menu.Item
                onPress={() => {
                  setNewDisciplineUnit('points');
                  setDisciplineUnitMenuVisible(false);
                }}
                title="Очки"
              />
            </Menu>

            <View style={styles.modalActions}>
              <Button
                mode="outlined"
                onPress={() => setIsAddingDiscipline(false)}
                style={styles.modalButton}>
                Отмена
              </Button>
              <Button mode="contained" onPress={handleAddDiscipline} style={styles.modalButton}>
                Добавить
              </Button>
            </View>
          </Card.Content>
        </Card>
      </Modal>

      {/* Модальное окно для просмотра топ результатов */}
      <Modal
        visible={showTopResults}
        onDismiss={() => setShowTopResults(false)}
        contentContainerStyle={styles.modalContainer}>
        <Card>
          <Card.Content>
            <Title>Топ результатов</Title>

            {/* Выбор дисциплины */}
            <Menu
              visible={topDisciplineMenuVisible}
              onDismiss={() => setTopDisciplineMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  style={styles.input}
                  onPress={() => setTopDisciplineMenuVisible(true)}>
                  {selectedTopDiscipline ? selectedTopDiscipline.name : 'Выберите дисциплину'}
                </Button>
              }>
              {disciplines.map(discipline => (
                <Menu.Item
                  key={discipline.id}
                  onPress={() => {
                    setSelectedTopDiscipline(discipline);
                    setTopDisciplineMenuVisible(false);
                  }}
                  title={discipline.name}
                />
              ))}
            </Menu>

            {/* Выбор возрастной группы */}
            <Menu
              visible={topAgeGroupMenuVisible}
              onDismiss={() => setTopAgeGroupMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  style={styles.input}
                  onPress={() => setTopAgeGroupMenuVisible(true)}>
                  {selectedTopAgeGroup || 'Выберите возрастную группу'}
                </Button>
              }>
              {AGE_GROUPS.map(ageGroup => (
                <Menu.Item
                  key={ageGroup}
                  onPress={() => {
                    setSelectedTopAgeGroup(ageGroup);
                    setTopAgeGroupMenuVisible(false);
                  }}
                  title={ageGroup}
                />
              ))}
            </Menu>

            {/* Кнопка загрузки результатов */}
            <Button
              mode="contained"
              onPress={loadTopResults}
              style={styles.input}
              disabled={!selectedTopDiscipline || !selectedTopAgeGroup}>
              Показать топ
            </Button>

            {/* Таблица с топ результатами */}
            {topResults.length > 0 && (
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Место</DataTable.Title>
                  <DataTable.Title>Ученик</DataTable.Title>
                  <DataTable.Title>Результат</DataTable.Title>
                  <DataTable.Title>Дата</DataTable.Title>
                </DataTable.Header>
                <FlatList
                  data={topResults}
                  keyExtractor={item => item.id}
                  renderItem={({ item, index }) => (
                    <DataTable.Row key={item.id}>
                      <DataTable.Cell>{index + 1}</DataTable.Cell>
                      <DataTable.Cell>{item.user?.name || 'Неизвестно'}</DataTable.Cell>
                      <DataTable.Cell>
                        {formatResultValue(item.result_value, item.discipline?.unit || 'time')}
                      </DataTable.Cell>
                      <DataTable.Cell>
                        {new Date(item.date_recorded).toLocaleDateString()}
                      </DataTable.Cell>
                    </DataTable.Row>
                  )}
                />
              </DataTable>
            )}

            {/* Кнопки действий */}
            <View style={styles.modalActions}>
              <Button
                mode="outlined"
                onPress={() => setShowTopResults(false)}
                style={styles.modalButton}>
                Закрыть
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
    backgroundColor: COLORS.background, // Используем цвет Arsenal
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary, // Используем цвет Arsenal
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary, // Используем цвет Arsenal
    textAlign: 'center',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
    marginVertical: 4,
  },
  resultsCard: {
    marginBottom: 16,
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
  disciplinesCard: {
    marginBottom: 16,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: COLORS.text, // Используем цвет Arsenal
  },
  disciplinesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  disciplineChip: {
    margin: 4,
  },
  errorCard: {
    margin: 16,
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
  errorContent: {
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    color: COLORS.textSecondary, // Используем цвет Arsenal
  },
  backButton: {
    marginTop: 8,
  },
  modalContainer: {
    backgroundColor: COLORS.surface, // Используем цвет Arsenal
    margin: 20,
    padding: 20,
    borderRadius: 8,
  },
  input: {
    marginBottom: 16,
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

// Мемоизированный компонент для отображения строки результата
const ResultRow = memo(
  ({
    result,
    formatResultValue,
    formatResultDifference,
    onArchiveResult,
  }: {
    result: any;
    formatResultValue: (value: number, unit: string) => string;
    formatResultDifference: (actual: number, standard: number, unit: string) => string;
    onArchiveResult: (id: string) => void;
  }) => {
    return (
      <DataTable.Row key={result.id}>
        <DataTable.Cell>{result.user?.name || 'Неизвестно'}</DataTable.Cell>
        <DataTable.Cell>{result.discipline?.name || 'Неизвестно'}</DataTable.Cell>
        <DataTable.Cell>
          {formatResultValue(result.result_value, result.discipline?.unit || 'time')}
        </DataTable.Cell>
        <DataTable.Cell>
          {result.standard_result
            ? `${formatResultValue(result.standard_result, result.discipline?.unit || 'time')} (${formatResultDifference(result.result_value, result.standard_result, result.discipline?.unit || 'time')})`
            : 'Не установлен'}
        </DataTable.Cell>
        <DataTable.Cell>{result.age_group}</DataTable.Cell>
        <DataTable.Cell>{new Date(result.date_recorded).toLocaleDateString()}</DataTable.Cell>
        <DataTable.Cell>
          <IconButton
            icon="archive"
            size={20}
            onPress={() => onArchiveResult(result.id)}
            iconColor={COLORS.primary} // Используем цвет Arsenal
          />
        </DataTable.Cell>
      </DataTable.Row>
    );
  }
);

// Мемоизированный компонент для отображения чипа дисциплины
const DisciplineChip = memo(({ discipline }: { discipline: any }) => {
  return (
    <Chip key={discipline.id} mode="outlined" style={styles.disciplineChip}>
      {discipline.name} ({discipline.unit})
    </Chip>
  );
});

// Мемоизированный компонент для пункта меню дисциплины
const DisciplineMenuItem = memo(
  ({ discipline, onSelect }: { discipline: any; onSelect: (discipline: any) => void }) => {
    return (
      <Menu.Item key={discipline.id} onPress={() => onSelect(discipline)} title={discipline.name} />
    );
  }
);

// Мемоизированный компонент для пункта меню ученика
const StudentMenuItem = memo(
  ({ student, onSelect }: { student: any; onSelect: (student: any) => void }) => {
    return <Menu.Item key={student.id} onPress={() => onSelect(student)} title={student.name} />;
  }
);

// Мемоизированный компонент для пункта меню возрастной группы
const AgeGroupMenuItem = memo(
  ({ ageGroup, onSelect }: { ageGroup: string; onSelect: (ageGroup: string) => void }) => {
    return <Menu.Item key={ageGroup} onPress={() => onSelect(ageGroup)} title={ageGroup} />;
  }
);
