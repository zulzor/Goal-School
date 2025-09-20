import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, IconButton, Paragraph } from 'react-native-paper';
import { COLORS } from '../constants';

interface TrainingEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
}

interface TrainingCalendarProps {
  events: TrainingEvent[];
  onDateSelect?: (date: string) => void;
  title?: string;
}

export const TrainingCalendar: React.FC<TrainingCalendarProps> = ({
  events,
  onDateSelect,
  title = 'Расписание тренировок',
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Группировка событий по датам
  const groupedEvents = events.reduce((acc: Record<string, TrainingEvent[]>, event) => {
    if (!acc[event.date]) {
      acc[event.date] = [];
    }
    acc[event.date].push(event);
    return acc;
  }, {});

  // Получение событий для выбранной даты
  const selectedEvents = groupedEvents[selectedDate] || [];

  // Форматирование даты для отображения
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Переход к предыдущему дню
  const goToPreviousDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    setSelectedDate(date.toISOString().split('T')[0]);
    onDateSelect && onDateSelect(date.toISOString().split('T')[0]);
  };

  // Переход к следующему дню
  const goToNextDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    setSelectedDate(date.toISOString().split('T')[0]);
    onDateSelect && onDateSelect(date.toISOString().split('T')[0]);
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>{title}</Title>

        <View style={styles.dateHeader}>
          <IconButton icon="chevron-left" onPress={goToPreviousDay} />
          <Paragraph style={styles.dateText}>{formatDate(selectedDate)}</Paragraph>
          <IconButton icon="chevron-right" onPress={goToNextDay} />
        </View>

        {selectedEvents.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>На выбранную дату тренировок нет</Text>
          </View>
        ) : (
          <ScrollView style={styles.eventsContainer}>
            {selectedEvents.map(event => (
              <Card key={event.id} style={styles.eventCard}>
                <Card.Content>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <View style={styles.eventDetails}>
                    <Text style={styles.eventTime}>
                      🕐 {event.startTime} - {event.endTime}
                    </Text>
                    <Text style={styles.eventLocation}>📍 {event.location}</Text>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </ScrollView>
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
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  eventsContainer: {
    maxHeight: 300,
  },
  eventCard: {
    marginBottom: 12,
    elevation: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventTime: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  eventLocation: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
