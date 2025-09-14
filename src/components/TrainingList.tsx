import React from 'react';
import { View, StyleSheet, FlatList, Text, Platform } from 'react-native';
import { Card, Title, Paragraph, Button, IconButton } from 'react-native-paper';
import { COLORS, SIZES } from '../constants';

interface Training {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  coachId: string;
  coachName: string;
  maxParticipants: number;
  currentParticipants: string[];
  ageGroup: string;
  type: 'training' | 'match' | 'tournament';
}

interface TrainingListProps {
  trainings: Training[];
  onRegister: (trainingId: string) => void;
  onManage?: (trainingId: string) => void;
  userRole?: string;
  userId?: string;
}

export const TrainingList: React.FC<TrainingListProps> = ({
  trainings,
  onRegister,
  onManage,
  userRole,
  userId,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isUserRegistered = (training: Training) => {
    return userId && training.currentParticipants.includes(userId);
  };

  const canRegister = (training: Training) => {
    if (!userId) {
      return false;
    }
    if (isUserRegistered(training)) {
      return false;
    }
    if (training.currentParticipants.length >= training.maxParticipants) {
      return false;
    }
    return true;
  };

  const canManageTraining = () => {
    return userRole && (userRole === 'COACH' || userRole === 'MANAGER');
  };

  const renderTrainingItem = ({ item }: { item: Training }) => (
    <Card style={styles.trainingCard}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title style={styles.trainingTitle}>{item.title}</Title>
          <View style={styles.typeBadge}>
            <Paragraph style={styles.typeText}>
              {item.type === 'training' ? 'Тренировка' : 'Матч'}
            </Paragraph>
          </View>
        </View>
        <Paragraph style={styles.trainingDescription}>{item.description}</Paragraph>
        <View style={styles.trainingDetails}>
          <View style={styles.detailRow}>
            <IconButton icon="clock-outline" size={16} iconColor={COLORS.textSecondary} />
            <Paragraph>
              {item.startTime} - {item.endTime}
            </Paragraph>
          </View>
          <View style={styles.detailRow}>
            <IconButton icon="map-marker-outline" size={16} iconColor={COLORS.textSecondary} />
            <Paragraph>{item.location}</Paragraph>
          </View>
          <View style={styles.detailRow}>
            <IconButton icon="account-group-outline" size={16} iconColor={COLORS.textSecondary} />
            <Paragraph>
              {item.currentParticipants.length}/{item.maxParticipants} участников
            </Paragraph>
          </View>
          <View style={styles.detailRow}>
            <IconButton icon="account-tie-outline" size={16} iconColor={COLORS.textSecondary} />
            <Paragraph>{item.coachName}</Paragraph>
          </View>
          <View style={styles.detailRow}>
            <IconButton icon="account-child-outline" size={16} iconColor={COLORS.textSecondary} />
            <Paragraph>{item.ageGroup}</Paragraph>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          {userId && (
            <>
              {isUserRegistered(item) ? (
                <Button mode="outlined" disabled style={styles.registeredButton}>
                  Зарегистрирован
                </Button>
              ) : canRegister(item) ? (
                <Button
                  mode="contained"
                  onPress={() => onRegister(item.id)}
                  style={styles.registerButton}>
                  Зарегистрироваться
                </Button>
              ) : (
                <Button mode="outlined" disabled style={styles.fullButton}>
                  Мест нет
                </Button>
              )}
            </>
          )}
          {canManageTraining() && onManage && (
            <Button mode="text" onPress={() => onManage(item.id)} style={styles.manageButton}>
              Управление
            </Button>
          )}
        </View>
      </Card.Content>
    </Card>
  );

  const keyExtractor = (item: Training) => item.id;

  return (
    <FlatList
      data={trainings}
      renderItem={renderTrainingItem}
      keyExtractor={keyExtractor}
      style={styles.list}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Тренировки не найдены</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  trainingCard: {
    marginBottom: 12,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  trainingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  typeBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  typeText: {
    color: COLORS.surface, // Используем цвет Arsenal вместо хардкодного значения
    fontSize: 12,
    fontWeight: 'bold',
  },
  trainingDescription: {
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  trainingDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  registeredButton: {
    borderColor: COLORS.success,
    marginBottom: 8,
  },
  registerButton: {
    flex: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  fullButton: {
    flex: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  manageButton: {
    marginLeft: 8,
    marginBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});
