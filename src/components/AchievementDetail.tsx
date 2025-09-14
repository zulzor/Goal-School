import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import { COLORS } from '../constants';
import { Achievement } from '../types';

interface AchievementDetailProps {
  achievement: Achievement;
  onBack: () => void;
}

export const AchievementDetail: React.FC<AchievementDetailProps> = ({ achievement, onBack }) => {
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

  const getCategoryIcon = () => {
    switch (achievement.category) {
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
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <IconButton icon="arrow-left" size={24} onPress={onBack} style={styles.backButton} />
          <Text style={styles.title}>Детали достижения</Text>
        </View>

        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: `${getIconColor()}20` }]}>
            <IconButton icon={achievement.icon} size={48} iconColor={getIconColor()} />
          </View>

          <Text style={styles.achievementTitle}>{achievement.title}</Text>

          <View style={styles.categoryContainer}>
            <IconButton icon={getCategoryIcon()} size={16} iconColor={getIconColor()} />
            <Text style={[styles.category, { color: getIconColor() }]}>{getCategoryLabel()}</Text>
          </View>

          <Text style={styles.description}>{achievement.description}</Text>

          <View style={styles.pointsContainer}>
            <IconButton icon="star" size={20} iconColor="#FFD700" />
            <Text style={styles.pointsValue}>{achievement.points} очков</Text>
          </View>

          {achievement.isUnlocked && achievement.earnedAt ? (
            <View style={styles.earnedContainer}>
              <IconButton icon="check-circle" size={20} iconColor="#4CAF50" />
              <Text style={styles.earnedText}>
                Разблокировано: {new Date(achievement.earnedAt).toLocaleDateString('ru-RU')}
              </Text>
            </View>
          ) : (
            <View style={styles.lockedContainer}>
              <IconButton icon="lock" size={20} iconColor={COLORS.textSecondary} />
              <Text style={styles.lockedText}>Еще не разблокировано</Text>
            </View>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    margin: 0,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    borderRadius: 40,
    padding: 16,
    marginBottom: 16,
  },
  achievementTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  description: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  pointsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9800',
    marginLeft: 4,
  },
  earnedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
  },
  earnedText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 4,
  },
  lockedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
    padding: 12,
    borderRadius: 8,
  },
  lockedText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginLeft: 4,
  },
});
