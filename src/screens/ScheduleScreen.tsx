import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { Card, Title, Paragraph, Button, ActivityIndicator, IconButton } from 'react-native-paper';
import { useAuth, UserRole } from '../context/LocalStorageAuthContext';
import { COLORS, SIZES } from '../constants';
import { useFocusEffect, NavigationProp } from '@react-navigation/native';
import { Training as TrainingType } from '../types';
import { TrainingList } from '../components/TrainingList';
import { AnimatedCard } from '../components/AnimatedCard';
import { ArsenalBanner } from '../components/ArsenalBanner';
import { UnderDevelopmentBanner } from '../components/UnderDevelopmentBanner';
import { logError } from '../utils/logger';

interface ScheduleScreenProps {
  navigation: NavigationProp<Record<string, object | undefined>>;
}

// Моковые данные тренировок
const mockTrainings: TrainingType[] = [
  {
    id: '1',
    title: 'Тренировка U-10',
    description: 'Техника владения мячом и базовые упражнения',
    date: '2025-09-03',
    startTime: '10:00',
    endTime: '11:30',
    location: 'Поле A',
    coachId: 'coach1',
    coachName: 'Иванов Сергей',
    maxParticipants: 15,
    currentParticipants: ['1', '2', '3'],
    ageGroup: 'U-10',
    type: 'training',
  },
  {
    id: '2',
    title: 'Матч U-12',
    description: 'Товарищеский матч против команды "Спартак"',
    date: '2025-09-05',
    startTime: '15:00',
    endTime: '17:00',
    location: 'Главное поле',
    coachId: 'coach2',
    coachName: 'Петров Александр',
    maxParticipants: 18,
    currentParticipants: ['4', '5', '6', '7'],
    ageGroup: 'U-12',
    type: 'match',
  },
  {
    id: '3',
    title: 'Тренировка U-8',
    description: 'Игровые упражнения и развитие координации',
    date: '2025-09-04',
    startTime: '14:00',
    endTime: '15:00',
    location: 'Поле B',
    coachId: 'coach1',
    coachName: 'Иванов Сергей',
    maxParticipants: 12,
    currentParticipants: ['8', '9'],
    ageGroup: 'U-8',
    type: 'training',
  },
  {
    id: '4',
    title: 'Тренировка U-14',
    description: 'Тактические схемы и командные действия',
    date: '2025-09-06',
    startTime: '16:00',
    endTime: '17:30',
    location: 'Главное поле',
    coachId: 'coach3',
    coachName: 'Сидоров Михаил',
    maxParticipants: 20,
    currentParticipants: ['10', '11', '12', '13', '14'],
    ageGroup: 'U-14',
    type: 'training',
  },
  {
    id: '5',
    title: 'Турнир U-16',
    description: 'Городской турнир среди юношей',
    date: '2025-09-07',
    startTime: '10:00',
    endTime: '18:00',
    location: 'Главное поле',
    coachId: 'coach4',
    coachName: 'Козлов Алексей',
    maxParticipants: 24,
    currentParticipants: ['15', '16', '17', '18', '19', '20'],
    ageGroup: 'U-16',
    type: 'tournament',
  },
];

