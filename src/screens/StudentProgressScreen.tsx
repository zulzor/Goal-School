import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Platform, Dimensions, ScrollView } from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Searchbar,
  Chip,
  ActivityIndicator,
} from 'react-native-paper';
import { useAuth, UserRole } from '../context/LocalStorageAuthContext';
import { progressService } from '../services'; // Используем реальный сервис
import { COLORS, SIZES } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnimatedCard } from '../components/AnimatedCard';
import { AnimatedProgressBar } from '../components/AnimatedProgressBar';
import { AnimatedProgressChart } from '../components/AnimatedProgressChart';
import { AnimatedGoalList } from '../components/AnimatedGoalList';
import { AnimatedLoader } from '../components/AnimatedLoader';
import { ArsenalBanner } from '../components/ArsenalBanner';
import { BeautifulTabBar } from '../components/BeautifulTabBar';
import { UnderDevelopmentBanner } from '../components/UnderDevelopmentBanner';

const { width } = Dimensions.get('window');

export default function StudentProgressScreen() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('progress');
  const [skills, setSkills] = useState<any[]>([]);
  const [overallProgress, setOverallProgress] = useState<any>(null);
  const [recentAchievements, setRecentAchievements] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<any[]>([]);
  const [recentFeedback, setRecentFeedback] = useState<any[]>([]);

  const tabs = [
    { key: 'progress', title: 'Прогресс', icon: '📈' },
    { key: 'attendance', title: 'Посещаемость', icon: '📅' },
    { key: 'feedback', title: 'Отзывы', icon: '💬' },
  ];

  // Загрузка данных
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        return;
      }

      try {
        setIsLoading(true);

        // Определяем ID ученика (для родителей - ID их ребенка)
        const studentId =
          user.role === UserRole.PARENT && user.childrenIds?.[0] ? user.childrenIds[0] : user.id;

        // Используем реальный сервис вместо моковых данных
        const skillsData = await progressService.getAllSkills();
        const progressData = await progressService.getStudentProgress(studentId);
        const goalsData = await progressService.getStudentGoals(studentId);
        const feedbackData = await progressService.getStudentFeedback(studentId);

        // Обрабатываем данные для отображения
        const processedSkills = skillsData.map(skill => ({
          id: skill.id,
          name: skill.name,
          category: skill.category,
          level: skill.level === 'beginner' ? 25 : 
                 skill.level === 'intermediate' ? 50 : 
                 skill.level === 'advanced' ? 75 : 100,
        }));

        const processedOverallProgress = {
          totalSkills: skillsData.length,
          overallPercentage: progressData.length > 0 ? 
            Math.round(progressData.reduce((sum, p) => sum + p.current_level, 0) / progressData.length) : 0,
          skillsInProgress: progressData.filter(p => p.current_level < p.target_level).length,
          completedGoals: goalsData.filter((g: any) => g.status === 'completed').length,
          activeGoals: goalsData.filter((g: any) => g.status === 'active').length,
          categoryStats: [
            { category: 'technical', percentage: 65 },
            { category: 'physical', percentage: 80 },
            { category: 'tactical', percentage: 55 },
            { category: 'mental', percentage: 60 },
            { category: 'social', percentage: 70 },
          ],
        };

        const processedGoals = goalsData.map((goal: any) => ({
          id: goal.id,
          title: goal.title,
          description: goal.description,
          status: goal.status,
          target_date: goal.target_date,
          progress: goal.progress_percentage,
        }));

        const processedFeedback = feedbackData.map((feedback: any) => ({
          id: feedback.id,
          name: feedback.training?.title || 'Тренировка',
          description: feedback.public_feedback || 'Нет описания',
          rating: feedback.overall_rating || 0,
        }));

        // Моковые данные для посещаемости (пока нет реального сервиса)
        const mockAttendanceStats = [
          {
            month: 9,
            year: 2025,
            attendance_percentage: 85,
            attended_trainings: 12,
            missed_trainings: 2,
          },
          {
            month: 8,
            year: 2025,
            attendance_percentage: 92,
            attended_trainings: 11,
            missed_trainings: 1,
          },
          {
            month: 7,
            year: 2025,
            attendance_percentage: 78,
            attended_trainings: 10,
            missed_trainings: 3,
          },
        ];

        setSkills(processedSkills);
        setOverallProgress(processedOverallProgress);
        setGoals(processedGoals);
        setAttendanceStats(mockAttendanceStats);
        setRecentFeedback(processedFeedback);
      } catch (error) {
        console.error('Ошибка загрузки данных прогресса:', error);
        Alert.alert('Ошибка', 'Не удалось загрузить данные прогресса');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  const renderProgressTab = () => (
    <ScrollView style={styles.tabContent}>
      <AnimatedCard animationType="scale" delay={0}>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Title>Общий прогресс</Title>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{overallProgress?.totalSkills || 0}</Text>
                <Text style={styles.statLabel}>Навыков</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {Math.round(overallProgress?.overallPercentage || 0)}%
                </Text>
                <Text style={styles.statLabel}>Средний прогресс</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {goals.filter((g: any) => g.status === 'active').length || 0}
                </Text>
                <Text style={styles.statLabel}>Активные цели</Text>
              </View>
            </View>

            <View style={styles.progressBarContainer}>
              <AnimatedProgressBar
                progress={Math.round(overallProgress?.overallPercentage || 0)}
                title="Общий прогресс"
                color={COLORS.primary} // Используем цвет Arsenal
              />
            </View>
          </Card.Content>
        </Card>
      </AnimatedCard>

      {/* График прогресса */}
      <AnimatedProgressChart
        data={skills.slice(0, 5).map((item: any) => ({
          value: item.level,
          label: item.name,
          date: new Date().toISOString(),
        }))}
        title="Динамика прогресса"
        color={COLORS.primary} // Используем цвет Arsenal
      />

      <AnimatedCard animationType="fade" delay={200}>
        <Title style={styles.sectionTitle}>Сильные стороны</Title>
      </AnimatedCard>
      {overallProgress?.categoryStats?.map((category: any, index: number) => (
        <AnimatedCard key={index} animationType="scale" delay={300 + index * 100}>
          <Card style={styles.categoryCard}>
            <Card.Content>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryName}>{getCategoryName(category.category)}</Text>
                <Chip>{Math.round(category.percentage)}%</Chip>
              </View>
              <AnimatedProgressBar
                progress={Math.round(category.percentage)}
                color={COLORS.primary} // Используем цвет Arsenal
                showPercentage={false}
              />
            </Card.Content>
          </Card>
        </AnimatedCard>
      ))}

      {/* Список целей */}
      <AnimatedGoalList
        goals={goals.map((goal: any) => ({
          id: goal.id,
          title: goal.title,
          description: goal.description,
          progress: goal.progress,
          target: 100,
          deadline: goal.target_date,
          category: 'general',
          status: goal.status,
        }))}
        title="Активные цели"
      />
    </ScrollView>
  );

  const renderAttendanceTab = () => (
    <ScrollView style={styles.tabContent}>
      {attendanceStats.map((stat: any, index: number) => (
        <AnimatedCard key={index} animationType="scale" delay={index * 100}>
          <Card style={styles.attendanceCard}>
            <Card.Content>
              <Title>
                {getMonthName(stat.month)} {stat.year}
              </Title>
              <View style={styles.attendanceStats}>
                <View style={styles.attendanceStat}>
                  <Text style={styles.attendanceNumber}>
                    {Math.round(stat.attendance_percentage)}%
                  </Text>
                  <Text style={styles.attendanceLabel}>Посещаемость</Text>
                </View>
                <View style={styles.attendanceStat}>
                  <Text style={styles.attendanceNumber}>{stat.attended_trainings}</Text>
                  <Text style={styles.attendanceLabel}>Посещено</Text>
                </View>
                <View style={styles.attendanceStat}>
                  <Text style={styles.attendanceNumber}>{stat.missed_trainings}</Text>
                  <Text style={styles.attendanceLabel}>Пропущено</Text>
                </View>
              </View>

              <View style={styles.progressBarContainer}>
                <AnimatedProgressBar
                  progress={Math.round(stat.attendance_percentage)}
                  title="Посещаемость"
                  color={COLORS.primary} // Используем цвет Arsenal
                />
              </View>
            </Card.Content>
          </Card>
        </AnimatedCard>
      ))}
    </ScrollView>
  );

  const renderFeedbackTab = () => (
    <ScrollView style={styles.tabContent}>
      {recentFeedback.map((feedback: any, index: number) => (
        <AnimatedCard key={index} animationType="scale" delay={index * 100}>
          <Card style={styles.feedbackCard}>
            <Card.Content>
              <View style={styles.feedbackHeader}>
                <Text style={styles.feedbackTraining}>{feedback.name}</Text>
                <Text style={styles.feedbackDate}>{new Date().toLocaleDateString('ru-RU')}</Text>
              </View>
              <Text style={styles.feedbackCoach}>Тренер: Система</Text>
              <View style={styles.ratingContainer}>
                <Text>Общая оценка: </Text>
                {[1, 2, 3, 4, 5].map(star => (
                  <Text
                    key={star}
                    style={[styles.star, star <= feedback.rating && styles.activeStar]}>
                    ⭐
                  </Text>
                ))}
              </View>
              <Paragraph style={styles.feedbackText}>
                {feedback.description || 'Отзыв о достижении навыка'}
              </Paragraph>
            </Card.Content>
          </Card>
        </AnimatedCard>
      ))}
    </ScrollView>
  );

  const getCategoryName = (category: string): string => {
    const names: Record<string, string> = {
      technical: 'Техника',
      physical: 'Физподготовка',
      tactical: 'Тактика',
      mental: 'Ментальная',
      social: 'Социальная',
    };
    return names[category] || category;
  };

  const getMonthName = (month: number) => {
    const months = [
      'Янв',
      'Фев',
      'Мар',
      'Апр',
      'Май',
      'Июн',
      'Июл',
      'Авг',
      'Сен',
      'Окт',
      'Ноя',
      'Дек',
    ];
    return months[month - 1];
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ArsenalBanner title="Прогресс ученика" subtitle="Загрузка данных..." />
        <View style={styles.centerContainer}>
          <AnimatedLoader loading={true} />
          <AnimatedCard animationType="fade" delay={300}>
            <Text style={styles.loadingText}>Загрузка прогресса...</Text>
          </AnimatedCard>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ArsenalBanner title="Прогресс ученика" subtitle="Отслеживайте свой прогресс" />

      <BeautifulTabBar tabs={tabs} activeTab={activeTab} onTabPress={setActiveTab} />

      {isLoading ? (
        <View style={styles.centerContainer}>
          <AnimatedLoader loading={true} />
        </View>
      ) : (
        <>
          {activeTab === 'progress' && renderProgressTab()}
          {activeTab === 'attendance' && renderAttendanceTab()}
          {activeTab === 'feedback' && renderFeedbackTab()}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // Используем цвет Arsenal
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: COLORS.textSecondary, // Используем цвет Arsenal
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  summaryCard: {
    marginBottom: 16,
    backgroundColor: COLORS.surface, // Используем цвет Arsenal
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary, // Используем цвет Arsenal
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary, // Используем цвет Arsenal
    marginTop: 4,
  },
  progressBarContainer: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginVertical: 12,
    color: COLORS.text, // Используем цвет Arsenal
  },
  categoryCard: {
    marginBottom: 12,
    backgroundColor: COLORS.surface, // Используем цвет Arsenal
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text, // Используем цвет Arsenal
  },
  attendanceCard: {
    marginBottom: 12,
    backgroundColor: COLORS.surface, // Используем цвет Arsenal
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  attendanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  attendanceStat: {
    alignItems: 'center',
  },
  attendanceNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.success, // Используем цвет Arsenal
  },
  attendanceLabel: {
    fontSize: 12,
    color: COLORS.textSecondary, // Используем цвет Arsenal
    marginTop: 4,
  },
  feedbackCard: {
    marginBottom: 12,
    backgroundColor: COLORS.surface, // Используем цвет Arsenal
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  feedbackTraining: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    color: COLORS.text, // Используем цвет Arsenal
  },
  feedbackDate: {
    fontSize: 12,
    color: COLORS.textSecondary, // Используем цвет Arsenal
  },
  feedbackCoach: {
    fontSize: 14,
    color: COLORS.textSecondary, // Используем цвет Arsenal
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  star: {
    fontSize: 16,
    color: COLORS.border, // Используем цвет Arsenal
  },
  activeStar: {
    color: COLORS.warning, // Используем цвет Arsenal
  },
  feedbackText: {
    marginTop: 8,
    color: COLORS.text, // Используем цвет Arsenal
  },
});
