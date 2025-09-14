import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Card, Title, Paragraph, TextInput, Button, Text } from 'react-native-paper';
import { useAuth, UserRole } from '../context/LocalStorageAuthContext';
import { checkUsers } from '../utils/checkUsers';
import { COLORS } from '../constants';
import { PasswordTestComponent } from '../components/PasswordTestComponent';
import { UnderDevelopmentBanner } from '../components/UnderDevelopmentBanner';

export default function DebugAuthScreen() {
  const [email, setEmail] = useState('admin3@gs.com');
  const [password, setPassword] = useState('admin'); // Используем правильный пароль
  const [debugInfo, setDebugInfo] = useState('');
  const { login, createTestUser, logout, user } = useAuth();

  // Показываем заглушку для экрана в разработке
  if (user?.role === UserRole.MANAGER) {
    return (
      <UnderDevelopmentBanner
        title="Отладка аутентификации"
        description="Этот раздел находится в активной разработке. Функционал отладки аутентификации будет доступен в следующем обновлении."
      />
    );
  }

  const handleLogin = async () => {
    try {
      setDebugInfo('Попытка входа...');
      const result = await login(email, password);
      setDebugInfo(`Результат входа: ${JSON.stringify(result)}`);
      Alert.alert('Результат', result?.message || 'успешно');
    } catch (error: any) {
      setDebugInfo(`Ошибка входа: ${error.message}`);
      Alert.alert('Ошибка', error.message);
    }
  };

  const handleCreateTestUsers = async () => {
    try {
      setDebugInfo('Создание тестовых пользователей...');
      const roles = ['CHILD', 'PARENT', 'MANAGER', 'COACH', 'SMM_MANAGER'];

      for (const role of roles) {
        try {
          const result = await (createTestUser && createTestUser(role as any));
          setDebugInfo(
            prev => prev + `\nСоздан пользователь ${role}: ${result?.message || 'успешно'}`
          );
        } catch (error: any) {
          setDebugInfo(prev => prev + `\nОшибка создания ${role}: ${error.message}`);
        }
      }

      Alert.alert('Готово', 'Тестовые пользователи созданы');
    } catch (error: any) {
      setDebugInfo(`Ошибка создания пользователей: ${error.message}`);
      Alert.alert('Ошибка', error.message);
    }
  };

  const handleCheckUsers = async () => {
    try {
      setDebugInfo('Проверка пользователей...');
      const users = await checkUsers();
      setDebugInfo(`Найдено пользователей: ${users.length}\n${JSON.stringify(users, null, 2)}`);
    } catch (error: any) {
      setDebugInfo(`Ошибка проверки пользователей: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setDebugInfo('Выход выполнен');
      Alert.alert('Готово', 'Выход выполнен');
    } catch (error: any) {
      setDebugInfo(`Ошибка выхода: ${error.message}`);
      Alert.alert('Ошибка', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Отладка аутентификации</Title>

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            label="Пароль"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />

          <Button mode="contained" onPress={handleLogin} style={styles.button}>
            Войти
          </Button>

          <Button mode="outlined" onPress={handleCreateTestUsers} style={styles.button}>
            Создать тестовых пользователей
          </Button>

          <Button mode="outlined" onPress={handleCheckUsers} style={styles.button}>
            Проверить пользователей
          </Button>

          <Button mode="outlined" onPress={handleLogout} style={styles.button}>
            Выйти
          </Button>

          <Paragraph style={styles.debugTitle}>Отладочная информация:</Paragraph>
          <Text style={styles.debugInfo}>{debugInfo}</Text>
        </Card.Content>
      </Card>

      <PasswordTestComponent />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  card: {
    margin: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginVertical: 8,
  },
  debugTitle: {
    marginTop: 16,
    fontWeight: 'bold',
  },
  debugInfo: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    fontFamily: 'monospace',
    fontSize: 12,
  },
});
