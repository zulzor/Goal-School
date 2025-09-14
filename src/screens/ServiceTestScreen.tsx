import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { ServiceTestComponent } from '../components/ServiceTestComponent';
import { COLORS } from '../constants';
import { useAuth, UserRole } from '../context/LocalStorageAuthContext';
import { UnderDevelopmentBanner } from '../components/UnderDevelopmentBanner';

export const ServiceTestScreen: React.FC = () => {
  const servicesToTest = ['TrainingService', 'NutritionService'];
  const { user } = useAuth();

  // Показываем заглушку для экрана в разработке
  if (user?.role === UserRole.MANAGER) {
    return (
      <UnderDevelopmentBanner
        title="Тестирование сервисов приложения"
        description="Этот раздел находится в активной разработке. Функционал тестирования сервисов будет доступен в следующем обновлении."
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title>Тестирование сервисов приложения</Title>
          <Paragraph>Проверка работы всех сервисов приложения</Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.testsContainer}>
        {servicesToTest.map(serviceName => (
          <ServiceTestComponent key={serviceName} serviceName={serviceName} />
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
  testsContainer: {
    marginBottom: 16,
  },
});
