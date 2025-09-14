import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../context/LocalStorageAuthContext';
import { ArsenalButton } from '../components/ArsenalButton';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants'; // Импортируем цвета Arsenal

// Функция для создания тестовых пользователей (заглушка для демонстрации)
const createTestUsers = async () => {
  // В реальной реализации здесь будет код для создания тестовых пользователей
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Тестовые пользователи успешно созданы',
      });
    }, 2000);
  });
};

export const AdminPanel: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCreateTestUsers = async () => {
    setLoading(true);
    try {
      const result: any = await createTestUsers();
      if (result.success) {
        Alert.alert('Успех', result.message, [{ text: 'OK' }]);
      } else {
        Alert.alert('Ошибка', result.message || 'Не удалось создать тестовых пользователей', [
          { text: 'OK' },
        ]);
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Произошла ошибка при создании тестовых пользователей', [
        { text: 'OK' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Админ-панель</Title>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Добро пожаловать, {user?.name}!</Title>
          <Paragraph>Вы вошли как администратор. Здесь вы можете управлять приложением.</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Управление пользователями</Title>
          <Paragraph>Создание и управление учетными записями пользователей.</Paragraph>
          <ArsenalButton
            title="Управление пользователями"
            variant="primary"
            onPress={() => navigation.navigate('Users' as never)}
            style={styles.button}
          />

          <Title style={styles.sectionTitle}>Тестовые пользователи</Title>
          <Paragraph>Создайте тестовых пользователей для каждой роли:</Paragraph>
          <Paragraph>• Администратор (admin@example.com)</Paragraph>
          <Paragraph>• Менеджер (manager@example.com)</Paragraph>
          <Paragraph>• Тренер (coach@example.com)</Paragraph>
          <Paragraph>• Родитель (parent@example.com)</Paragraph>
          <Paragraph>• Ученик (student@example.com)</Paragraph>

          <ArsenalButton
            title={loading ? 'Создание...' : 'Создать тестовых пользователей'}
            variant="outline"
            onPress={handleCreateTestUsers}
            loading={loading}
            disabled={loading}
            style={styles.button}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Аналитика</Title>
          <Paragraph>Просмотр статистики и аналитических данных.</Paragraph>
          <ArsenalButton
            title="Перейти к аналитике"
            variant="primary"
            onPress={() => navigation.navigate('Analytics' as never)}
            style={styles.button}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Управление навыками</Title>
          <Paragraph>Управление каталогом навыков учеников.</Paragraph>
          <ArsenalButton
            title="Управление навыками"
            variant="primary"
            onPress={() => navigation.navigate('Skills' as never)}
            style={styles.button}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Настройки базы данных</Title>
          <Paragraph>Управление типом базы данных и подключением.</Paragraph>
          <ArsenalButton
            title="Настройки базы данных"
            variant="primary"
            onPress={() => navigation.navigate('Database' as never)}
            style={styles.button}
          />
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.background, // Используем цвет Arsenal
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 8,
  },
});
