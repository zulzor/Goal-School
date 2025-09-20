import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, TextInput, Button, Text } from 'react-native-paper';
import { testPasswordHashing } from '../utils/passwordTest';
import { useAuth, UserRole } from '../context/LocalStorageAuthContext';
import { UnderDevelopmentBanner } from './UnderDevelopmentBanner';

export const PasswordTestComponent: React.FC = () => {
  const [password1, setPassword1] = useState('password123');
  const [password2, setPassword2] = useState('password123');
  const [result, setResult] = useState('');
  const { user } = useAuth();

  // Показываем заглушку для экрана в разработке
  if (user?.role === UserRole.MANAGER) {
    return (
      <UnderDevelopmentBanner
        title="Тестирование хэширования паролей"
        description="Этот раздел находится в активной разработке. Функционал тестирования хэширования паролей будет доступен в следующем обновлении."
      />
    );
  }

  const handleTestHashing = () => {
    const testResult = testPasswordHashing();
    setResult(JSON.stringify(testResult, null, 2));
  };

  const handleCustomTest = () => {
    // Функция для создания хэша пароля (упрощенная реализация)
    const hashPassword = (password: string): string => {
      return btoa(password);
    };

    // Функция для проверки хэша пароля
    const verifyPassword = (password: string, hash: string): boolean => {
      return btoa(password) === hash;
    };

    const hashed1 = hashPassword(password1);
    const hashed2 = hashPassword(password2);
    const verification = verifyPassword(password2, hashed1);

    setResult(
      `Пароль 1: "${password1}" -> Хэш: "${hashed1}"\nПароль 2: "${password2}" -> Хэш: "${hashed2}"\nСовпадают: ${verification}`
    );
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title>Тестирование хэширования паролей</Title>

        <TextInput
          label="Пароль 1"
          value={password1}
          onChangeText={setPassword1}
          style={styles.input}
        />

        <TextInput
          label="Пароль 2"
          value={password2}
          onChangeText={setPassword2}
          style={styles.input}
        />

        <Button mode="contained" onPress={handleTestHashing} style={styles.button}>
          Запустить стандартный тест
        </Button>

        <Button mode="outlined" onPress={handleCustomTest} style={styles.button}>
          Сравнить пароли
        </Button>

        <Paragraph style={styles.resultTitle}>Результаты:</Paragraph>
        <Text style={styles.resultText}>{result}</Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginVertical: 8,
  },
  resultTitle: {
    marginTop: 16,
    fontWeight: 'bold',
  },
  resultText: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    fontFamily: 'monospace',
    fontSize: 12,
  },
});
