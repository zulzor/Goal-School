import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Searchbar, Avatar, IconButton, Menu, Divider } from 'react-native-paper';
import { COLORS, USER_ROLES } from '../constants';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  lastActive?: string;
  isActive: boolean;
}

interface AdminUserListProps {
  users: AdminUser[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onChangeRole: (id: string, newRole: string) => void;
  title?: string;
}

export const AdminUserList: React.FC<AdminUserListProps> = ({
  users,
  onEdit,
  onDelete,
  onChangeRole,
  title = 'Пользователи',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  // Фильтрация пользователей по поисковому запросу
  const filteredUsers = users.filter(
    user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      USER_ROLES[user.role].toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Форматирование даты последней активности
  const formatLastActive = (dateString?: string) => {
    if (!dateString) return 'Никогда';

    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Менее часа назад';
    if (diffInHours < 24) return `${diffInHours} ч назад`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} дн назад`;
  };

  const renderUserItem = ({ item }: { item: AdminUser }) => (
    <Card style={styles.userCard}>
      <Card.Content style={styles.cardContent}>
        {item.avatar ? (
          <Avatar.Image source={{ uri: item.avatar }} size={48} />
        ) : (
          <Avatar.Text label={item.name.charAt(0)} size={48} />
        )}

        <View style={styles.infoContainer}>
          <Text style={[styles.nameText, !item.isActive && styles.inactiveText]}>{item.name}</Text>
          <Text style={styles.emailText}>{item.email}</Text>
          <View style={styles.metaContainer}>
            <Text style={styles.roleText}>{USER_ROLES[item.role]}</Text>
            <Text style={styles.lastActiveText}>
              Активность: {formatLastActive(item.lastActive)}
            </Text>
          </View>
        </View>

        <Menu
          visible={menuVisible === item.id}
          onDismiss={() => setMenuVisible(null)}
          anchor={
            <IconButton
              icon="dots-vertical"
              size={24}
              onPress={() => setMenuVisible(item.id)}
              style={styles.menuButton}
            />
          }>
          <Menu.Item
            onPress={() => {
              setMenuVisible(null);
              onEdit(item.id);
            }}
            title="Редактировать"
            icon="pencil"
          />
          <Divider />
          <Menu.Item
            onPress={() => {
              setMenuVisible(null);
              // Открываем подменю для изменения роли
              // В реальном приложении здесь будет более сложная логика
              console.log('Изменить роль для пользователя:', item.id);
            }}
            title="Изменить роль"
            icon="account-switch"
          />
          <Divider />
          <Menu.Item
            onPress={() => {
              setMenuVisible(null);
              onDelete(item.id);
            }}
            title="Удалить"
            icon="delete"
            titleStyle={{ color: COLORS.error }}
          />
        </Menu>
      </Card.Content>
    </Card>
  );

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>{title}</Title>

        <Searchbar
          placeholder="Поиск пользователей..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        {filteredUsers.length > 0 ? (
          <FlatList
            data={filteredUsers}
            renderItem={renderUserItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Пользователи не найдены</Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  searchbar: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  userCard: {
    marginBottom: 12,
    elevation: 1,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  inactiveText: {
    color: COLORS.textSecondary,
  },
  emailText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  lastActiveText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  menuButton: {
    margin: 0,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});
