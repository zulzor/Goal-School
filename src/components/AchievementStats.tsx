import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Card, Title, useTheme } from 'react-native-paper';
import { Achievement } from '../types';

interface AchievementStatsProps {
  achievements: Achievement[];
  studentId: string;
}

export const AchievementStats: React.FC<AchievementStatsProps> = ({ achievements, studentId }) => {
  const theme = useTheme();

  // Подсчет статистики
  const totalAchievements = achievements.length;
  const unlockedAchievements = achievements.filter(a => a.isUnlocked).length;
  const lockedAchievements = totalAchievements - unlockedAchievements;

  // Подсчет очков
  const totalPoints = achievements
    .filter(a => a.isUnlocked)
    .reduce((sum, achievement) => sum + achievement.points, 0);

  // Группировка по категориям
  const achievementsByCategory = achievements.reduce(
    (acc, achievement) => {
      if (!acc[achievement.category]) {
        acc[achievement.category] = { total: 0, unlocked: 0 };
      }
      acc[achievement.category].total += 1;
      if (achievement.isUnlocked) {
        acc[achievement.category].unlocked += 1;
      }
      return acc;
    },
    {} as Record<string, { total: number; unlocked: number }>
  );

  const categoryCount = Object.keys(achievementsByCategory).length;

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>Статистика достижений</Title>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>
              {unlockedAchievements}
            </Text>
            <Text style={styles.statLabel}>Разблокировано</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.secondary }]}>
              {lockedAchievements}
            </Text>
            <Text style={styles.statLabel}>Осталось</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.tertiary }]}>{totalPoints}</Text>
            <Text style={styles.statLabel}>Очков</Text>
          </View>
        </View>

        <View style={styles.categoryStats}>
          <Text style={styles.categoryTitle}>По категориям</Text>
          <Text style={styles.categoryText}>
            {categoryCount} категории, {totalAchievements} достижений
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  categoryStats: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
});
