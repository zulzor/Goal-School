import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Title, ProgressBar, Chip } from 'react-native-paper';
import { AnimatedCard } from './AnimatedCard';
import { COLORS } from '../constants'; // Добавляем импорт цветов

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  deadline: string;
  category: string;
  status: 'active' | 'completed' | 'overdue';
}

interface AnimatedGoalListProps {
  goals: Goal[];
  title?: string;
}

export const AnimatedGoalList: React.FC<AnimatedGoalListProps> = ({ goals, title = 'Цели' }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return COLORS.success; // Используем цвет Arsenal вместо хардкодного значения
      case 'overdue':
        return COLORS.error; // Используем цвет Arsenal вместо хардкодного значения
      default:
        return COLORS.primary; // Используем цвет Arsenal вместо хардкодного значения
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Завершено';
      case 'overdue':
        return 'Просрочено';
      default:
        return 'Активно';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      technical: COLORS.warning, // Используем цвет Arsenal вместо хардкодного значения
      physical: COLORS.accent, // Используем цвет Arsenal вместо хардкодного значения
      tactical: COLORS.info, // Используем цвет Arsenal вместо хардкодного значения
      mental: COLORS.error, // Используем цвет Arsenal вместо хардкодного значения
      social: COLORS.success, // Используем цвет Arsenal вместо хардкодного значения
    };
    return colors[category] || COLORS.textSecondary; // Используем цвет Arsenal вместо хардкодного значения
  };

  if (goals.length === 0) {
    return (
      <AnimatedCard animationType="fade" delay={0}>
        <Card style={styles.emptyCard}>
          <Card.Content>
            <Title style={styles.emptyTitle}>Нет целей</Title>
            <Text style={styles.emptyText}>У вас пока нет активных целей</Text>
          </Card.Content>
        </Card>
      </AnimatedCard>
    );
  }

  return (
    <View style={styles.container}>
      <AnimatedCard animationType="fade" delay={0}>
        <Title style={styles.title}>{title}</Title>
      </AnimatedCard>

      {goals.map((goal, index) => (
        <AnimatedCard
          key={goal.id}
          animationType="slide"
          delay={index * 100}
          style={styles.goalCard}>
          <Card>
            <Card.Content>
              <View style={styles.goalHeader}>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <Chip
                  style={[styles.statusChip, { backgroundColor: getStatusColor(goal.status) }]}
                  textStyle={styles.statusText}>
                  {getStatusText(goal.status)}
                </Chip>
              </View>

              <Text style={styles.goalDescription}>{goal.description}</Text>

              <View style={styles.progressContainer}>
                <ProgressBar
                  progress={goal.progress / 100}
                  color={getStatusColor(goal.status)}
                  style={styles.progressBar}
                />
                <Text style={styles.progressText}>{Math.round(goal.progress)}%</Text>
              </View>

              <View style={styles.footer}>
                <Chip
                  style={[
                    styles.categoryChip,
                    { backgroundColor: getCategoryColor(goal.category) },
                  ]}
                  textStyle={styles.categoryText}>
                  {goal.category}
                </Chip>
                <Text style={styles.deadline}>
                  До: {new Date(goal.deadline).toLocaleDateString('ru-RU')}
                </Text>
              </View>
            </Card.Content>
          </Card>
        </AnimatedCard>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
    color: COLORS.text, // Используем цвет Arsenal вместо хардкодного значения
  },
  emptyCard: {
    marginVertical: 8,
  },
  emptyTitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textSecondary, // Используем цвет Arsenal вместо хардкодного значения
    marginTop: 8,
  },
  goalCard: {
    marginBottom: 12,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
    color: COLORS.text, // Используем цвет Arsenal вместо хардкодного значения
  },
  statusChip: {
    height: 24,
  },
  statusText: {
    color: COLORS.surface, // Используем цвет Arsenal вместо хардкодного значения
    fontSize: 10,
  },
  goalDescription: {
    color: COLORS.textSecondary, // Используем цвет Arsenal вместо хардкодного значения
    marginBottom: 12,
    fontSize: 14,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    marginRight: 8,
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
    minWidth: 30,
    color: COLORS.text, // Используем цвет Arsenal вместо хардкодного значения
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryChip: {
    height: 24,
  },
  categoryText: {
    color: COLORS.surface, // Используем цвет Arsenal вместо хардкодного значения
    fontSize: 10,
  },
  deadline: {
    fontSize: 12,
    color: COLORS.textSecondary, // Используем цвет Arsenal вместо хардкодного значения
  },
});
