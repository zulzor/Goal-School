import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import { COLORS } from '../constants';
import { Achievement } from '../types';

interface RecentAchievementsProps {
  achievements: Achievement[];
  title?: string;
}

export const RecentAchievements: React.FC<RecentAchievementsProps> = ({
  achievements,
  title = 'Недавние достижения',
}) => {
  // Фильтруем только разблокированные достижения и сортируем по дате
  const unlockedAchievements = achievements
    .filter(a => a.isUnlocked && a.earnedAt)
    .sort((a, b) => new Date(b.earnedAt!).getTime() - new Date(a.earnedAt!).getTime())
    .slice(0, 5); // Берем только 5 последних

  if (unlockedAchievements.length === 0) {
    return null;
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'training':
        return '#4CAF50'; // Зеленый
      case 'skill':
        return '#2196F3'; // Синий
      case 'progress':
        return '#FF9800'; // Оранжевый
      case 'attendance':
        return '#9C27B0'; // Фиолетовый
      case 'special':
        return '#E91E63'; // Розовый
      default:
        return COLORS.primary;
    }
  };

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
        return 'Специальное';
      default:
        return 'Достижение';
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.title}>{title}</Text>
        <FlatList
          data={unlockedAchievements}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.achievementItem}>
              <IconButton
                icon={item.icon}
                size={16}
                iconColor={getCategoryColor(item.category)}
                style={styles.achievementIcon}
              />
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>{item.title}</Text>
                <Text style={styles.achievementCategory}>{getCategoryLabel(item.category)}</Text>
              </View>
              <Text style={styles.achievementDate}>
                {item.earnedAt && new Date(item.earnedAt).toLocaleDateString('ru-RU')}
              </Text>
            </View>
          )}
        />
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
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  achievementIcon: {
    margin: 0,
    marginRight: 12,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  achievementCategory: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  achievementDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
