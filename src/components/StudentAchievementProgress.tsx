import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Card, Title, ProgressBar, useTheme } from 'react-native-paper';
import { Achievement } from '../types';

interface StudentAchievementProgressProps {
  achievements: Achievement[];
  studentId: string;
}

export const StudentAchievementProgress: React.FC<StudentAchievementProgressProps> = ({
  achievements,
  studentId,
}) => {
  const theme = useTheme();

  // Группируем достижения по категориям
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

  // Названия категорий на русском языке
  const categoryNames: Record<string, string> = {
    training: 'Тренировки',
    skill: 'Навыки',
    progress: 'Прогресс',
    attendance: 'Посещаемость',
    special: 'Специальные',
  };

  // Цвета для каждой категории
  const categoryColors: Record<string, string> = {
    training: '#FF6B6B',
    skill: '#4ECDC4',
    progress: '#45B7D1',
    attendance: '#96CEB4',
    special: '#FFEAA7',
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>Прогресс по достижениям</Title>
        {Object.entries(achievementsByCategory).map(([category, stats]) => {
          const progress = stats.total > 0 ? stats.unlocked / stats.total : 0;
          const categoryName = categoryNames[category] || category;
          const color = categoryColors[category] || theme.colors.primary;

          return (
            <View key={category} style={styles.categoryContainer}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryName}>{categoryName}</Text>
                <Text style={styles.categoryStats}>
                  {stats.unlocked}/{stats.total}
                </Text>
              </View>
              <ProgressBar progress={progress} color={color} style={styles.progressBar} />
            </View>
          );
        })}
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
  categoryContainer: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
  },
  categoryStats: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
  },
});
