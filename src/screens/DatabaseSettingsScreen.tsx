// src/screens/DatabaseSettingsScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useDatabase } from '../context/DatabaseContext';
import { useMySQLAuth } from '../context/MySQLAuthContext';
import { ArsenalButton } from '../components/ArsenalButton';
import { Card, Title, Paragraph } from 'react-native-paper';
import { COLORS } from '../constants'; // Импортируем цвета Arsenal

export const DatabaseSettingsScreen: React.FC = () => {
  const { databaseType, setDatabaseType, isMySQLAvailable, checkMySQLAvailability } = useDatabase();
  const { createTestUser: createMySQLTestUser, isDatabaseAvailable: isMySQLDatabaseAvailable } =
    useMySQLAuth();
  const [isTesting, setIsTesting] = useState(false);

  const handleDatabaseTypeChange = (type: 'local' | 'mysql') => {
    if (type === 'mysql' && !isMySQLAvailable) {
      Alert.alert(
        'MySQL недоступен',
        'Подключение к MySQL недоступно. Пожалуйста, проверьте настройки подключения.',
        [{ text: 'OK' }]
      );
      return;
    }

    setDatabaseType(type);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      let isAvailable = false;
      let databaseName = '';

      if (databaseType === 'mysql') {
        isAvailable = await checkMySQLAvailability();
        databaseName = 'MySQL';
      }

      if (isAvailable) {
        Alert.alert('Успех', `Подключение к ${databaseName} успешно установлено!`, [
          { text: 'OK' },
        ]);
      } else {
        Alert.alert('Ошибка', `Не удалось подключиться к ${databaseName}.`, [{ text: 'OK' }]);
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Произошла ошибка при проверке подключения.', [{ text: 'OK' }]);
    } finally {
      setIsTesting(false);
    }
  };

  const handleCreateTestUser = async () => {
    let success = false;

    if (databaseType === 'mysql') {
      success = await createMySQLTestUser();
    }

    if (success) {
      Alert.alert('Успех', 'Тестовый пользователь создан успешно!', [{ text: 'OK' }]);
    } else {
      Alert.alert('Ошибка', 'Не удалось создать тестового пользователя.', [{ text: 'OK' }]);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Настройки базы данных</Title>

      <Card style={styles.card}>
        <Card.Content>
          <Paragraph>Выберите тип базы данных для приложения:</Paragraph>

          <View style={styles.buttonContainer}>
            <ArsenalButton
              title="Локальная база данных"
              variant={databaseType === 'local' ? 'primary' : 'outline'}
              onPress={() => handleDatabaseTypeChange('local')}
              style={styles.button}
            />

            <ArsenalButton
              title="MySQL"
              variant={databaseType === 'mysql' ? 'primary' : 'outline'}
              onPress={() => handleDatabaseTypeChange('mysql')}
              disabled={!isMySQLAvailable}
              style={styles.button}
            />
          </View>

          {!isMySQLAvailable && databaseType === 'mysql' && (
            <Paragraph style={styles.warning}>
              MySQL недоступен. Проверьте настройки подключения.
            </Paragraph>
          )}
        </Card.Content>
      </Card>

      {databaseType === 'mysql' && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Настройки MySQL</Title>
            <Paragraph>
              Статус подключения: {isMySQLDatabaseAvailable ? 'Подключено' : 'Не подключено'}
            </Paragraph>

            <View style={styles.buttonContainer}>
              <ArsenalButton
                title="Проверить подключение"
                variant="outline"
                onPress={handleTestConnection}
                loading={isTesting}
                disabled={isTesting}
                style={styles.button}
              />

              <ArsenalButton
                title="Создать тестового пользователя"
                variant="outline"
                onPress={handleCreateTestUser}
                style={styles.button}
              />
            </View>
          </Card.Content>
        </Card>
      )}

      <Card style={styles.card}>
        <Card.Content>
          <Title>Информация</Title>
          <Paragraph>
            Текущий тип базы данных: {databaseType === 'local' ? 'Локальная' : 'MySQL'}
          </Paragraph>
          <Paragraph>Для перехода с локальной базы данных на облачную убедитесь, что:</Paragraph>
          <Paragraph>1. Сервер базы данных доступен и настроен</Paragraph>
          <Paragraph>2. Переменные окружения установлены правильно</Paragraph>
          <Paragraph>
            3. Таблицы в базе данных созданы (будут созданы автоматически при первом запуске)
          </Paragraph>
        </Card.Content>
      </Card>
    </View>
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
    color: COLORS.text, // Используем цвет Arsenal
  },
  card: {
    marginBottom: 16,
    backgroundColor: COLORS.surface, // Используем цвет Arsenal
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  warning: {
    color: COLORS.error, // Используем цвет Arsenal
    marginTop: 16,
    textAlign: 'center',
  },
});
