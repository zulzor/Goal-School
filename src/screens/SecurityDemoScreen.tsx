import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph, TextInput, Button, Text } from 'react-native-paper';
import { useEnhancedSecurity } from '../context/EnhancedSecurityContext';
import { UserRole } from '../types';
import { COLORS, SIZES } from '../constants';
import { useAuth, UserRole as AuthUserRole } from '../context/LocalStorageAuthContext';
import { UnderDevelopmentBanner } from '../components/UnderDevelopmentBanner';

export const SecurityDemoScreen: React.FC = () => {
  const {
    validateInput,
    sanitizeInput,
    encryptSensitiveData,
    decryptSensitiveData,
    checkPermission,
    checkRoleHierarchy,
    generateCSRFToken,
    validateCSRFToken,
    detectSuspiciousActivity,
    logAuditEvent,
    getAuditLogs,
  } = useEnhancedSecurity();

  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [text, setText] = useState('');
  const [sensitiveData, setSensitiveData] = useState('');
  const [encryptedData, setEncryptedData] = useState('');
  const [decryptedData, setDecryptedData] = useState('');
  const [userRole, setUserRole] = useState<AuthUserRole>(AuthUserRole.PARENT);
  const [requiredRole, setRequiredRole] = useState<AuthUserRole>(AuthUserRole.COACH);
  const [activity, setActivity] = useState('');
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Показываем заглушку для экрана в разработке
  if (user?.role === AuthUserRole.MANAGER) {
    return (
      <UnderDevelopmentBanner
        title="Демонстрация безопасности"
        description="Этот раздел находится в активной разработке. Функционал демонстрации расширенных функций безопасности будет доступен в следующем обновлении."
      />
    );
  }

  // Функция для тестирования валидации входных данных
  const testValidation = () => {
    const emailValidation = validateInput(email, 'email');
    const passwordValidation = validateInput(password, 'password');
    const textValidation = validateInput(text, 'text');

    Alert.alert(
      'Результаты валидации',
      `Email: ${emailValidation.isValid ? 'Валидный' : emailValidation.errors.join(', ')}\n` +
        `Пароль: ${passwordValidation.isValid ? 'Валидный' : passwordValidation.errors.join(', ')}\n` +
        `Текст: ${textValidation.isValid ? 'Валидный' : textValidation.errors.join(', ')}`
    );
  };

  // Функция для тестирования очистки данных
  const testSanitization = () => {
    const sanitized = sanitizeInput(text);
    Alert.alert('Очищенный текст', sanitized);
  };

  // Функция для тестирования шифрования
  const testEncryption = () => {
    const encrypted = encryptSensitiveData(sensitiveData);
    setEncryptedData(encrypted);
    Alert.alert('Зашифрованные данные', encrypted);
  };

  // Функция для тестирования дешифрования
  const testDecryption = () => {
    const decrypted = decryptSensitiveData(encryptedData);
    setDecryptedData(decrypted);
    Alert.alert('Расшифрованные данные', decrypted);
  };

  // Функция для тестирования ролевой безопасности
  const testRolePermission = () => {
    const hasPermission = checkPermission(userRole, requiredRole);
    const hierarchyCheck = checkRoleHierarchy(userRole, [requiredRole]);

    Alert.alert(
      'Ролевая безопасность',
      `Пользователь ${userRole} имеет права ${requiredRole}: ${hasPermission ? 'Да' : 'Нет'}\n` +
        `Проверка иерархии: ${hierarchyCheck ? 'Пройдена' : 'Не пройдена'}`
    );
  };

  // Функция для тестирования CSRF защиты
  const testCSRF = () => {
    const token = generateCSRFToken();
    const isValid = validateCSRFToken(token);

    Alert.alert(
      'CSRF защита',
      `Сгенерированный токен: ${token}\n` + `Валидный: ${isValid ? 'Да' : 'Нет'}`
    );
  };

  // Функция для тестирования обнаружения подозрительной активности
  const testSuspiciousActivity = () => {
    const isSuspicious = detectSuspiciousActivity('test-user', activity, { source: 'demo' });

    Alert.alert(
      'Обнаружение подозрительной активности',
      `Активность: ${activity}\n` + `Подозрительная: ${isSuspicious ? 'Да' : 'Нет'}`
    );
  };

  // Функция для тестирования аудита
  const testAuditLogging = () => {
    logAuditEvent('test-user', 'DEMO_ACTION', 'security-demo', true, {
      feature: 'enhanced-security',
      timestamp: new Date().toISOString(),
    });

    const logs = getAuditLogs('test-user', 10);
    setAuditLogs(logs);

    Alert.alert('Аудит событий', `Залогировано событие. Всего записей: ${logs.length}`);
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Демонстрация расширенных функций безопасности</Title>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Валидация и очистка данных</Title>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
          />
          <TextInput
            label="Пароль"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />
          <TextInput
            label="Текст для очистки"
            value={text}
            onChangeText={setText}
            style={styles.input}
            multiline
            numberOfLines={3}
          />
          <Button mode="contained" onPress={testValidation} style={styles.button}>
            Проверить валидацию
          </Button>
          <Button mode="outlined" onPress={testSanitization} style={styles.button}>
            Очистить текст
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Шифрование данных</Title>
          <TextInput
            label="Чувствительные данные"
            value={sensitiveData}
            onChangeText={setSensitiveData}
            style={styles.input}
          />
          <TextInput
            label="Зашифрованные данные"
            value={encryptedData}
            onChangeText={setEncryptedData}
            style={styles.input}
          />
          <TextInput
            label="Расшифрованные данные"
            value={decryptedData}
            onChangeText={setDecryptedData}
            style={styles.input}
          />
          <Button mode="contained" onPress={testEncryption} style={styles.button}>
            Зашифровать
          </Button>
          <Button mode="outlined" onPress={testDecryption} style={styles.button}>
            Расшифровать
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Ролевая безопасность</Title>
          <View style={styles.row}>
            <View style={styles.flex1}>
              <Text>Роль пользователя</Text>
              <TextInput
                value={userRole}
                onChangeText={text => setUserRole(text as UserRole)}
                style={styles.input}
              />
            </View>
            <View style={styles.flex1}>
              <Text>Требуемая роль</Text>
              <TextInput
                value={requiredRole}
                onChangeText={text => setRequiredRole(text as UserRole)}
                style={styles.input}
              />
            </View>
          </View>
          <Button mode="contained" onPress={testRolePermission} style={styles.button}>
            Проверить права
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>CSRF защита</Title>
          <Button mode="contained" onPress={testCSRF} style={styles.button}>
            Сгенерировать и проверить CSRF токен
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Обнаружение подозрительной активности</Title>
          <TextInput
            label="Активность для проверки"
            value={activity}
            onChangeText={setActivity}
            style={styles.input}
          />
          <Button mode="contained" onPress={testSuspiciousActivity} style={styles.button}>
            Проверить активность
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Аудит событий</Title>
          <Button mode="contained" onPress={testAuditLogging} style={styles.button}>
            Залогировать событие
          </Button>
          {auditLogs.length > 0 && (
            <Paragraph>Последние {auditLogs.length} записей аудита</Paragraph>
          )}
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.padding,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: COLORS.primary,
  },
  card: {
    marginBottom: 16,
    borderRadius: SIZES.borderRadius,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
});
