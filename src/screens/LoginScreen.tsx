import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import {
  TextInput,
  Button,
  Text,
  ActivityIndicator,
  Card,
  Title,
  Paragraph,
} from 'react-native-paper';
import { useAuth } from '../context/LocalStorageAuthContext';
import { useMySQLAuth } from '../context/MySQLAuthContext';
import { useDatabase } from '../context/DatabaseContext';
import { ArsenalButton } from '../components/ArsenalButton';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants'; // Импортируем цвета Arsenal

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { databaseType, isMySQLAvailable } = useDatabase();

  // Используем соответствующий контекст в зависимости от типа базы данных
  const localStorageAuth = useAuth();
  const mySQLAuth = useMySQLAuth();

  const authContext = databaseType === 'mysql' ? mySQLAuth : localStorageAuth;

  const { login, error } = authContext;

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      return;
    }

    // Проверка формата email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Ошибка', 'Пожалуйста, введите корректный email');
      return;
    }

    setLoading(true);

    try {
      const success = await login(email, password);

      if (!success) {
        Alert.alert('Ошибка входа', error || 'Неверный email или пароль');
      }
    } catch (err) {
      console.error('Login error:', err);
      Alert.alert('Ошибка', 'Произошла ошибка при входе. Пожалуйста, попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Вход в систему</Title>

          {databaseType === 'mysql' && !isMySQLAvailable && (
            <Paragraph style={styles.warning}>
              MySQL недоступен. Приложение использует локальное хранилище.
            </Paragraph>
          )}

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            mode="outlined"
          />

          <TextInput
            label="Пароль"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
            mode="outlined"
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <ArsenalButton
            title={loading ? 'Вход...' : 'Войти'}
            variant="primary"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.button}
          />

          <ArsenalButton
            title="Нет аккаунта? Зарегистрируйтесь"
            variant="text"
            onPress={() => navigation.navigate('Register' as never)}
            style={styles.linkButton}
          />

          {databaseType === 'mysql' && (
            <View style={styles.infoSection}>
              <Title style={styles.infoTitle}>Информация</Title>
              <Paragraph>
                Приложение использует MySQL для хранения данных. Это позволяет синхронизировать
                данные между устройствами.
              </Paragraph>
            </View>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: COLORS.background, // Используем цвет Arsenal
  },
  card: {
    ...Platform.select({
      web: {
        maxWidth: 400,
        alignSelf: 'center',
        width: '100%',
      },
    }),
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  linkButton: {
    marginTop: 16,
  },
  errorText: {
    color: COLORS.error, // Используем цвет Arsenal
    marginBottom: 16,
    textAlign: 'center',
  },
  warning: {
    color: COLORS.warning, // Используем цвет Arsenal
    marginBottom: 16,
    textAlign: 'center',
    padding: 8,
    backgroundColor: COLORS.surface, // Используем цвет Arsenal
    borderRadius: 4,
  },
  infoSection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: COLORS.surface, // Используем цвет Arsenal
    borderRadius: 8,
  },
  infoTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
});
