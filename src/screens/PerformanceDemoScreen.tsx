import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, Card, Title, Paragraph } from 'react-native-paper';
import { usePerformanceOptimization } from '../hooks/usePerformanceOptimization';
import { COLORS, SIZES } from '../constants';
import { AnimatedCard } from '../components/AnimatedCard';
import { ArsenalBanner } from '../components/ArsenalBanner';
import { AnimatedList } from '../components/AnimatedList';
import { useAuth, UserRole } from '../context/LocalStorageAuthContext';
import { UnderDevelopmentBanner } from '../components/UnderDevelopmentBanner';

export const PerformanceDemoScreen: React.FC = () => {
  const { performanceMetrics, measurePerformance, createOptimizedCallback, createOptimizedMemo } =
    usePerformanceOptimization();

  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [count, setCount] = useState(0);

  // Показываем заглушку для экрана в разработке
  if (user?.role === UserRole.MANAGER) {
    return (
      <UnderDevelopmentBanner
        title="Демонстрация оптимизаций"
        description="Этот раздел находится в активной разработке. Функционал демонстрации производительности будет доступен в следующем обновлении."
      />
    );
  }

  // Создаем массив данных для тестирования
  const generateTestData = createOptimizedCallback((size: number) => {
    const testData = [];
    for (let i = 0; i < size; i++) {
      testData.push({
        id: `item-${i}`,
        title: `Элемент ${i + 1}`,
        description: `Описание элемента ${i + 1}`,
        value: Math.random() * 100,
      });
    }
    return testData;
  }, []);

  // Мемоизированное вычисление статистики
  const statistics = createOptimizedMemo(() => {
    if (items.length === 0) return { average: 0, min: 0, max: 0 };

    const values = items.map(item => item.value);
    const sum = values.reduce((a, b) => a + b, 0);
    const average = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    return { average, min, max };
  }, [items]);

  // Функция для добавления элементов с измерением производительности
  const addItems = createOptimizedCallback(
    async (size: number) => {
      await measurePerformance(async () => {
        const newItems = generateTestData(size);
        setItems(prev => [...prev, ...newItems]);
      });
    },
    [generateTestData]
  );

  // Функция для очистки списка
  const clearItems = createOptimizedCallback(() => {
    setItems([]);
  }, []);

  // Функция для рендеринга элемента списка
  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => (
      <Card style={styles.itemCard}>
        <Card.Content>
          <Title style={styles.itemTitle}>{item.title}</Title>
          <Paragraph style={styles.itemDescription}>{item.description}</Paragraph>
          <Text style={styles.itemValue}>Значение: {item.value.toFixed(2)}</Text>
        </Card.Content>
      </Card>
    ),
    []
  );

  // Функция для извлечения ключа элемента
  const keyExtractor = useCallback((item: any) => item.id, []);

  return (
    <ScrollView style={styles.container}>
      <ArsenalBanner
        title="Демонстрация оптимизаций"
        subtitle="Тестирование производительности приложения"
      />

      <AnimatedCard animationType="fade" delay={200}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Метрики производительности</Title>
            <Paragraph style={styles.cardText}>
              Количество рендеров: {performanceMetrics.renderCount}
            </Paragraph>
            <Paragraph style={styles.cardText}>
              Последнее время рендеринга: {performanceMetrics.lastRenderTime.toFixed(2)} мс
            </Paragraph>
            <Paragraph style={styles.cardText}>
              Среднее время рендеринга: {performanceMetrics.averageRenderTime.toFixed(2)} мс
            </Paragraph>
          </Card.Content>
        </Card>
      </AnimatedCard>

      <AnimatedCard animationType="slide" delay={400}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Статистика данных</Title>
            <Paragraph style={styles.cardText}>Количество элементов: {items.length}</Paragraph>
            <Paragraph style={styles.cardText}>
              Среднее значение: {statistics.average.toFixed(2)}
            </Paragraph>
            <Paragraph style={styles.cardText}>
              Минимальное значение: {statistics.min.toFixed(2)}
            </Paragraph>
            <Paragraph style={styles.cardText}>
              Максимальное значение: {statistics.max.toFixed(2)}
            </Paragraph>
          </Card.Content>
        </Card>
      </AnimatedCard>

      <AnimatedCard animationType="scale" delay={600}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Тестирование производительности</Title>
            <Paragraph style={styles.cardText}>
              Нажмите кнопки ниже, чтобы добавить элементы в список и измерить производительность.
            </Paragraph>

            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={() => addItems(10)}
                style={styles.button}
                buttonColor={COLORS.primary}>
                Добавить 10 элементов
              </Button>

              <Button
                mode="contained"
                onPress={() => addItems(100)}
                style={styles.button}
                buttonColor={COLORS.secondary}>
                Добавить 100 элементов
              </Button>

              <Button
                mode="contained"
                onPress={() => addItems(1000)}
                style={styles.button}
                buttonColor={COLORS.accent}>
                Добавить 1000 элементов
              </Button>

              <Button
                mode="outlined"
                onPress={clearItems}
                style={styles.button}
                textColor={COLORS.error}>
                Очистить список
              </Button>
            </View>
          </Card.Content>
        </Card>
      </AnimatedCard>

      {items.length > 0 && (
        <AnimatedCard animationType="fade" delay={800}>
          <Card style={styles.listCard}>
            <Card.Content>
              <Title style={styles.cardTitle}>Список элементов</Title>
              <AnimatedList data={items} renderItem={renderItem} keyExtractor={keyExtractor} />
            </Card.Content>
          </Card>
        </AnimatedCard>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  card: {
    margin: SIZES.padding,
    borderRadius: SIZES.borderRadius,
  },
  listCard: {
    margin: SIZES.padding,
    borderRadius: SIZES.borderRadius,
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SIZES.padding,
    color: COLORS.text,
  },
  cardText: {
    fontSize: 16,
    marginBottom: SIZES.padding / 2,
    color: COLORS.textSecondary,
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: SIZES.padding,
  },
  button: {
    marginVertical: SIZES.padding / 2,
  },
  itemCard: {
    marginVertical: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  itemDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginVertical: 4,
  },
  itemValue: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
