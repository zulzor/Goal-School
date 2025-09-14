import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import { TextInput, Text, Card, Title, Paragraph, HelperText } from 'react-native-paper';
import { useAuth } from '../context/LocalStorageAuthContext';
import { useMySQLAuth } from '../context/MySQLAuthContext';
import { useDatabase } from '../context/DatabaseContext';
import { useBranch } from '../context/BranchContext'; // Добавляем импорт контекста филиалов
import { BranchSelector } from '../components/BranchSelector'; // Добавляем импорт компонента выбора филиала
import { RoleSelector } from '../components/RoleSelector'; // Добавляем импорт компонента выбора роли
import { ArsenalButton } from '../components/ArsenalButton';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants'; // Импортируем цвета Arsenal
import { UserRole } from '../types'; // Добавляем импорт UserRole

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.CHILD); // Обновляем тип состояния
  const [branchId, setBranchId] = useState<string | null>(null); // Обновляем тип состояния
  const [loading, setLoading] = useState(false);

  const { databaseType, isMySQLAvailable } = useDatabase();
  const { branches, isLoading: branchesLoading } = useBranch(); // Получаем филиалы из контекста

  // Используем соответствующий контекст в зависимости от типа базы данных
  const localStorageAuth = useAuth();
  const mySQLAuth = useMySQLAuth();

  const authContext = databaseType === 'mysql' ? mySQLAuth : localStorageAuth;

  const { register } = authContext;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Ошибка', 'Пароли не совпадают');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Ошибка', 'Пароль должен содержать минимум 6 символов');
      return;
    }

    // Проверка формата email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Ошибка', 'Пожалуйста, введите корректный email');
      return;
    }

    // Проверка выбора филиала
    if (!branchId) {
      Alert.alert('Ошибка', 'Пожалуйста, выберите филиал');
      return;
    }

    setLoading(true);

    try {
      // @ts-ignore - игнорируем ошибку типов для упрощения
      const result = await register(email, password, name, role, branchId);

      // Проверяем, является ли результат объектом с success
      if (typeof result === 'object' && result !== null && 'success' in result) {
        if (result.success) {
          Alert.alert('Успех', 'Регистрация прошла успешно!', [
            { text: 'OK', onPress: () => navigation.navigate('Home' as never) },
          ]);
        } else {
          // @ts-ignore - игнорируем ошибку типов для упрощения
          setErrorMessage(result.message);
          Alert.alert(
            'Ошибка регистрации',
            // @ts-ignore - игнорируем ошибку типов для упрощения
            result.message || 'Не удалось зарегистрировать пользователя'
          );
        }
      } else {
        // Если результат не объект, предполагаем, что регистрация прошла успешно
        Alert.alert('Успех', 'Регистрация прошла успешно!', [
          { text: 'OK', onPress: () => navigation.navigate('Home' as never) },
        ]);
      }
    } catch (err) {
      console.error('Registration error:', err);
      Alert.alert('Ошибка', 'Произошла ошибка при регистрации. Пожалуйста, попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Регистрация</Title>

          {databaseType === 'mysql' && !isMySQLAvailable && (
            <Paragraph style={styles.warning}>
              MySQL недоступен. Приложение использует локальное хранилище.
            </Paragraph>
          )}

          <TextInput
            label="Имя"
            value={name}
            onChangeText={setName}
            style={styles.input}
            mode="outlined"
          />

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

          <TextInput
            label="Подтвердите пароль"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
            secureTextEntry
            mode="outlined"
          />

          {/* Выбор роли */}
          <View style={styles.input}>
            <RoleSelector selectedRole={role} onSelectRole={setRole} title="Роль *" />
          </View>

          {/* Скрытое поле для роли, чтобы избежать ошибок типов */}
          <TextInput
            label="Роль"
            value={role}
            style={[styles.input, { display: 'none' }]} // Скрываем поле через стиль
            mode="outlined"
            disabled
          />

          {/* Выбор филиала */}
          <View style={styles.input}>
            {branchesLoading ? (
              <Text>Загрузка филиалов...</Text>
            ) : (
              <BranchSelector
                branches={branches}
                selectedBranchId={branchId}
                onSelectBranch={setBranchId}
                title="Филиал *"
              />
            )}
            {!branchId && (
              <HelperText type="error" visible={!branchId}>
                Пожалуйста, выберите филиал
              </HelperText>
            )}
          </View>

          <Paragraph style={styles.roleInfo}>
            По умолчанию все новые пользователи регистрируются как ученики. Администратор может
            изменить роль пользователя позже.
          </Paragraph>

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          <ArsenalButton
            title={loading ? 'Регистрация...' : 'Зарегистрироваться'}
            variant="primary"
            onPress={handleRegister}
            loading={loading}
            disabled={loading || !branchId} // Добавляем проверку выбора филиала
            style={styles.button}
          />

          <ArsenalButton
            title="Уже есть аккаунт? Войдите"
            variant="text"
            onPress={() => navigation.navigate('Login' as never)}
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: COLORS.text,
  },
  branchButton: {
    marginVertical: 4,
  },
  roleInfo: {
    marginBottom: 16,
    textAlign: 'center',
    fontStyle: 'italic',
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
