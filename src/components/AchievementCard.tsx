import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import { COLORS } from '../constants';
import { Achievement } from '../types';

interface AchievementCardProps {
  achievement: Achievement;
  onPress?: () => void;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, onPress }) => {
  const getIconColor = () => {
    if (!achievement.isUnlocked) return COLORS.textSecondary;

    switch (achievement.category) {
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

  const getCategoryLabel = () => {
    switch (achievement.category) {
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
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <Card style={[styles.card, !achievement.isUnlocked && styles.lockedCard]}>
        <Card.Content style={styles.content}>
          <View style={styles.header}>
            <IconButton
              icon={achievement.icon}
              size={24}
              iconColor={getIconColor()}
              style={styles.icon}
            />
            <View style={styles.titleContainer}>
              <Text style={[styles.title, !achievement.isUnlocked && styles.lockedText]}>
                {achievement.title}
              </Text>
              <Text style={[styles.category, !achievement.isUnlocked && styles.lockedText]}>
                {getCategoryLabel()}
              </Text>
            </View>
            {achievement.isUnlocked && achievement.earnedAt && (
              <Text style={styles.date}>
                {new Date(achievement.earnedAt).toLocaleDateString('ru-RU')}
              </Text>
            )}
          </View>

          <Text style={[styles.description, !achievement.isUnlocked && styles.lockedText]}>
            {achievement.description}
          </Text>

          {achievement.isUnlocked ? (
            <View style={styles.pointsContainer}>
              <Text style={styles.points}>+{achievement.points} очков</Text>
            </View>
          ) : (
            <View style={styles.lockedOverlay}>
              <IconButton icon="lock" size={20} iconColor={COLORS.textSecondary} />
              <Text style={styles.lockedText}>Заблокировано</Text>
            </View>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 4,
    marginHorizontal: 16,
    backgroundColor: 'white',
  },
  lockedCard: {
    opacity: 0.7,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    margin: 0,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  category: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  date: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  description: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 12,
    lineHeight: 20,
  },
  pointsContainer: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  points: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  lockedOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  lockedText: {
    color: COLORS.textSecondary,
  },
});
