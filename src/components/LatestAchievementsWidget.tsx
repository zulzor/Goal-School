import React from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import { Card, Title, useTheme, TouchableRipple } from 'react-native-paper';
import { Achievement } from '../types';
import { MaterialIcons } from '@expo/vector-icons';

interface LatestAchievementsWidgetProps {
  achievements: Achievement[];
  onAchievementPress: (achievement: Achievement) => void;
  onSeeAllPress: () => void;
}

export const LatestAchievementsWidget: React.FC<LatestAchievementsWidgetProps> = ({
  achievements,
  onAchievementPress,
  onSeeAllPress,
}) => {
  const theme = useTheme();

  // Получаем последние 3 разблокированных достижения
  const latestUnlocked = achievements
    .filter(a => a.isUnlocked)
    .sort((a, b) => {
      const dateA = a.earnedAt ? new Date(a.earnedAt).getTime() : 0;
      const dateB = b.earnedAt ? new Date(b.earnedAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 3);

  const renderAchievement = ({ item }: { item: Achievement }) => (
    <TouchableRipple onPress={() => onAchievementPress(item)}>
      <View style={styles.achievementItem}>
        <MaterialIcons name={item.icon as any} size={24} color={theme.colors.primary} />
        <View style={styles.achievementContent}>
          <Text style={styles.achievementTitle}>{item.title}</Text>
          <Text style={styles.achievementPoints} numberOfLines={1}>
            +{item.points} очков
          </Text>
        </View>
      </View>
    </TouchableRipple>
  );

  if (latestUnlocked.length === 0) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Title style={styles.title}>Последние достижения</Title>
            <TouchableRipple onPress={onSeeAllPress}>
              <Text style={styles.seeAll}>Все</Text>
            </TouchableRipple>
          </View>
          <View style={styles.emptyState}>
            <MaterialIcons name="emoji-events" size={48} color="#999" />
            <Text style={styles.emptyText}>Пока нет достижений</Text>
            <Text style={styles.emptySubtext}>Продолжайте тренироваться!</Text>
          </View>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Title style={styles.title}>Последние достижения</Title>
          <TouchableRipple onPress={onSeeAllPress}>
            <Text style={styles.seeAll}>Все</Text>
          </TouchableRipple>
        </View>
        <FlatList
          data={latestUnlocked}
          renderItem={renderAchievement}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    color: '#1E90FF',
    fontWeight: '600',
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
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  achievementContent: {
    flex: 1,
    marginLeft: 16,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  achievementPoints: {
    fontSize: 14,
    color: '#666',
  },
});
