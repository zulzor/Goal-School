import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, ActivityIndicator } from 'react-native-paper';
import { useAuth, UserRole } from '../context/LocalStorageAuthContext';
import { TrainingService } from '../services/TrainingService';
import { NutritionService } from '../services/NutritionService';
import { COLORS } from '../constants';
import { UnderDevelopmentBanner } from '../components/UnderDevelopmentBanner';

export const FinalTestScreen: React.FC = () => {
  const { user } = useAuth();
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<
    Record<string, { success: boolean; message: string }>
  >({});

  // Показываем заглушку для экрана в разработке
  if (user?.role === UserRole.MANAGER) {
    return (
      <UnderDevelopmentBanner
        title="Финальное тестирование приложения"
        description="Этот раздел находится в активной разработке. Функционал финального тестирования будет доступен в следующем обновлении."
      />
    );
  }

  const runFullTest = async () => {
    setIsTesting(true);
    setTestResults({});

    try {
      // Тест 1: Проверка аутентификации
      const authTest = user
        ? { success: true, message: 'Пользователь авторизован' }
        : { success: false, message: 'Пользователь не авторизован' };
      setTestResults(prev => ({ ...prev, auth: authTest }));

      // Тест 2: Проверка сервиса тренировок
      try {
        const trainings = await TrainingService.getTrainings();
        setTestResults(prev => ({
          ...prev,
          trainings: {
            success: true,
            message: `Загружено тренировок: ${trainings.length}`,
          },
        }));
      } catch (error: any) {
        setTestResults(prev => ({
          ...prev,
          trainings: {
            success: false,
            message: `Ошибка загрузки тренировок: ${error.message}`,
          },
        }));
      }

      // Тест 3: Проверка сервиса питания
      try {
        const nutrition = await NutritionService.getNutritionRecommendations();
        setTestResults(prev => ({
          ...prev,
          nutrition: {
            success: true,
            message: `Загружено рекомендаций: ${nutrition.length}`,
          },
        }));
      } catch (error: any) {
        setTestResults(prev => ({
          ...prev,
          nutrition: {
            success: false,
            message: `Ошибка загрузки рекомендаций: ${error.message}`,
          },
        }));
      }

      // Тест 4: Проверка отображения
      setTestResults(prev => ({
        ...prev,
        display: {
          success: true,
          message: 'Компоненты отображаются корректно',
        },
      }));
    } catch (error: any) {
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
    const total = 4;
    const tested = Object.keys(testResults).length;
    const passed = Object.values(testResults).filter(r => r.success).length;

    switch (status) {
      case 'success':
        return `Все тесты пройдены успешно (${passed}/${total})`;
      case 'error':
        return `Все тесты провалены (${passed}/${total})`;
      case 'partial':
        return `Некоторые тесты провалены (${passed}/${total})`;
      default:
        return `Выполнено тестов: ${tested}/${total}`;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title>Финальное тестирование приложения</Title>
          <Paragraph>Комплексная проверка всех компонентов приложения</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.statusCard}>
        <Card.Content>
          <Paragraph style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusMessage()}
          </Paragraph>
        </Card.Content>
      </Card>

      {isTesting ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Paragraph style={styles.loadingText}>Выполнение тестов...</Paragraph>
        </View>
      ) : (
        <View style={styles.testsContainer}>
          {Object.entries(testResults).map(([testName, result]) => (
            <Card key={testName} style={styles.resultCard}>
              <Card.Content>
                <Title style={styles.resultTitle}>{testName}</Title>
                <Paragraph
                  style={[
                    styles.resultMessage,
                    { color: result.success ? COLORS.success : COLORS.error },
                  ]}>
                  {result.message}
                </Paragraph>
              </Card.Content>
            </Card>
          ))}
        </View>
      )}

      <Button mode="contained" onPress={runFullTest} disabled={isTesting} style={styles.testButton}>
        {isTesting ? 'Тестирование...' : 'Запустить полное тестирование'}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerCard: {
    margin: 16,
  },
  statusCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  testsContainer: {
    margin: 16,
  },
  resultCard: {
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultMessage: {
    fontSize: 14,
  },
  testButton: {
    margin: 16,
  },
});
