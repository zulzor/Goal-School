import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { useAuth, UserRole } from '../context/LocalStorageAuthContext';
import { AnimatedCard } from '../components/AnimatedCard';
import { AnimatedList } from '../components/AnimatedList';
import { AnimatedButton } from '../components/AnimatedButton';
import { AnimatedProgressChart } from '../components/AnimatedProgressChart';
import { AnimatedGoalList } from '../components/AnimatedGoalList';
import { GradientCard } from '../components/GradientCard';
import { ArsenalBanner } from '../components/ArsenalBanner';
import { AnimatedProgressBar } from '../components/AnimatedProgressBar';
import { BeautifulTabBar } from '../components/BeautifulTabBar';
import { EnhancedAnimatedCard } from '../components/EnhancedAnimatedCard';
import { EnhancedAnimatedList } from '../components/EnhancedAnimatedList';
import { EnhancedBanner } from '../components/EnhancedBanner';
import { UnderDevelopmentBanner } from '../components/UnderDevelopmentBanner';
import { COLORS } from '../constants'; // Добавляем импорт цветов

export default function AnimationsDemoScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('demo');

  // Показываем заглушку для экрана в разработке
  if (user?.role === UserRole.MANAGER) {
    return (
      <UnderDevelopmentBanner
        title="Демонстрация анимаций"
        description="Этот раздел находится в активной разработке. Функционал демонстрации анимаций будет доступен в следующем обновлении."
      />
    );
  }

  const tabs = [
    { key: 'demo', title: 'Демо', icon: '🌟' },
    { key: 'cards', title: 'Карточки', icon: '🃏' },
    { key: 'lists', title: 'Списки', icon: '📋' },
  ];

  const sampleGoals = [
    {
      id: '1',
      title: 'Улучшить технику ведения мяча',
      description: 'Практиковать ведение мяча 30 минут ежедневно',
      progress: 65,
      target: 100,
      deadline: '2023-12-31',
      category: 'Техника',
      status: 'active' as const,
    },
    {
      id: '2',
      title: 'Увеличить выносливость',
      description: 'Бегать 5 км за 25 минут',
      progress: 30,
      target: 100,
      deadline: '2024-01-15',
      category: 'Физическая подготовка',
      status: 'active' as const,
    },
    {
      id: '3',
      title: 'Освоить стандарты',
      description: 'Отработать 10 стандартов',
      progress: 80,
      target: 100,
      deadline: '2023-11-30',
      category: 'Тактика',
      status: 'active' as const,
    },
  ];

  const sampleData = [
    { value: 20, label: 'Пн', date: '2023-01-01' },
    { value: 45, label: 'Вт', date: '2023-01-02' },
    { value: 30, label: 'Ср', date: '2023-01-03' },
    { value: 60, label: 'Чт', date: '2023-01-04' },
    { value: 40, label: 'Пт', date: '2023-01-05' },
    { value: 75, label: 'Сб', date: '2023-01-06' },
    { value: 50, label: 'Вс', date: '2023-01-07' },
  ];

  return (
    <ScrollView style={styles.container}>
      <ArsenalBanner
        title="Демонстрация анимаций"
        subtitle="Интерактивные компоненты с анимациями"
      />

      <BeautifulTabBar tabs={tabs} activeTab={activeTab} onTabPress={setActiveTab} />

      {activeTab === 'demo' && (
        <View style={styles.tabContent}>
          <EnhancedAnimatedCard>
            <Card>
              <Card.Content>
                <Title>Расширенная анимированная карточка</Title>
                <Paragraph>С улучшенными эффектами анимации</Paragraph>
                <Paragraph>
                  Эта карточка демонстрирует расширенные эффекты анимации, включая 3D-трансформации
                  и сложные переходы.
                </Paragraph>
                <AnimatedButton
                  title="Интерактивная кнопка"
                  onPress={() => console.log('Нажата кнопка')}
                  style={styles.button}
                />
              </Card.Content>
            </Card>
          </EnhancedAnimatedCard>

          <EnhancedBanner
            title="Расширенный баннер"
            subtitle="С улучшенной анимацией и интерактивностью"
          />

          <EnhancedAnimatedList
            data={sampleGoals}
            renderItem={({ item, index }) => (
              <Card style={styles.goalCard}>
                <Card.Content>
                  <Title>{item.title}</Title>
                  <Paragraph>{item.description}</Paragraph>
                  <AnimatedProgressBar
                    progress={item.progress}
                    title="Прогресс"
                    color={COLORS.primary} // Используем цвет Arsenal вместо хардкодного значения
                  />
                </Card.Content>
              </Card>
            )}
            keyExtractor={item => item.id}
          />
        </View>
      )}

      {activeTab === 'cards' && (
        <View style={styles.tabContent}>
          <AnimatedCard animationType="fade" delay={0}>
            <Card>
              <Card.Content>
                <Title>Анимированная карточка</Title>
                <Paragraph>Эта карточка появляется с эффектом fade.</Paragraph>
              </Card.Content>
            </Card>
          </AnimatedCard>

          <AnimatedCard animationType="slide" delay={200}>
            <Card>
              <Card.Content>
                <Title>Слайд-карточка</Title>
                <Paragraph>Эта карточка появляется с эффектом slide.</Paragraph>
              </Card.Content>
            </Card>
          </AnimatedCard>

          <AnimatedCard animationType="scale" delay={400}>
            <Card>
              <Card.Content>
                <Title>Масштабируемая карточка</Title>
                <Paragraph>Эта карточка появляется с эффектом масштабирования.</Paragraph>
              </Card.Content>
            </Card>
          </AnimatedCard>

          <GradientCard title="Градиентная карточка" subtitle="С градиентным фоном" />
        </View>
      )}

      {activeTab === 'lists' && (
        <View style={styles.tabContent}>
          <AnimatedList
            data={sampleData}
            renderItem={({ item }) => (
              <Card style={styles.listItem}>
                <Card.Content>
                  <Title>{item.label}</Title>
                  <AnimatedProgressBar
                    progress={item.value}
                    title="Значение"
                    color={COLORS.accent} // Используем цвет Arsenal вместо хардкодного значения
                  />
                </Card.Content>
              </Card>
            )}
            keyExtractor={item => item.label}
          />

          <AnimatedGoalList goals={sampleGoals} title="Список целей" />

          <AnimatedProgressChart
            data={sampleData}
            title="График прогресса"
            color={COLORS.warning} // Используем цвет Arsenal вместо хардкодного значения
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // Используем цвет Arsenal вместо хардкодного значения
  },
  tabContent: {
    padding: 16,
  },
  button: {
    marginTop: 16,
  },
  goalCard: {
    marginBottom: 16,
  },
  listItem: {
    marginBottom: 16,
  },
});
