import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, FlatList, Platform } from 'react-native';
import { Card, Title, Paragraph, Searchbar, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../context/LocalStorageAuthContext';
import { useMySQLAuth } from '../context/MySQLAuthContext';
import { useDatabase } from '../context/DatabaseContext';
import { ArsenalButton } from '../components/ArsenalButton';
import { UserService } from '../services/UserService'; // Импортируем реальный сервис
import { COLORS } from '../constants'; // Импортируем цвета Arsenal

export const UserManagementScreen: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const { databaseType } = useDatabase();
  const { user: localStorageUser } = useAuth();
  const { user: mySQLUser } = useMySQLAuth();

  const currentUser = databaseType === 'mysql' ? mySQLUser : localStorageUser;

  // Функция для получения пользователей с фильтрацией
  const fetchUsers = async (searchQuery: string = ''): Promise<any[]> => {
    try {
      // В реальной реализации здесь будет код для получения пользователей из базы данных
      const allUsers = await UserService.getAllUsers();

      if (searchQuery) {
        const filtered = allUsers.filter(
          user =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.role.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return filtered;
      } else {
        return allUsers;
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const fetchedUsers = await fetchUsers(searchQuery);
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить список пользователей');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const fetchedUsers = await fetchUsers(searchQuery);
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error refreshing users:', error);
      Alert.alert('Ошибка', 'Не удалось обновить список пользователей');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [searchQuery]);

  const handleDeleteUser = (userId: string, userName: string) => {
    Alert.alert(
      'Подтверждение удаления',
      `Вы уверены, что хотите удалить пользователя ${userName}?`,
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              await UserService.deleteUser(userId);
              // Обновляем список пользователей
              loadUsers();
              Alert.alert('Успех', 'Пользователь успешно удален');
            } catch (error) {
              console.error('Error deleting user:', error);
              Alert.alert('Ошибка', 'Не удалось удалить пользователя');
            }
          },
        },
      ]
    );
  };

  const renderUserItem = ({ item }: { item: any }) => (
    <Card style={styles.userCard}>
      <Card.Content>
        <Title style={styles.userName}>{item.name}</Title>
        <Paragraph style={styles.userEmail}>{item.email}</Paragraph>
        <Paragraph style={styles.userRole}>
          Роль: <Text style={styles.roleText}>{item.role}</Text>
        </Paragraph>
        <View style={styles.buttonContainer}>
          <ArsenalButton
            title="Редактировать"
            variant="outline"
            onPress={() =>
              Alert.alert('Редактирование', `Редактирование пользователя ${item.name}`)
            }
            style={styles.actionButton}
          />
          <ArsenalButton
            title="Удалить"
            variant="outline"
            onPress={() => handleDeleteUser(item.id, item.name)}
            style={styles.actionButton}
          />
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title style={styles.title}>Управление пользователями</Title>
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
        placeholder="Поиск пользователей..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Paragraph style={styles.loadingText}>Загрузка пользователей...</Paragraph>
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={item => item.id.toString()}
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Paragraph style={styles.emptyText}>
                  {searchQuery ? 'Пользователи не найдены' : 'Нет пользователей для отображения'}
                </Paragraph>
              </Card.Content>
            </Card>
          }
        />
      )}

      <Card style={styles.footerCard}>
        <Card.Content>
          <Paragraph style={styles.footerText}>Всего пользователей: {users.length}</Paragraph>
          <ArsenalButton
            title="Создать пользователя"
            variant="primary"
            onPress={() => Alert.alert('Создание', 'Создание нового пользователя')}
            style={styles.createButton}
          />
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // Используем цвет Arsenal
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
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  userCard: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 18,
    marginBottom: 4,
  },
  userEmail: {
    marginBottom: 4,
  },
  userRole: {
    marginBottom: 12,
  },
  roleText: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
  emptyCard: {
    marginVertical: 32,
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footerCard: {
    margin: 16,
    marginTop: 8,
  },
  footerText: {
    textAlign: 'center',
    marginBottom: 16,
  },
  createButton: {
    alignSelf: 'center',
  },
});
