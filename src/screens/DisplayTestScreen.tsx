import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { DisplayTestComponent } from '../components/DisplayTestComponent';
import { TrainingService } from '../services/TrainingService';
import { NutritionService } from '../services/NutritionService';
import { COLORS } from '../constants';
import { useAuth, UserRole } from '../context/LocalStorageAuthContext';
import { UnderDevelopmentBanner } from '../components/UnderDevelopmentBanner';

export const DisplayTestScreen: React.FC = () => {
  const componentsToTest = [
    {
      name: 'ScheduleScreen',
      test: async () => {
        try {
          const data = await TrainingService.getTrainings();
          return { success: true, data };
        } catch (error) {
          return { success: false };
        }
      },
    },
    {
      name: 'NutritionScreen',
      test: async () => {
        try {
          const data = await NutritionService.getNutritionRecommendations();
          return { success: true, data };
        } catch (error) {
          return { success: false };
        }
      },
    },
  ];
  const { user } = useAuth();

  // Показываем заглушку для экрана в разработке
  if (user?.role === UserRole.MANAGER) {
    return (
      <UnderDevelopmentBanner
        title="Проверка отображения компонентов"
        description="Этот раздел находится в активной разработке. Функционал проверки отображения будет доступен в следующем обновлении."
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title>Проверка отображения компонентов</Title>
          <Paragraph>Тестирование отображения ключевых компонентов приложения</Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.testsContainer}>
        {componentsToTest.map((component, index) => (
          <DisplayTestComponent
            key={index}
            componentName={component.name}
            onTest={component.test}
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
  testsContainer: {
    marginBottom: 16,
  },
});
