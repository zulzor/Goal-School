import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { COLORS } from '../constants';
import { AnimatedCard } from './AnimatedCard';

interface AchievementProgressBannerProps {
  unlocked: number;
  total: number;
  title?: string;
  onAchievementsPress?: () => void;
}

export const AchievementProgressBanner: React.FC<AchievementProgressBannerProps> = ({
  unlocked,
  total,
  title = 'Прогресс достижений',
  onAchievementsPress,
}) => {
  const progress = total > 0 ? unlocked / total : 0;
  const percentage = Math.round(progress * 100);

  return (
    <AnimatedCard animationType="fade" delay={300}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.achievementsLink} onPress={onAchievementsPress}>
            Все достижения
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <ProgressBar progress={progress} color={COLORS.primary} style={styles.progressBar} />
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              {unlocked}/{total} ({percentage}%)
            </Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{unlocked}</Text>
            <Text style={styles.statLabel}>Разблокировано</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{total - unlocked}</Text>
            <Text style={styles.statLabel}>Осталось</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{total}</Text>
            <Text style={styles.statLabel}>Всего</Text>
          </View>
        </View>
      </View>
    </AnimatedCard>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
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
  achievementsLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  progressText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
