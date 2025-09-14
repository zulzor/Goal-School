import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, ActivityIndicator } from 'react-native-paper';
import { NutritionService } from '../services';
import { COLORS } from '../constants';
import { AnimatedList } from '../components/AnimatedList';
import { useAuth, UserRole } from '../context/LocalStorageAuthContext';
import { UnderDevelopmentBanner } from '../components/UnderDevelopmentBanner';

export const NutritionTestScreen: React.FC = () => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Показываем заглушку для экрана в разработке
  if (user?.role === UserRole.MANAGER) {
    return (
      <UnderDevelopmentBanner
        title="Тест экрана питания"
        description="Этот раздел находится в активной разработке. Функционал тестирования питания будет доступен в следующем обновлении."
      />
    );
  }

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const data = await NutritionService.getNutritionRecommendations();
      setRecommendations(data);
    } catch (error) {
      console.error('Ошибка загрузки рекомендаций:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить рекомендации по питанию');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title>Тест экрана питания</Title>
          <Paragraph>Проверка отображения рекомендаций по питанию</Paragraph>
        </Card.Content>
      </Card>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Paragraph style={styles.loadingText}>Загрузка рекомендаций...</Paragraph>
        </View>
      ) : (
        <AnimatedList
          data={recommendations}
          keyExtractor={item => item.id}
          renderItem={({ item }: { item: any }) => (
            <Card style={styles.recommendationCard}>
              <Card.Content>
                <Title style={styles.cardTitle}>{item.title}</Title>
                <Paragraph style={styles.cardDescription}>{item.description}</Paragraph>
                <View style={styles.cardFooter}>
                  <Paragraph style={styles.ageGroup}>Возрастная группа: {item.ageGroup}</Paragraph>
                </View>
              </Card.Content>
            </Card>
          )}
        />
      )}

      <Button
        mode="contained"
        onPress={loadRecommendations}
        style={styles.refreshButton}
        disabled={loading}>
        {loading ? 'Загрузка...' : 'Обновить'}
      </Button>
    </View>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  recommendationCard: {
    margin: 16,
    marginVertical: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ageGroup: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  refreshButton: {
    margin: 16,
  },
});
