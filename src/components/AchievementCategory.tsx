import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { COLORS } from '../constants';

interface AchievementCategoryProps {
  category: 'training' | 'skill' | 'progress' | 'attendance' | 'special';
  count: number;
  label: string;
}

export const AchievementCategory: React.FC<AchievementCategoryProps> = ({
  category,
  count,
  label,
}) => {
  const getIcon = () => {
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

  const getColor = () => {
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

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: `${getColor()}20` }]}>
        <IconButton icon={getIcon()} size={20} iconColor={getColor()} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.count}>{count}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'white',
    margin: 4,
    minWidth: 100,
  },
  iconContainer: {
    borderRadius: 20,
    padding: 4,
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
  },
  count: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  label: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
