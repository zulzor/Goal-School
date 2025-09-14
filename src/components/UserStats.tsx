import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { AnimatedCard } from './AnimatedCard';
import { COLORS } from '../constants';

interface StatItem {
  label: string;
  value: string;
  icon?: string;
  color?: string; // Добавляем возможность задавать цвет
}

interface UserStatsProps {
  stats: StatItem[];
  title?: string;
}

export const UserStats: React.FC<UserStatsProps> = ({ stats, title = 'Статистика' }) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <AnimatedCard key={index} animationType="scale" delay={index * 100}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, stat.color ? { color: stat.color } : {}]}>
                  {stat.value}
                </Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            </AnimatedCard>
          ))}
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
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
    minWidth: 80,
    margin: 8,
  },
  statValue: {
    fontSize: 24,
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
