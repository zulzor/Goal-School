import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, ActivityIndicator } from 'react-native-paper';
import { COLORS } from '../constants';
import { useAuth, UserRole } from '../context/LocalStorageAuthContext';
import { UnderDevelopmentBanner } from './UnderDevelopmentBanner';

interface DisplayTestComponentProps {
  componentName: string;
  onTest: () => Promise<{ success: boolean; data?: any }>;
}

export const DisplayTestComponent: React.FC<DisplayTestComponentProps> = ({
  componentName,
  onTest,
}) => {
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
        title={`Тест отображения: ${componentName}`}
        description="Этот раздел находится в активной разработке. Функционал проверки отображения будет доступен в следующем обновлении."
      />
    );
  }

  const runDisplayTest = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const result = await onTest();

      if (result.success) {
        setTestResult({
          success: true,
          message: `Компонент "${componentName}" отображается корректно`,
          data: result.data,
        });
      } else {
        setTestResult({
          success: false,
          message: `Ошибка отображения компонента "${componentName}"`,
        });
      }
    } catch (error: any) {
      setTestResult({
        success: false,
        message: `Ошибка тестирования компонента "${componentName}": ${error.message || error}`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card style={styles.container}>
      <Card.Content>
        <Title style={styles.title}>Тест отображения: {componentName}</Title>

        {isTesting ? (
          <View style={styles.testContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Paragraph style={styles.testText}>Проверка отображения...</Paragraph>
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
                Данные: {JSON.stringify(testResult.data, null, 2)}
              </Paragraph>
            )}
          </View>
        ) : (
          <Paragraph style={styles.description}>
            Нажмите кнопку ниже для проверки отображения компонента "{componentName}"
          </Paragraph>
        )}

        <Button
          mode="contained"
          onPress={runDisplayTest}
          disabled={isTesting}
          style={styles.testButton}>
          {isTesting ? 'Проверка...' : 'Проверить отображение'}
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
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
  },
  testButton: {
    marginTop: 8,
  },
});
