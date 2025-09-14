import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  ActivityIndicator,
  ProgressBar,
  List,
  Divider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { attendanceService } from '../services';
import { progressService } from '../services';
import { useAuth, UserRole } from '../context/LocalStorageAuthContext';
import { COLORS, SIZES } from '../constants';
import { Platform } from 'react-native';

// Получаем ширину экрана для адаптивного дизайна
const { width } = Dimensions.get('window');

interface AttendanceStats {
  totalStudents: number;
  averageAttendance: number;
  topAttenders: Array<{ student_name: string; attendance_percentage: number }>;
  lowAttenders: Array<{ student_name: string; attendance_percentage: number }>;
}

interface ProgressOverview {
  totalStudents: number;
  studentsWithProgress: number;
  averageOverallProgress: number;
  recentFeedbackCount: number;
  activeGoalsCount: number;
  topPerformers: Array<{ student_name: string; average_progress: number }>;
  needsAttention: Array<{ student_name: string; average_progress: number }>;
}

export const AttendanceAnalyticsScreen = () => {
  const { user } = useAuth();
  const [attendanceStats, setAttendanceStats] = useState<any>(null);
  const [progressOverview, setProgressOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    if (!user || user.role !== UserRole.MANAGER) return;

    try {
      setLoading(true);

      // Получаем статистику посещаемости
      const attendanceData = await attendanceService.getOverallAttendanceStats({
        // В будущем можно добавить фильтрацию по периоду
      });
      setAttendanceStats(attendanceData);

      // Получаем обзор прогресса
      const progressData = await progressService.getCoachProgressOverview();
      setProgressOverview(progressData);
    } catch (error) {
      console.error('Ошибка загрузки аналитики:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить аналитические данные');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadAnalyticsData();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Загрузка аналитики...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user || user.role !== UserRole.MANAGER) {
    return (
      <SafeAreaView style={styles.container}>
        <Card style={styles.errorCard}>
          <Card.Content>
            <Title>Доступ запрещен</Title>
            <Paragraph>Эта функция доступна только управляющим</Paragraph>
          </Card.Content>
        </Card>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <Title style={styles.title}>Аналитика посещаемости</Title>
          <View style={styles.headerActions}>
            <Chip
              mode={timeRange === 'week' ? 'flat' : 'outlined'}
              onPress={() => setTimeRange('week')}
              style={styles.chip}>
              Неделя
            </Chip>
            <Chip
              mode={timeRange === 'month' ? 'flat' : 'outlined'}
              onPress={() => setTimeRange('month')}
              style={styles.chip}>
              Месяц
            </Chip>
            <Chip
              mode={timeRange === 'quarter' ? 'flat' : 'outlined'}
              onPress={() => setTimeRange('quarter')}
              style={styles.chip}>
              Квартал
            </Chip>
            <Button icon="refresh" onPress={refreshData} style={styles.refreshButton}>
              Обновить
            </Button>
          </View>
        </View>

        {/* Общая статистика посещаемости */}
        <Card style={styles.statsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Общая статистика</Title>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{attendanceStats?.totalStudents || 0}</Text>
                <Text style={styles.statLabel}>Всего учеников</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {attendanceStats ? `${attendanceStats.averageAttendance.toFixed(1)}%` : '0%'}
                </Text>
                <Text style={styles.statLabel}>Средняя посещаемость</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{progressOverview?.totalStudents || 0}</Text>
                <Text style={styles.statLabel}>С отслеживанием</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Топ посещаемости */}
        <Card style={styles.listCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Лучшая посещаемость</Title>
            {attendanceStats?.topAttenders.map((student: any, index: number) => (
              <React.Fragment key={index}>
                <View style={styles.listItem}>
                  <Text style={styles.listItemText}>{student.student_name}</Text>
                  <View style={styles.progressContainer}>
                    <ProgressBar
                      progress={student.attendance_percentage / 100}
                      color={COLORS.primary}
                      style={styles.progressBar}
                    />
                    <Text style={styles.progressText}>
                      {student.attendance_percentage.toFixed(1)}%
                    </Text>
                  </View>
                </View>
                {index < attendanceStats.topAttenders.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Card.Content>
        </Card>

        {/* Низкая посещаемость */}
        <Card style={styles.listCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Низкая посещаемость</Title>
            {attendanceStats?.lowAttenders.map((student: any, index: number) => (
              <React.Fragment key={index}>
                <View style={styles.listItem}>
                  <Text style={styles.listItemText}>{student.student_name}</Text>
                  <View style={styles.progressContainer}>
                    <ProgressBar
                      progress={student.attendance_percentage / 100}
                      color={COLORS.error}
                      style={styles.progressBar}
                    />
                    <Text style={styles.progressText}>
                      {student.attendance_percentage.toFixed(1)}%
                    </Text>
                  </View>
                </View>
                {index < attendanceStats.lowAttenders.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Card.Content>
        </Card>

        {/* Прогресс учеников */}
        <Card style={styles.statsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Прогресс учеников</Title>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{progressOverview?.studentsWithProgress || 0}</Text>
                <Text style={styles.statLabel}>С отслеживанием</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {progressOverview
                    ? `${progressOverview.averageOverallProgress.toFixed(1)}%`
                    : '0%'}
                </Text>
                <Text style={styles.statLabel}>Средний прогресс</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{progressOverview?.activeGoalsCount || 0}</Text>
                <Text style={styles.statLabel}>Активные цели</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Лучшие результаты */}
        <Card style={styles.listCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Лучшие результаты</Title>
            {progressOverview?.topPerformers.map((student: any, index: number) => (
              <React.Fragment key={index}>
                <View style={styles.listItem}>
                  <Text style={styles.listItemText}>{student.student_name}</Text>
                  <View style={styles.progressContainer}>
                    <ProgressBar
                      progress={student.average_progress / 100}
                      color={COLORS.primary}
                      style={styles.progressBar}
                    />
                    <Text style={styles.progressText}>{student.average_progress.toFixed(1)}%</Text>
                  </View>
                </View>
                {index < progressOverview.topPerformers.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Card.Content>
        </Card>

        {/* Требуют внимания */}
        <Card style={styles.listCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Требуют внимания</Title>
            {progressOverview?.needsAttention.map((student: any, index: number) => (
              <React.Fragment key={index}>
                <View style={styles.listItem}>
                  <Text style={styles.listItemText}>{student.student_name}</Text>
                  <View style={styles.progressContainer}>
                    <ProgressBar
                      progress={student.average_progress / 100}
                      color={COLORS.warning}
                      style={styles.progressBar}
                    />
                    <Text style={styles.progressText}>{student.average_progress.toFixed(1)}%</Text>
                  </View>
                </View>
                {index < progressOverview.needsAttention.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flex: 1,
    padding: SIZES.padding,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SIZES.padding,
    color: COLORS.textSecondary,
  },
  errorCard: {
    margin: SIZES.padding,
    // Используем boxShadow вместо elevation для веб-совместимости
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  header: {
    marginBottom: SIZES.padding,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SIZES.padding,
  },
  headerActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  chip: {
    marginRight: SIZES.padding / 2,
    marginBottom: SIZES.padding / 2,
  },
  refreshButton: {
    marginLeft: 'auto',
  },
  statsCard: {
    marginBottom: SIZES.padding,
    // Используем boxShadow вместо elevation для веб-совместимости
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  listCard: {
    marginBottom: SIZES.padding,
    // Используем boxShadow вместо elevation для веб-совместимости
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
    marginBottom: SIZES.padding,
    color: COLORS.text,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: SIZES.padding / 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.padding / 2,
  },
  listItemText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.4,
  },
  progressBar: {
    flex: 1,
    height: 8,
    marginRight: SIZES.padding / 2,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    minWidth: 40,
  },
});
