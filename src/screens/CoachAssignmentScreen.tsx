import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, FlatList } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator, Searchbar } from 'react-native-paper';
import { useAuth } from '../context/LocalStorageAuthContext';
import { useMySQLAuth } from '../context/MySQLAuthContext';
import { useDatabase } from '../context/DatabaseContext';
import { useBranch } from '../context/BranchContext';
import { ArsenalButton } from '../components/ArsenalButton';
import { UserService } from '../services/UserService';
import * as BranchService from '../services/BranchService';
import * as CoachAssignmentService from '../services/CoachAssignmentService';
import { COLORS } from '../constants';

export const CoachAssignmentScreen: React.FC = () => {
  const [coaches, setCoaches] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { databaseType } = useDatabase();
  const { user: localStorageUser } = useAuth();
  const { user: mySQLUser } = useMySQLAuth();
  const { branches: branchContextBranches } = useBranch();

  const currentUser = databaseType === 'mysql' ? mySQLUser : localStorageUser;

  // Загрузка данных
  const loadData = async () => {
    setLoading(true);
    try {
      // Получаем тренеров
      const allUsers = await UserService.getAllUsers();
      const coachUsers = allUsers.filter(user => user.role === 'coach');
      setCoaches(coachUsers);

      // Получаем филиалы
      const branchList = await BranchService.getBranches();
      setBranches(branchList);

      // Получаем назначения с деталями
      const assignmentList = await CoachAssignmentService.getAssignmentsWithDetails();
      setAssignments(assignmentList);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Назначение тренера филиалу
  const handleAssignCoach = async (coachId: string, branchId: string) => {
    if (!currentUser) {
      return;
    }

    try {
      await CoachAssignmentService.assignCoachToBranch(coachId, branchId, currentUser.id);
      Alert.alert('Успех', 'Тренер успешно назначен филиалу');
      // Обновляем список назначений
      const updatedAssignments = await CoachAssignmentService.getAssignmentsWithDetails();
      setAssignments(updatedAssignments);
    } catch (error: any) {
      console.error('Ошибка назначения тренера:', error);
      Alert.alert('Ошибка', error.message || 'Не удалось назначить тренера филиалу');
    }
  };

  // Отмена назначения тренера филиалу
  const handleRemoveAssignment = async (
    coachId: string,
    branchId: string,
    assignmentName: string
  ) => {
    Alert.alert('Подтверждение', `Вы уверены, что хотите отменить назначение ${assignmentName}?`, [
      {
        text: 'Отмена',
        style: 'cancel',
      },
      {
        text: 'Отменить',
        style: 'destructive',
        onPress: async () => {
          try {
            await CoachAssignmentService.removeCoachFromBranch(coachId, branchId);
            Alert.alert('Успех', 'Назначение успешно отменено');
            // Обновляем список назначений
            const updatedAssignments = await CoachAssignmentService.getAssignmentsWithDetails();
            setAssignments(updatedAssignments);
          } catch (error) {
            console.error('Ошибка отмены назначения:', error);
            Alert.alert('Ошибка', 'Не удалось отменить назначение');
          }
        },
      },
    ]);
  };

  // Фильтрация назначений по поисковому запросу
  const filteredAssignments = assignments.filter(
    assignment =>
      assignment.coachName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.branchName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Рендер элемента тренера для назначения
  const renderCoachItem = ({ item }: { item: any }) => (
    <Card style={styles.coachCard}>
      <Card.Content>
        <Title style={styles.coachName}>{item.name}</Title>
        <Paragraph style={styles.coachEmail}>{item.email}</Paragraph>

        <View style={styles.branchesContainer}>
          <Paragraph style={styles.sectionTitle}>Назначить филиал:</Paragraph>
          {branches.map(branch => (
            <View key={branch.id} style={styles.branchButtonContainer}>
              <ArsenalButton
                title={branch.name}
                variant="outline"
                onPress={() => handleAssignCoach(item.id, branch.id)}
                style={styles.branchButton}
              />
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  // Рендер элемента назначения
  const renderAssignmentItem = ({ item }: { item: any }) => (
    <Card style={styles.assignmentCard}>
      <Card.Content>
        <Title style={styles.assignmentTitle}>{item.coachName}</Title>
        <Paragraph style={styles.assignmentDetail}>
          Филиал: <Text style={styles.detailValue}>{item.branchName}</Text>
        </Paragraph>
        <Paragraph style={styles.assignmentDetail}>
          Назначил: <Text style={styles.detailValue}>{item.assignedByName}</Text>
        </Paragraph>
        <Paragraph style={styles.assignmentDetail}>
          Дата:{' '}
          <Text style={styles.detailValue}>{new Date(item.assignedAt).toLocaleDateString()}</Text>
        </Paragraph>

        <ArsenalButton
          title="Отменить назначение"
          variant="outline"
          onPress={() =>
            handleRemoveAssignment(
              String(item.coachId),
              String(item.branchId),
              `${item.coachName} - ${item.branchName}`
            )
          }
          style={styles.removeButton}
        />
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Paragraph style={styles.loadingText}>Загрузка данных...</Paragraph>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title style={styles.title}>Назначение тренеров филиалам</Title>
          <Paragraph>
            Текущий тип базы данных: {databaseType === 'mysql' ? 'MySQL' : 'Локальное хранилище'}
          </Paragraph>
          {currentUser && (
            <Paragraph>
              Вы вошли как: {currentUser.name} ({currentUser.role})
            </Paragraph>
          )}
        </Card.Content>
      </Card>

      <Searchbar
        placeholder="Поиск назначений..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      {/* Список тренеров для назначения */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Тренеры для назначения</Title>
          <Paragraph style={styles.sectionDescription}>
            Выберите тренера и назначьте ему филиал
          </Paragraph>
        </Card.Content>
      </Card>

      <FlatList
        data={coaches}
        renderItem={renderCoachItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Paragraph style={styles.emptyText}>Нет тренеров для отображения</Paragraph>
            </Card.Content>
          </Card>
        }
      />

      {/* Список текущих назначений */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Текущие назначения</Title>
          <Paragraph style={styles.sectionDescription}>
            Список назначенных тренеров филиалам
          </Paragraph>
        </Card.Content>
      </Card>

      <FlatList
        data={filteredAssignments}
        renderItem={renderAssignmentItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Paragraph style={styles.emptyText}>
                {searchQuery ? 'Назначения не найдены' : 'Нет текущих назначений'}
              </Paragraph>
            </Card.Content>
          </Card>
        }
      />
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
  },
  headerCard: {
    margin: 16,
    marginBottom: 8,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  searchBar: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  sectionCard: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    fontStyle: 'italic',
    color: COLORS.textSecondary,
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  coachCard: {
    marginBottom: 16,
  },
  coachName: {
    fontSize: 18,
    marginBottom: 4,
  },
  coachEmail: {
    marginBottom: 12,
    color: COLORS.textSecondary,
  },
  branchesContainer: {
    marginTop: 8,
  },
  branchButtonContainer: {
    marginVertical: 4,
  },
  branchButton: {
    marginVertical: 2,
  },
  assignmentCard: {
    marginBottom: 16,
  },
  assignmentTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  assignmentDetail: {
    marginBottom: 4,
  },
  detailValue: {
    fontWeight: 'bold',
  },
  removeButton: {
    marginTop: 12,
    borderColor: COLORS.error,
  },
  emptyCard: {
    marginVertical: 32,
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
