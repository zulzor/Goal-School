import React from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import { Card, Title, useTheme } from 'react-native-paper';
import { Achievement } from '../types';
import { MaterialIcons } from '@expo/vector-icons';

interface StudentAwardsProps {
  achievements: Achievement[];
  studentId: string;
}

export const StudentAwards: React.FC<StudentAwardsProps> = ({ achievements, studentId }) => {
  const theme = useTheme();

  // Получаем разблокированные достижения
  const unlockedAchievements = achievements.filter(a => a.isUnlocked);

  // Сортируем по дате получения (новые первыми)
  const sortedAchievements = unlockedAchievements.sort((a, b) => {
    const dateA = a.earnedAt ? new Date(a.earnedAt).getTime() : 0;
    const dateB = b.earnedAt ? new Date(b.earnedAt).getTime() : 0;
    return dateB - dateA;
  });

  const renderAward = ({ item }: { item: Achievement }) => (
    <View style={styles.awardItem}>
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
        <MaterialIcons name={item.icon as any} size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.awardContent}>
        <Text style={styles.awardTitle}>{item.title}</Text>
        <Text style={styles.awardDescription}>{item.description}</Text>
        <View style={styles.awardFooter}>
          <Text style={styles.awardPoints}>+{item.points} очков</Text>
          {item.earnedAt && (
            <Text style={styles.awardDate}>
              {new Date(item.earnedAt).toLocaleDateString('ru-RU')}
            </Text>
          )}
        </View>
      </View>
    </View>
  );

  if (unlockedAchievements.length === 0) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Награды</Title>
          <View style={styles.emptyState}>
            <MaterialIcons name="emoji-events" size={48} color="#999" />
            <Text style={styles.emptyText}>Пока нет наград</Text>
            <Text style={styles.emptySubtext}>
              Продолжайте тренироваться, чтобы получить награды!
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>Награды</Title>
        <FlatList
          data={sortedAchievements}
          renderItem={renderAward}
          keyExtractor={item => item.id}
          scrollEnabled={false}
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
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    color: '#666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
  awardItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  awardContent: {
    flex: 1,
  },
  awardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  awardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  awardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  awardPoints: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E90FF',
  },
  awardDate: {
    fontSize: 12,
    color: '#999',
  },
});
