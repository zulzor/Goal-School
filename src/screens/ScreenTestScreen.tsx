import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { ScreenTestComponent } from '../components/ScreenTestComponent';
import { COLORS } from '../constants';
import { useAuth, UserRole } from '../context/LocalStorageAuthContext';
import { UnderDevelopmentBanner } from '../components/UnderDevelopmentBanner';

export const ScreenTestScreen: React.FC = () => {
  const [testResults, setTestResults] = useState<
    Record<string, { success: boolean; message: string }>
  >({});
  const { user } = useAuth();

  // Показываем заглушку для экрана в разработке
  if (user?.role === UserRole.MANAGER) {
    return (
      <UnderDevelopmentBanner
        title="Тестирование экранов приложения"
        description="Этот раздел находится в активной разработке. Функционал тестирования экранов будет доступен в следующем обновлении."
      />
    );
  }

  const handleTestComplete = (
    screenName: string,
    result: { success: boolean; message: string }
  ) => {
    setTestResults(prev => ({
      ...prev,
      [screenName]: result,
    }));
  };

  const screensToTest = ['Schedule', 'Nutrition', 'News', 'Profile', 'Home', 'AdminPanel'];

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
    const total = screensToTest.length;
    const tested = Object.keys(testResults).length;
    const passed = Object.values(testResults).filter(r => r.success).length;

    switch (status) {
      case 'success':
        return `Все экраны работают корректно (${passed}/${total})`;
      case 'error':
        return `Все экраны имеют ошибки (${passed}/${total})`;
      case 'partial':
        return `Некоторые экраны имеют ошибки (${passed}/${total})`;
      default:
        return `Протестировано ${tested} из ${total} экранов`;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title>Тестирование экранов приложения</Title>
          <Paragraph>Проверка отображения всех экранов приложения</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.statusCard}>
        <Card.Content>
          <Paragraph style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusMessage()}
          </Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.testsContainer}>
        {screensToTest.map(screenName => (
          <ScreenTestComponent
            key={screenName}
            screenName={screenName}
            onTestComplete={result => handleTestComplete(screenName, result)}
          />
        ))}
      </View>
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
  testsContainer: {
    marginBottom: 16,
  },
});
