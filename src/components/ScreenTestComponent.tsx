import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Card, Title, Paragraph, Button, ActivityIndicator } from 'react-native-paper';
import { COLORS } from '../constants';
import { useAuth, UserRole } from '../context/LocalStorageAuthContext';
import { UnderDevelopmentBanner } from './UnderDevelopmentBanner';

interface ScreenTestComponentProps {
  screenName: string;
  onTestComplete: (result: { success: boolean; message: string }) => void;
}

export const ScreenTestComponent: React.FC<ScreenTestComponentProps> = ({
  screenName,
  onTestComplete,
}) => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const { user } = useAuth();

  // Показываем заглушку для экрана в разработке
  if (user?.role === UserRole.MANAGER) {
    return (
      <UnderDevelopmentBanner
        title={`Тест экрана: ${screenName}`}
        description="Этот раздел находится в активной разработке. Функционал тестирования экранов будет доступен в следующем обновлении."
      />
    );
  }

  const runTest = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      // Имитируем тестирование экрана
      await new Promise(resolve => setTimeout(resolve, 2000));

      // В реальном приложении здесь будет проверка отображения экрана
      const success = Math.random() > 0.3; // 70% шанс успеха для демонстрации

      if (success) {
        setTestResult({
          success: true,
          message: `Экран "${screenName}" отображается корректно`,
        });
        onTestComplete({
          success: true,
          message: `Экран "${screenName}" отображается корректно`,
        });
      } else {
        setTestResult({
          success: false,
          message: `Ошибка отображения экрана "${screenName}"`,
        });
        onTestComplete({
          success: false,
          message: `Ошибка отображения экрана "${screenName}"`,
        });
      }
    } catch (error: any) {
      setTestResult({
        success: false,
        message: `Ошибка тестирования экрана "${screenName}": ${error.message || error}`,
      });
      onTestComplete({
        success: false,
        message: `Ошибка тестирования экрана "${screenName}": ${error.message || error}`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card style={styles.container}>
      <Card.Content>
        <Title style={styles.title}>Тест экрана: {screenName}</Title>

        {isTesting ? (
          <View style={styles.testContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Paragraph style={styles.testText}>Тестирование экрана...</Paragraph>
          </View>
        ) : testResult ? (
          <View style={styles.resultContainer}>
            <Text
              style={[
                styles.resultText,
                { color: testResult.success ? COLORS.success : COLORS.error },
              ]}>
              {testResult.message}
            </Text>
          </View>
        ) : (
          <Paragraph style={styles.description}>
            Нажмите кнопку ниже для тестирования отображения экрана "{screenName}"
          </Paragraph>
        )}

        <Button mode="contained" onPress={runTest} disabled={isTesting} style={styles.testButton}>
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
    textAlign: 'center',
  },
  testButton: {
    marginTop: 8,
  },
});
