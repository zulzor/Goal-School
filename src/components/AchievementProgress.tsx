import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar, Card } from 'react-native-paper';
import { COLORS } from '../constants';

interface AchievementProgressProps {
  unlocked: number;
  total: number;
  title?: string;
}

export const AchievementProgress: React.FC<AchievementProgressProps> = ({
  unlocked,
  total,
  title = 'Прогресс достижений',
}) => {
  const progress = total > 0 ? unlocked / total : 0;
  const percentage = Math.round(progress * 100);

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.progressContainer}>
          <ProgressBar progress={progress} color={COLORS.primary} style={styles.progressBar} />
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              {unlocked}/{total} ({percentage}%)
            </Text>
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
  progressContainer: {
    flexDirection: 'column',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginBottom: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});
