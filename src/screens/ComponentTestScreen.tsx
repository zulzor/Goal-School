import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Text } from 'react-native-paper';
import { useAuth, UserRole } from '../context/LocalStorageAuthContext';
import { COLORS } from '../constants';
import { AnimatedCard } from '../components/AnimatedCard';
import { GradientCard } from '../components/GradientCard';
import { StatCard } from '../components/StatCard';
import { ArsenalButton } from '../components/ArsenalButton';
import { AnimatedButton } from '../components/AnimatedButton';
import { UnderDevelopmentBanner } from '../components/UnderDevelopmentBanner';

export const ComponentTestScreen: React.FC = () => {
  const { user } = useAuth();

  // Показываем заглушку для экрана в разработке
  if (user?.role === UserRole.MANAGER) {
    return (
      <UnderDevelopmentBanner
        title="Тест компонентов"
        description="Этот раздел находится в активной разработке. Функционал тестирования компонентов будет доступен в следующем обновлении."
      />
    );
  }

  const testComponents = [
    { name: 'AnimatedCard', description: 'Анимированная карточка с эффектами появления' },
    { name: 'GradientCard', description: 'Карточка с градиентным фоном' },
    { name: 'StatCard', description: 'Карточка для отображения статистики' },
    { name: 'ArsenalButton', description: 'Стилизованная кнопка Arsenal' },
    { name: 'AnimatedButton', description: 'Анимированная кнопка с эффектами' },
  ];

  const handleTestComponent = (componentName: string) => {
    Alert.alert(`Тест компонента`, `Вы протестировали компонент ${componentName}`);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title>Тестирование компонентов</Title>
          <Paragraph>Проверка работы всех UI компонентов приложения</Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.section}>
        <Title style={styles.sectionTitle}>Основные компоненты</Title>
        {testComponents.map((component, index) => (
          <Card key={index} style={styles.componentCard}>
            <Card.Content>
              <Title style={styles.componentTitle}>{component.name}</Title>
              <Paragraph style={styles.componentDescription}>{component.description}</Paragraph>
              <Button
                mode="contained"
                onPress={() => handleTestComponent(component.name)}
                style={styles.testButton}>
                Протестировать
              </Button>
            </Card.Content>
          </Card>
        ))}
      </View>

      <View style={styles.section}>
        <Title style={styles.sectionTitle}>Демонстрация компонентов</Title>

        <AnimatedCard style={styles.demoCard}>
          <Title>Демо AnimatedCard</Title>
          <Paragraph>Это пример анимированной карточки</Paragraph>
        </AnimatedCard>

        <GradientCard
          title="Демо GradientCard"
          subtitle="Карточка с градиентом"
          icon="⚽"
          gradientColors={['#2196F3', '#21CBF3']}
          onPress={() => Alert.alert('GradientCard', 'Нажата карточка с градиентом')}
        />

        <StatCard title="Демо StatCard" value="42" icon="🏆" />

        <View style={styles.buttonDemo}>
          <ArsenalButton
            title="Демо ArsenalButton"
            onPress={() => Alert.alert('ArsenalButton', 'Нажата кнопка Arsenal')}
          />
        </View>

        <View style={styles.buttonDemo}>
          <AnimatedButton
            title="Демо AnimatedButton"
            onPress={() => Alert.alert('AnimatedButton', 'Нажата анимированная кнопка')}
          />
        </View>
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
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: COLORS.text,
  },
  componentCard: {
    marginBottom: 12,
  },
  componentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  componentDescription: {
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  testButton: {
    marginTop: 8,
  },
  demoCard: {
    marginVertical: 8,
  },
  buttonDemo: {
    marginVertical: 8,
  },
});
