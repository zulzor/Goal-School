import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Avatar, IconButton } from 'react-native-paper';
import { COLORS } from '../constants';

interface Participant {
  id: string;
  name: string;
  age: number;
  skillLevel: number; // 1-5
  attendanceRate: number; // 0-100
  avatar?: string;
}

interface TrainingParticipantsProps {
  participants: Participant[];
  onParticipantPress?: (participant: Participant) => void;
  title?: string;
}

export const TrainingParticipants: React.FC<TrainingParticipantsProps> = ({
  participants,
  onParticipantPress,
  title = 'Участники тренировки',
}) => {
  const renderParticipantItem = ({ item }: { item: Participant }) => {
    // Определение цвета для уровня навыков
    const getSkillLevelColor = (level: number) => {
      if (level >= 4) return COLORS.success;
      if (level >= 3) return COLORS.warning;
      return COLORS.error;
    };

    // Определение цвета для посещаемости
    const getAttendanceColor = (rate: number) => {
      if (rate >= 80) return COLORS.success;
      if (rate >= 60) return COLORS.warning;
      return COLORS.error;
    };

    return (
      <Card
        style={styles.participantCard}
        onPress={() => onParticipantPress && onParticipantPress(item)}>
        <Card.Content style={styles.cardContent}>
          {item.avatar ? (
            <Avatar.Image source={{ uri: item.avatar }} size={48} />
          ) : (
            <Avatar.Text label={item.name.charAt(0)} size={48} />
          )}

          <View style={styles.infoContainer}>
            <Text style={styles.nameText}>{item.name}</Text>
            <Text style={styles.ageText}>{item.age} лет</Text>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Навыки:</Text>
                <View
                  style={[
                    styles.skillLevel,
                    { backgroundColor: getSkillLevelColor(item.skillLevel) },
                  ]}>
                  <Text style={styles.skillLevelText}>{item.skillLevel}/5</Text>
                </View>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Посещаемость:</Text>
                <Text
                  style={[
                    styles.attendanceText,
                    { color: getAttendanceColor(item.attendanceRate) },
                  ]}>
                  {item.attendanceRate}%
                </Text>
              </View>
            </View>
          </View>

          <IconButton
            icon="chevron-right"
            size={24}
            iconColor={COLORS.textSecondary}
            style={styles.arrowIcon}
          />
        </Card.Content>
      </Card>
    );
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>{title}</Title>

        {participants.length > 0 ? (
          <FlatList
            data={participants}
            renderItem={renderParticipantItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Участники не найдены</Text>
          </View>
        )}
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
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  participantCard: {
    marginBottom: 12,
    elevation: 1,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  ageText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginRight: 4,
  },
  skillLevel: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  skillLevelText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  attendanceText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  arrowIcon: {
    margin: 0,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});
