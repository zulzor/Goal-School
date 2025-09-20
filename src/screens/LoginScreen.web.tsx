import React, { useState } from 'react';
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
import { useAuth, UserRole } from '../context/LocalStorageAuthContext';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants';
import { ArsenalButton } from '../components/ArsenalButton';

interface LoginScreenProps {
  onTestLogin?: (user: any) => void;
  testUsers?: any[];
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onTestLogin, testUsers }) => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

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
      await login(email, password);
    } catch (err) {
      console.error('Login error:', err);
      Alert.alert('Ошибка', 'Произошла ошибка при входе. Пожалуйста, попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  const handleTestLogin = (testUser: any) => {
    if (onTestLogin) {
      onTestLogin(testUser);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Вход в систему</Title>

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

          {/* Тестовые пользователи для веб-версии */}
          {testUsers && testUsers.length > 0 && (
            <View style={styles.testUsersSection}>
              <Title style={styles.sectionTitle}>Тестовые пользователи</Title>
              <Paragraph style={styles.sectionDescription}>
                Для демонстрации функционала используйте следующие учетные записи:
              </Paragraph>
              {testUsers.map(user => (
                <ArsenalButton
                  key={user.id}
                  title={`${user.name} (${user.role === UserRole.MANAGER ? 'Менеджер' : 
                           user.role === UserRole.COACH ? 'Тренер' : 
                           user.role === UserRole.PARENT ? 'Родитель' : 
                           user.role === UserRole.CHILD ? 'Ученик' : 
                           user.role === UserRole.SMM_MANAGER ? 'SMM-менеджер' : user.role})`}
                  variant="outline"
                  onPress={() => handleTestLogin(user)}
                  style={styles.testUserButton}
                />
              ))}
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
    backgroundColor: COLORS.background,
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
  testUsersSection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
  },
  sectionTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionDescription: {
    textAlign: 'center',
    marginBottom: 16,
  },
  testUserButton: {
    marginTop: 8,
  },
});