export const ScheduleScreen: React.FC<ScheduleScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [trainings, setTrainings] = useState<TrainingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTrainings();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadTrainings();
    }, [])
  );

  const loadTrainings = async () => {
    try {
      setLoading(true);
      setError(null);
      // В реальном приложении здесь будет запрос к сервису тренировок
      // Пока используем моковые данные
      setTrainings(mockTrainings);
    } catch (err: unknown) {
      logError('Ошибка загрузки тренировок:', err);
      setError((err as Error).message || 'Не удалось загрузить тренировки');
      // В случае ошибки используем моковые данные
      setTrainings(mockTrainings);
    } finally {
      setLoading(false);
    }
  };

  const getTrainingsForDate = (date: string) => {
    return trainings.filter(training => training.date === date);
  };

  const handleRegisterForTraining = async (_trainingId: string) => {
    if (!user) {
      return;
    }

    Alert.alert('Регистрация на тренировку', 'Вы хотите зарегистрироваться на эту тренировку?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Да',
        onPress: async () => {
          try {
            // В реальном приложении здесь будет регистрация на тренировку
            Alert.alert('Успешно!', 'Вы зарегистрированы на тренировку');
          } catch (err: unknown) {
            logError('Ошибка регистрации:', err);
            Alert.alert(
              'Ошибка',
              (err as Error).message || 'Не удалось зарегистрироваться на тренировку'
            );
          }
        },
      },
    ]);
  };

  const handleManageTraining = (_trainingId: string) => {
    // Переход к экрану управления тренировкой
    navigation.navigate('AdminPanel');
  };

  const selectedTrainings = getTrainingsForDate(selectedDate);

  // Форматирование даты для отображения
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Получение тренировок на ближайшие 7 дней
  const getUpcomingTrainings = () => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    return trainings
      .filter(training => {
        const trainingDate = new Date(training.date);
        return trainingDate >= today && trainingDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const upcomingTrainings = getUpcomingTrainings();

  // Показываем заглушку для экрана в разработке
  // Адаптируем для родителей - они должны видеть расписание своих детей
  if (user?.role === UserRole.MANAGER) {
    return (
      <UnderDevelopmentBanner
        title="Расписание тренировок"
        description="Этот раздел находится в активной разработке. Функционал управления расписанием будет доступен в следующем обновлении."
        onBackPress={() => navigation.goBack()}
      />
    );
  }

  // Для родителей показываем специальное сообщение
  const isParent = user?.role === UserRole.PARENT;

  return (
    <View style={styles.container}>
      <ArsenalBanner
        title="Расписание тренировок"
        subtitle={
          isParent
            ? 'Расписание тренировок вашего ребенка'
            : 'Запланированные занятия и мероприятия'
        }
      />

      {isParent && (
        <AnimatedCard animationType="fade" delay={0}>
          <Card style={styles.infoCard}>
            <Card.Content>
              <Paragraph style={styles.infoText}>
                Здесь отображается расписание тренировок для вашего ребенка. Вы можете видеть даты,
                время и место проведения тренировок.
              </Paragraph>
            </Card.Content>
          </Card>
        </AnimatedCard>
      )}

      <AnimatedCard animationType="scale" delay={0}>
        <Card style={styles.headerCard}>
          <Card.Content style={styles.headerContent}>
            <Title style={styles.headerTitle}>Выбранная дата</Title>
            <View style={styles.dateHeader}>
              <IconButton
                icon="chevron-left"
                onPress={() => {
                  const date = new Date(selectedDate);
                  date.setDate(date.getDate() - 1);
                  setSelectedDate(date.toISOString().split('T')[0]);
                }}
              />
              <Paragraph style={styles.dateText}>{formatDate(selectedDate)}</Paragraph>
              <IconButton
                icon="chevron-right"
                onPress={() => {
                  const date = new Date(selectedDate);
                  date.setDate(date.getDate() + 1);
                  setSelectedDate(date.toISOString().split('T')[0]);
                }}
              />
            </View>
            <Button mode="outlined" onPress={loadTrainings} loading={loading} disabled={loading}>
              Обновить
            </Button>
          </Card.Content>
        </Card>
      </AnimatedCard>

      {error && (
        <AnimatedCard animationType="fade" delay={200}>
          <Card style={styles.errorCard}>
            <Card.Content>
              <Paragraph style={styles.errorText}>{error}</Paragraph>
            </Card.Content>
          </Card>
        </AnimatedCard>
      )}

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Paragraph style={styles.loadingText}>Загрузка тренировок...</Paragraph>
        </View>
      ) : selectedTrainings.length === 0 ? (
        <AnimatedCard animationType="fade" delay={200}>
          <View style={styles.centerContainer}>
            <IconButton icon="calendar-blank" size={48} iconColor={COLORS.textSecondary} />
            <Paragraph style={styles.emptyText}>На выбранную дату тренировок нет</Paragraph>
            <Button mode="outlined" onPress={loadTrainings} style={styles.retryButton}>
              Попробовать снова
            </Button>
          </View>
        </AnimatedCard>
      ) : (
        <TrainingList
          trainings={selectedTrainings}
          onRegister={handleRegisterForTraining}
          onManage={handleManageTraining}
          userRole={user?.role}
          userId={user?.id}
        />
      )}

      {/* Ближайшие тренировки */}
      <AnimatedCard animationType="fade" delay={400}>
        <Card style={styles.upcomingCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Ближайшие тренировки</Title>
            {upcomingTrainings.slice(0, 3).map((training, _index) => (
              <View key={training.id} style={styles.upcomingItem}>
                <Paragraph style={styles.upcomingDate}>
                  {new Date(training.date).toLocaleDateString('ru-RU')}
                </Paragraph>
                <Paragraph style={styles.upcomingTitle}>{training.title}</Paragraph>
                <Paragraph style={styles.upcomingTime}>
                  {training.startTime} - {training.endTime}
                </Paragraph>
              </View>
            ))}
            {upcomingTrainings.length === 0 && (
              <Paragraph style={styles.noUpcomingText}>Нет запланированных тренировок</Paragraph>
            )}
          </Card.Content>
        </Card>
      </AnimatedCard>

      <View style={styles.bottomSpacing} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerCard: {
    margin: SIZES.padding,
    marginBottom: 8,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  errorCard: {
    margin: SIZES.padding,
    marginBottom: 8,
    backgroundColor: COLORS.background,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  errorText: {
    color: COLORS.error,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    marginTop: 16,
  },
  upcomingCard: {
    margin: SIZES.padding,
    marginBottom: 8,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: COLORS.text,
  },
  upcomingItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  upcomingDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: COLORS.text,
  },
  upcomingTime: {
    fontSize: 14,
    color: COLORS.primary,
  },
  noUpcomingText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  bottomSpacing: {
    height: 20,
  },
  infoCard: {
    margin: SIZES.padding,
    backgroundColor: COLORS.surface,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  infoText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
  },
});
