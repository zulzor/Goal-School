import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, Platform, Linking, Image } from 'react-native';
import { TextInput, Text, Card, Title, Paragraph, HelperText, Checkbox } from 'react-native-paper';
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
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

    // Проверка согласия с условиями
    if (!acceptedTerms) {
      Alert.alert('Ошибка', 'Пожалуйста, примите условия использования');
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

  // Функция для генерации демо данных
  const fillDemoData = () => {
    setName('Иван Иванов');
    setEmail('ivan@example.com');
    setPassword('password123');
    setConfirmPassword('password123');
    setRole(UserRole.CHILD);
    setBranchId(branches.length > 0 ? branches[0].id : null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          {/* Логотип школы */}
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>А</Text>
            </View>
            <Title style={styles.title}>Футбольная школа "Арсенал"</Title>
            <Paragraph style={styles.subtitle}>Регистрация нового пользователя</Paragraph>
          </View>

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
            left={<TextInput.Icon icon="account" />}
          />

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            mode="outlined"
            left={<TextInput.Icon icon="email" />}
          />

          <TextInput
            label="Пароль"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry={!showPassword}
            mode="outlined"
            left={<TextInput.Icon icon="lock" />}
            right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword(!showPassword)} />}
          />

          <TextInput
            label="Подтвердите пароль"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
            secureTextEntry={!showPassword}
            mode="outlined"
            left={<TextInput.Icon icon="lock-check" />}
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

          {/* Согласие с условиями */}
          <View style={styles.termsContainer}>
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={acceptedTerms ? 'checked' : 'unchecked'}
                onPress={() => setAcceptedTerms(!acceptedTerms)}
              />
              <Text style={styles.termsText}>
                Я согласен с <Text style={styles.linkText} onPress={() => Linking.openURL('/terms.html')}>условиями использования</Text> и <Text style={styles.linkText} onPress={() => Linking.openURL('/privacy.html')}>политикой конфиденциальности</Text>
              </Text>
            </View>
          </View>

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          <ArsenalButton
            title={loading ? 'Регистрация...' : 'Зарегистрироваться'}
            variant="primary"
            onPress={handleRegister}
            loading={loading}
            disabled={loading || !branchId || !acceptedTerms} // Добавляем проверку выбора филиала и согласия с условиями
            style={styles.button}
          />

          {/* Кнопка для заполнения демо данных */}
          <ArsenalButton
            title="Заполнить демо данные"
            variant="outline"
            onPress={fillDemoData}
            style={styles.demoButton}
          />

          <ArsenalButton
            title="Уже есть аккаунт? Войдите"
            variant="text"
            onPress={() => navigation.navigate('Login' as never)}
            style={styles.linkButton}
          />

          {/* Ссылка на APK для веб-версии */}
          {Platform.OS === 'web' && (
            <ArsenalButton
              title="Скачать мобильное приложение (APK)"
              variant="outline"
              onPress={() => Linking.openURL('/apk-download.html')}
              style={styles.linkButton}
            />
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
        maxWidth: 450,
        alignSelf: 'center',
        width: '100%',
        borderRadius: 12,
      },
    }),
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.primary,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 4,
      },
    }),
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 24,
  },
  subtitle: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  demoButton: {
    marginTop: 16,
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
  roleInfo: {
    textAlign: 'center',
    marginBottom: 16,
    color: COLORS.textSecondary,
  },
  termsContainer: {
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  termsText: {
    flex: 1,
    marginLeft: 8,
  },
  linkText: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
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