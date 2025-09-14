import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Searchbar, Button, IconButton } from 'react-native-paper';
import { COLORS } from '../constants';

interface AdminTraining {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  coach: string;
  participants: number;
  maxParticipants: number;
  ageGroup: string;
  type: 'training' | 'match';
}

interface AdminTrainingListProps {
  trainings: AdminTraining[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewParticipants: (id: string) => void;
  title?: string;
}

export const AdminTrainingList: React.FC<AdminTrainingListProps> = ({
  trainings,
  onEdit,
  onDelete,
  onViewParticipants,
  title = 'Тренировки',
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Фильтрация тренировок по поисковому запросу
  const filteredTrainings = trainings.filter(
    training =>
      training.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      training.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      training.coach.toLowerCase().includes(searchQuery.toLowerCase()) ||
      training.ageGroup.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Форматирование даты для отображения
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const renderTrainingItem = ({ item }: { item: AdminTraining }) => {
    // Определение цвета для типа тренировки
    const getTypeColor = (type: string) => {
      return type === 'match' ? COLORS.error : COLORS.primary;
    };

    // Проверка, заполнена ли тренировка
    const isFull = item.participants >= item.maxParticipants;

    return (
      <Card style={styles.trainingCard}>
        <Card.Content>
          <View style={styles.header}>
            <Title style={styles.title}>{item.title}</Title>
            <View style={[styles.typeBadge, { backgroundColor: getTypeColor(item.type) }]}>
              <Text style={styles.typeText}>
                {item.type === 'training' ? 'Тренировка' : 'Матч'}
              </Text>
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <IconButton icon="calendar" size={16} iconColor={COLORS.textSecondary} />
              <Text style={styles.detailText}>{formatDate(item.date)}</Text>
            </View>

            <View style={styles.detailRow}>
              <IconButton icon="clock-outline" size={16} iconColor={COLORS.textSecondary} />
              <Text style={styles.detailText}>
                {item.startTime} - {item.endTime}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <IconButton icon="map-marker-outline" size={16} iconColor={COLORS.textSecondary} />
              <Text style={styles.detailText}>{item.location}</Text>
            </View>

            <View style={styles.detailRow}>
              <IconButton icon="account-tie-outline" size={16} iconColor={COLORS.textSecondary} />
              <Text style={styles.detailText}>{item.coach}</Text>
            </View>

            <View style={styles.detailRow}>
              <IconButton icon="account-group-outline" size={16} iconColor={COLORS.textSecondary} />
              <Text style={[styles.detailText, isFull && styles.fullText]}>
                {item.participants}/{item.maxParticipants} участников
              </Text>
            </View>

            <View style={styles.detailRow}>
              <IconButton icon="account-child-outline" size={16} iconColor={COLORS.textSecondary} />
              <Text style={styles.detailText}>{item.ageGroup}</Text>
            </View>
          </View>

          <View style={styles.actionsContainer}>
            <Button
              mode="outlined"
              onPress={() => onViewParticipants(item.id)}
              style={styles.actionButton}
              icon="account-group">
              Участники
            </Button>

            <Button
              mode="outlined"
              onPress={() => onEdit(item.id)}
              style={styles.actionButton}
              icon="pencil">
              Редактировать
            </Button>

            <IconButton
              icon="delete"
              size={24}
              iconColor={COLORS.error}
              onPress={() => onDelete(item.id)}
              style={styles.deleteButton}
            />
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>{title}</Title>

        <Searchbar
          placeholder="Поиск тренировок..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        {filteredTrainings.length > 0 ? (
          <FlatList
            data={filteredTrainings}
            renderItem={renderTrainingItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Тренировки не найдены</Text>
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
  },
  searchbar: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  trainingCard: {
    marginBottom: 16,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  typeBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  typeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  fullText: {
    color: COLORS.error,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
    minWidth: 80,
  },
  deleteButton: {
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
