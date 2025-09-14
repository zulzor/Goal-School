import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button, ActivityIndicator } from 'react-native-paper';
import { TrainingService } from '../services/TrainingService';
import { NutritionService } from '../services/NutritionService';
import { COLORS } from '../constants';
import { useAuth, UserRole } from '../context/LocalStorageAuthContext';
import { UnderDevelopmentBanner } from './UnderDevelopmentBanner';

interface ServiceTestComponentProps {
  serviceName: string;
}

export const ServiceTestComponent: React.FC<ServiceTestComponentProps> = ({ serviceName }) => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    data?: any;
  } | null>(null);
  const { user } = useAuth();

  // Показываем заглушку для экрана в разработке
  if (user?.role === UserRole.MANAGER) {
    return (
      <UnderDevelopmentBanner
        title={`Тест сервиса: ${serviceName}`}
        description="Этот раздел находится в активной разработке. Функционал тестирования сервисов будет доступен в следующем обновлении."
      />
    );
  }

  const testService = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      let result;

      switch (serviceName) {
        case 'TrainingService':
          result = await TrainingService.getTrainings();
          break;
        case 'NutritionService':
          result = await NutritionService.getNutritionRecommendations();
          break;
        default:
          throw new Error(`Неизвестный сервис: ${serviceName}`);
      }

      setTestResult({
        success: true,
        message: `Сервис ${serviceName} работает корректно`,
        data: result,
      });
    } catch (error: any) {
      setTestResult({
        success: false,
        message: `Ошибка сервиса ${serviceName}: ${error.message || error}`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card style={styles.container}>
      <Card.Content>
        <Title style={styles.title}>Тест сервиса: {serviceName}</Title>

        {isTesting ? (
          <View style={styles.testContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Paragraph style={styles.testText}>Тестирование сервиса...</Paragraph>
          </View>
        ) : testResult ? (
          <View style={styles.resultContainer}>
            <Paragraph
              style={[
                styles.resultText,
                { color: testResult.success ? COLORS.success : COLORS.error },
              ]}>
              {testResult.message}
            </Paragraph>
            {testResult.data && (
              <Paragraph style={styles.dataText}>
                Получено данных: {Array.isArray(testResult.data) ? testResult.data.length : '1'}{' '}
                элементов
              </Paragraph>
            )}
          </View>
        ) : (
          <Paragraph style={styles.description}>
            Нажмите кнопку ниже для тестирования сервиса "{serviceName}"
          </Paragraph>
        )}

        <Button
          mode="contained"
          onPress={testService}
          disabled={isTesting}
          style={styles.testButton}>
          {isTesting ? 'Тестирование...' : 'Запустить тест'}
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
    marginBottom: 12,
  },
  description: {
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  testContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  testText: {
    marginTop: 12,
    fontSize: 16,
  },
  resultContainer: {
    marginVertical: 16,
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dataText: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  testButton: {
    marginTop: 8,
  },
});
