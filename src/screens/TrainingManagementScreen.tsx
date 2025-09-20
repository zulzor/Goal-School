import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, Card, Title, Paragraph, TextInput, List } from 'react-native-paper';
import { useMySQLAuth } from '../context/MySQLAuthContext';

interface Training {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  coachId: string;
  maxParticipants: number;
  currentParticipants: string[];
  ageGroup: string;
  type: 'training' | 'match' | 'tournament';
}

interface CancelledTraining {
  id: string;
  training_id: string;
  cancelled_by: string;
  reason: string;
  cancelled_at: string;
  refund_policy_applied: boolean;
}

export default function TrainingManagementScreen() {
  const { user, isDatabaseAvailable } = useMySQLAuth();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [cancelledTrainings, setCancelledTrainings] = useState<CancelledTraining[]>([]);
  const [loading, setLoading] = useState(false);
  const [cancelRequest, setCancelRequest] = useState({
    training_id: '',
    reason: '',
  });

  // In a real implementation, these would be loaded from the API
  React.useEffect(() => {
    // Mock data
    const mockTrainings: Training[] = [
      {
        id: '1',
        title: 'Тренировка по футболу',
        description: 'Основы техники игры',
        date: new Date().toISOString(),
        startTime: '10:00',
        endTime: '12:00',
        location: 'Поле 1',
        coachId: '1',
        maxParticipants: 20,
        currentParticipants: ['1', '2', '3'],
        ageGroup: '8-10 лет',
        type: 'training',
      },
    ];

    const mockCancelledTrainings: CancelledTraining[] = [
      {
        id: '1',
        training_id: '2',
        cancelled_by: '1',
        reason: 'Погодные условия',
        cancelled_at: new Date().toISOString(),
        refund_policy_applied: true,
      },
    ];

    setTrainings(mockTrainings);
    setCancelledTrainings(mockCancelledTrainings);
  }, []);

  const handleCancelTraining = async () => {
    if (!cancelRequest.training_id || !cancelRequest.reason) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все обязательные поля');
      return;
    }

    try {
      // In a real implementation, this would send to the API
      const newCancelled: CancelledTraining = {
        id: (cancelledTrainings.length + 1).toString(),
        training_id: cancelRequest.training_id,
        cancelled_by: user?.id || '',
        reason: cancelRequest.reason,
        cancelled_at: new Date().toISOString(),
        refund_policy_applied: false,
      };

      setCancelledTrainings([...cancelledTrainings, newCancelled]);
      setCancelRequest({
        training_id: '',
        reason: '',
      });
      Alert.alert('Успех', 'Тренировка отменена');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось отменить тренировку');
    }
  };

  if (!isDatabaseAvailable) {
    return (
      <View style={styles.center}>
        <Text>Нет подключения к базе данных</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Управление тренировками</Title>
      
      {/* Training List */}
      <Title style={styles.title}>Запланированные тренировки</Title>
      {trainings.map((training) => (
        <Card key={training.id} style={styles.card}>
          <Card.Content>
            <Title>{training.title}</Title>
            <Paragraph>{training.description}</Paragraph>
            <Paragraph>Дата: {new Date(training.date).toLocaleDateString()}</Paragraph>
            <Paragraph>Время: {training.startTime} - {training.endTime}</Paragraph>
            <Paragraph>Место: {training.location}</Paragraph>
            <Paragraph>Возрастная группа: {training.ageGroup}</Paragraph>
            <Paragraph>Тип: {training.type}</Paragraph>
            <Paragraph>Участники: {training.currentParticipants.length}/{training.maxParticipants}</Paragraph>
          </Card.Content>
        </Card>
      ))}

      <Divider style={styles.divider} />

      {/* Cancel Training Form */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Отменить тренировку</Title>
          <TextInput
            label="ID тренировки *"
            value={cancelRequest.training_id}
            onChangeText={(text) => setCancelRequest({...cancelRequest, training_id: text})}
            style={styles.input}
          />
          <TextInput
            label="Причина отмены *"
            value={cancelRequest.reason}
            onChangeText={(text) => setCancelRequest({...cancelRequest, reason: text})}
            style={styles.input}
            multiline
            numberOfLines={3}
          />
          <Button 
            mode="contained" 
            onPress={handleCancelTraining}
            style={styles.button}
          >
            Отменить тренировку
          </Button>
        </Card.Content>
      </Card>

      <Divider style={styles.divider} />

      {/* Cancelled Trainings List */}
      <Title style={styles.title}>Отмененные тренировки</Title>
      {cancelledTrainings.map((cancelled) => (
        <Card key={cancelled.id} style={styles.card}>
          <Card.Content>
            <Title>Отмена #{cancelled.id}</Title>
            <Paragraph>Тренировка ID: {cancelled.training_id}</Paragraph>
            <Paragraph>Причина: {cancelled.reason}</Paragraph>
            <Paragraph>Отменена: {new Date(cancelled.cancelled_at).toLocaleString()}</Paragraph>
            <Paragraph>Политика возврата: {cancelled.refund_policy_applied ? 'Применена' : 'Не применена'}</Paragraph>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}

const Divider = ({ style }: { style?: any }) => (
  <View style={[styles.divider, style]} />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 16,
  },
  card: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
});