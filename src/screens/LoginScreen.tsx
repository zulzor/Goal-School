import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, Platform, Linking, Image } from 'react-native';
import {
  TextInput,
  Button,
  Text,
  ActivityIndicator,
  Card,
  Title,
  Paragraph,
  Divider,
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
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const { databaseType, isMySQLAvailable } = useDatabase();

  // Используем соответствующий контекст в зависимости от типа базы данных
  const localStorageAuth = useAuth();
  const mySQLAuth = useMySQLAuth();

  const authContext = databaseType === 'mysql' ? mySQLAuth : localStorageAuth;

  const { login } = authContext;

  // Загружаем сохраненные данные при монтировании компонента
  useEffect(() => {
    const loadSavedCredentials = async () => {
      try {
        const savedEmail = await localStorageAuth.getEmail();
        const savedRememberMe = await localStorageAuth.getRememberMe();
        
        if (savedEmail && savedRememberMe) {
          setEmail(savedEmail);
          setRememberMe(true);
        }
      } catch (err) {
        console.log('Could not load saved credentials:', err);
      }
    };
    
    if (databaseType !== 'mysql') {
      loadSavedCredentials();
    }
  }, [databaseType]);

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
    setError(null);

    try {
      // Сохраняем данные, если выбрана опция "Запомнить меня"
      if (rememberMe && databaseType !== 'mysql') {
        await localStorageAuth.saveEmail(email);
        await localStorageAuth.saveRememberMe(rememberMe);
      }

      const result = await login(email, password);

      // Проверяем, является ли результат объектом с success
      if (typeof result === 'object' && result !== null && 'success' in result) {
        if (!result.success) {
          // @ts-ignore - игнорируем ошибку типов для упрощения
          setError(result.message);
          Alert.alert('Ошибка входа', result.message || 'Неверный email или пароль');
        }
      } else {
        // Если результат не объект, предполагаем, что вход не удался
        setError('Неверный email или пароль');
        Alert.alert('Ошибка входа', 'Неверный email или пароль');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Произошла ошибка при входе. Пожалуйста, попробуйте еще раз.');
      Alert.alert('Ошибка', 'Произошла ошибка при входе. Пожалуйста, попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  // Демонстрационные учетные данные для быстрого входа
  const demoLogin = async (role: string) => {
    let demoEmail = '';
    let demoPassword = 'password123';
    
    switch (role) {
      case 'manager':
        demoEmail = 'manager@example.com';
        break;
      case 'coach':
        demoEmail = 'coach@example.com';
        break;
      case 'parent':
        demoEmail = 'parent@example.com';
        break;
      case 'child':
        demoEmail = 'child@example.com';
        break;
      default:
        demoEmail = 'user@example.com';
    }
    
    setEmail(demoEmail);
    setPassword(demoPassword);
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
            <Paragraph style={styles.subtitle}>Вход в систему</Paragraph>
          </View>

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
            left={<TextInput.Icon icon="email" />}
          />

          <TextInput
            label="Пароль"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
            mode="outlined"
            left={<TextInput.Icon icon="lock" />}
          />

          {/* Опция "Запомнить меня" */}
          <View style={styles.rememberMeContainer}>
            <Button 
              mode={rememberMe ? "contained" : "outlined"} 
              onPress={() => setRememberMe(!rememberMe)}
              style={styles.rememberMeButton}
            >
              Запомнить меня
            </Button>
          </View>

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

          {/* Разделитель */}
          <Divider style={styles.divider} />
          
          {/* Быстрый вход для демонстрации */}
          <View style={styles.demoSection}>
            <Title style={styles.demoTitle}>Быстрый вход (демо)</Title>
            <Paragraph style={styles.demoDescription}>
              Нажмите на роль для быстрого входа с демонстрационными учетными данными:
            </Paragraph>
            
            <View style={styles.demoButtons}>
              <ArsenalButton
                title="Управляющий"
                variant="outline"
                onPress={() => demoLogin('manager')}
                style={[styles.demoButton, styles.managerButton]}
              />
              <ArsenalButton
                title="Тренер"
                variant="outline"
                onPress={() => demoLogin('coach')}
                style={[styles.demoButton, styles.coachButton]}
              />
              <ArsenalButton
                title="Родитель"
                variant="outline"
                onPress={() => demoLogin('parent')}
                style={[styles.demoButton, styles.parentButton]}
              />
              <ArsenalButton
                title="Ученик"
                variant="outline"
                onPress={() => demoLogin('child')}
                style={[styles.demoButton, styles.childButton]}
              />
            </View>
          </View>

          {/* Ссылка на APK для веб-версии */}
          {Platform.OS === 'web' && (
            <ArsenalButton
              title="Скачать мобильное приложение (APK)"
              variant="outline"
              onPress={() => Linking.openURL('/apk-download.html')}
              style={styles.linkButton}
            />
          )}

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
  rememberMeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  rememberMeButton: {
    borderRadius: 20,
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
  divider: {
    marginVertical: 24,
  },
  demoSection: {
    marginTop: 24,
  },
  demoTitle: {
    textAlign: 'center',
    marginBottom: 12,
  },
  demoDescription: {
    textAlign: 'center',
    marginBottom: 16,
    color: COLORS.textSecondary,
  },
  demoButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  demoButton: {
    flex: 1,
    minWidth: 100,
  },
  managerButton: {
    borderColor: COLORS.primary,
  },
  coachButton: {
    borderColor: COLORS.accent,
  },
  parentButton: {
    borderColor: COLORS.success,
  },
  childButton: {
    borderColor: COLORS.info,
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