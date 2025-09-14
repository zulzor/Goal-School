import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card } from 'react-native-paper';
import { COLORS } from '../constants';
import { Achievement } from '../types';
import { AchievementCategory } from './AchievementCategory';

interface AchievementSummaryProps {
  achievements: Achievement[];
  title?: string;
}

export const AchievementSummary: React.FC<AchievementSummaryProps> = ({
  achievements,
  title = 'Категории достижений',
}) => {
  // Группируем достижения по категориям
  const categoryStats = achievements.reduce(
    (acc, achievement) => {
      const category = achievement.category;
      if (!acc[category]) {
        acc[category] = { unlocked: 0, total: 0 };
      }

      acc[category].total += 1;
      if (achievement.isUnlocked) {
        acc[category].unlocked += 1;
      }

      return acc;
    },
    {} as Record<string, { unlocked: number; total: number }>
  );

  // Преобразуем в массив для отображения
  const categories = Object.entries(categoryStats).map(([category, stats]) => ({
    category: category as 'training' | 'skill' | 'progress' | 'attendance' | 'special',
    unlocked: stats.unlocked,
    total: stats.total,
  }));

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'training':
        return 'Тренировки';
      case 'skill':
        return 'Навыки';
      case 'progress':
        return 'Прогресс';
      case 'attendance':
        return 'Посещаемость';
      case 'special':
        return 'Специальные';
      default:
        return 'Достижения';
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.title}>{title}</Text>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <AchievementCategory
              category={item.category}
              count={item.unlocked}
              label={getCategoryLabel(item.category)}
            />
          )}
          keyExtractor={item => item.category}
        />
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.legendText}>Тренировки</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#2196F3' }]} />
            <Text style={styles.legendText}>Навыки</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#FF9800' }]} />
            <Text style={styles.legendText}>Прогресс</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#9C27B0' }]} />
            <Text style={styles.legendText}>Посещаемость</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#E91E63' }]} />
            <Text style={styles.legendText}>Специальные</Text>
          </View>
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
    color: COLORS.text,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
