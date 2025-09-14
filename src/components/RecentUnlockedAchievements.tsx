import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import { COLORS } from '../constants';
import { Achievement } from '../types';
import { AnimatedCard } from './AnimatedCard';

interface RecentUnlockedAchievementsProps {
  achievements: Achievement[];
  title?: string;
  onAchievementPress?: (achievement: Achievement) => void;
  onSeeAllPress?: () => void;
}

export const RecentUnlockedAchievements: React.FC<RecentUnlockedAchievementsProps> = ({
  achievements,
  title = 'Недавние достижения',
  onAchievementPress,
  onSeeAllPress,
}) => {
  // Фильтруем только разблокированные достижения и сортируем по дате
  const unlockedAchievements = achievements
    .filter(a => a.isUnlocked && a.earnedAt)
    .sort((a, b) => new Date(b.earnedAt!).getTime() - new Date(a.earnedAt!).getTime())
    .slice(0, 3); // Берем только 3 последних

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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'training':
        return 'run';
      case 'skill':
        return 'soccer';
      case 'progress':
        return 'chart-line';
      case 'attendance':
        return 'calendar-check';
      case 'special':
        return 'star';
      default:
        return 'trophy';
    }
  };

  return (
    <AnimatedCard animationType="fade" delay={500}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.seeAll} onPress={onSeeAllPress}>
              Все
            </Text>
          </View>

          <FlatList
            data={unlockedAchievements}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.achievementItem}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: `${getCategoryColor(item.category)}20` },
                  ]}>
                  <IconButton
                    icon={getCategoryIcon(item.category)}
                    size={16}
                    iconColor={getCategoryColor(item.category)}
                  />
                </View>
                <View style={styles.achievementContent}>
                  <Text style={styles.achievementTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.achievementDate}>
                    {item.earnedAt && new Date(item.earnedAt).toLocaleDateString('ru-RU')}
                  </Text>
                </View>
                <IconButton
                  icon="chevron-right"
                  size={20}
                  onPress={() => onAchievementPress?.(item)}
                  style={styles.chevronIcon}
                />
              </View>
            )}
          />
        </Card.Content>
      </Card>
    </AnimatedCard>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  seeAll: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  iconContainer: {
    borderRadius: 20,
    padding: 8,
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
  achievementDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  chevronIcon: {
    margin: 0,
  },
});
