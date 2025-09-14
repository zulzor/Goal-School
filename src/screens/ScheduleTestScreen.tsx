import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, ActivityIndicator } from 'react-native-paper';
import { TrainingService } from '../services';
import { COLORS } from '../constants';
import { AnimatedList } from '../components/AnimatedList';
import { useAuth, UserRole } from '../context/LocalStorageAuthContext';
import { UnderDevelopmentBanner } from '../components/UnderDevelopmentBanner';

export const ScheduleTestScreen: React.FC = () => {
  const [trainings, setTrainings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Показываем заглушку для экрана в разработке
  if (user?.role === UserRole.MANAGER) {
    return (
      <UnderDevelopmentBanner
        title="Тест экрана расписания"
        description="Этот раздел находится в активной разработке. Функционал тестирования расписания будет доступен в следующем обновлении."
      />
    );
  }

  useEffect(() => {
    loadTrainings();
  }, []);

  const loadTrainings = async () => {
    try {
      setLoading(true);
      const trainingData = await TrainingService.getTrainings();
      setTrainings(trainingData);
    } catch (error) {
      console.error('Ошибка загрузки тренировок:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить тренировки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title>Тест экрана расписания</Title>
          <Paragraph>Проверка отображения тренировок</Paragraph>
        </Card.Content>
      </Card>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Paragraph style={styles.loadingText}>Загрузка тренировок...</Paragraph>
        </View>
      ) : (
        <AnimatedList
          data={trainings}
          keyExtractor={item => item.id}
          renderItem={({ item }: { item: any }) => (
            <Card style={styles.trainingCard}>
              <Card.Content>
                <Title style={styles.trainingTitle}>{item.title}</Title>
                <Paragraph style={styles.trainingDescription}>{item.description}</Paragraph>
                <View style={styles.trainingDetails}>
                  <Paragraph>📅 {item.date}</Paragraph>
                  <Paragraph>
                    🕒 {item.startTime} - {item.endTime}
                  </Paragraph>
                  <Paragraph>📍 {item.location}</Paragraph>
                </View>
              </Card.Content>
            </Card>
          )}
        />
      )}

      <Button
        mode="contained"
        onPress={loadTrainings}
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
  trainingCard: {
    margin: 16,
    marginVertical: 4,
  },
  trainingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  trainingDescription: {
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  trainingDetails: {
    marginBottom: 16,
  },
  refreshButton: {
    margin: 16,
  },
});
