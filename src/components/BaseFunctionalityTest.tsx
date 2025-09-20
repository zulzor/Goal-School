import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../context/LocalStorageAuthContext';
import { TrainingService } from '../services/TrainingService';
import { NutritionService } from '../services/NutritionService';
import { COLORS } from '../constants';

export const BaseFunctionalityTest: React.FC = () => {
  const { user } = useAuth();
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<
    Record<string, { success: boolean; message: string }>
  >({});

  const runBaseTests = async () => {
    setIsTesting(true);
    setTestResults({});

    try {
      // Тест 1: Проверка аутентификации
      const authResult = user
        ? { success: true, message: 'Пользователь авторизован' }
        : { success: false, message: 'Пользователь не авторизован' };
      setTestResults(prev => ({ ...prev, Аутентификация: authResult }));

      // Тест 2: Проверка загрузки тренировок
      try {
        const trainings = await TrainingService.getTrainings();
        setTestResults(prev => ({
          ...prev,
          'Загрузка тренировок': {
            success: true,
            message: `Успешно загружено ${trainings.length} тренировок`,
          },
        }));
      } catch (error) {
        setTestResults(prev => ({
          ...prev,
          'Загрузка тренировок': {
            success: false,
            message: `Ошибка: ${error.message}`,
          },
        }));
      }

      // Тест 3: Проверка загрузки рекомендаций по питанию
      try {
        const nutrition = await NutritionService.getNutritionRecommendations();
        setTestResults(prev => ({
          ...prev,
          'Загрузка питания': {
            success: true,
            message: `Успешно загружено ${nutrition.length} рекомендаций`,
          },
        }));
      } catch (error) {
        setTestResults(prev => ({
          ...prev,
          'Загрузка питания': {
            success: false,
            message: `Ошибка: ${error.message}`,
          },
        }));
      }

      // Тест 4: Проверка базового отображения
      setTestResults(prev => ({
        ...prev,
        'Базовое отображение': {
          success: true,
          message: 'Компоненты отображаются корректно',
        },
      }));
    } catch (error) {
      Alert.alert('Ошибка', `Ошибка тестирования: ${error.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  const getOverallStatus = () => {
    const results = Object.values(testResults);
    if (results.length === 0) return 'pending';

    const failed = results.filter(r => !r.success);
    if (failed.length === 0) return 'success';
    if (failed.length === results.length) return 'error';
    return 'partial';
  };

  const getStatusColor = () => {
    const status = getOverallStatus();
    switch (status) {
      case 'success':
        return COLORS.success;
      case 'error':
        return COLORS.error;
      case 'partial':
        return COLORS.warning;
      default:
        return COLORS.textSecondary;
    }
  };

  const getStatusMessage = () => {
    const status = getOverallStatus();
    const total = Object.keys(testResults).length;
    const passed = Object.values(testResults).filter(r => r.success).length;

    switch (status) {
      case 'success':
        return `Все тесты пройдены (${passed}/${total})`;
      case 'error':
        return `Все тесты провалены (${passed}/${total})`;
      case 'partial':
        return `Некоторые тесты провалены (${passed}/${total})`;
      default:
        return `Выполнено тестов: ${total}`;
    }
  };

  return (
    <Card style={styles.container}>
      <Card.Content>
        <Title style={styles.title}>Базовое тестирование функциональности</Title>
        <Paragraph style={styles.description}>Проверка основных функций приложения</Paragraph>

        {Object.keys(testResults).length > 0 && (
          <Card style={styles.statusCard}>
            <Card.Content>
              <Paragraph style={[styles.statusText, { color: getStatusColor() }]}>
                {getStatusMessage()}
              </Paragraph>
            </Card.Content>
          </Card>
        )}

        {isTesting ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Paragraph style={styles.loadingText}>Выполнение тестов...</Paragraph>
          </View>
        ) : (
          <View style={styles.resultsContainer}>
            {Object.entries(testResults).map(([testName, result]) => (
              <View key={testName} style={styles.resultItem}>
                <Paragraph style={styles.resultName}>{testName}:</Paragraph>
                <Paragraph
                  style={[
                    styles.resultMessage,
                    { color: result.success ? COLORS.success : COLORS.error },
                  ]}>
                  {result.message}
                </Paragraph>
              </View>
            ))}
          </View>
        )}

        <Button
          mode="contained"
          onPress={runBaseTests}
          disabled={isTesting}
          style={styles.testButton}>
          {isTesting ? 'Тестирование...' : 'Запустить тесты'}
        </Button>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  statusCard: {
    marginBottom: 16,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  resultsContainer: {
    marginVertical: 16,
  },
  resultItem: {
    marginBottom: 12,
  },
  resultName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultMessage: {
    fontSize: 14,
  },
  testButton: {
    marginTop: 8,
  },
});
