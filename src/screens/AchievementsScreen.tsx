// src/screens/AchievementsScreen.tsx
// Экран для отображения достижений учеников

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useAuth } from '../context/LocalStorageAuthContext';
import { useMySQLAuth } from '../context/MySQLAuthContext';
import { useDatabase } from '../context/DatabaseContext';
import { Card, Title, Paragraph } from 'react-native-paper';
import { COLORS } from '../constants'; // Импортируем цвета Arsenal

export const AchievementsScreen: React.FC = () => {
  const { databaseType } = useDatabase();

  // Используем соответствующий контекст в зависимости от типа базы данных
  const localStorageAuth = useAuth();
  const mySQLAuth = useMySQLAuth();

  const { user } = databaseType === 'mysql' ? mySQLAuth : localStorageAuth;

  // Заглушка для достижений
  const achievements = [
    {
      id: '1',
      title: 'Первое посещение',
      description: 'Посетите первую тренировку',
      points: 10,
      earned: true,
    },
    {
      id: '2',
      title: 'Регулярность',
      description: 'Посетите 5 тренировок подряд',
      points: 50,
      earned: false,
    },
    {
      id: '3',
      title: 'Усердие',
      description: 'Посетите 10 тренировок',
      points: 100,
      earned: false,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Достижения</Title>
      <Paragraph style={styles.subtitle}>Ваши достижения и награды за активность в школе</Paragraph>

      {achievements.map(achievement => (
        <Card
          key={achievement.id}
          style={[
            styles.achievementCard,
            achievement.earned ? styles.earnedCard : styles.unearnedCard,
          ]}>
          <Card.Content>
            <Title style={achievement.earned ? styles.earnedTitle : styles.unearnedTitle}>
              {achievement.title}
            </Title>
            <Paragraph style={styles.description}>{achievement.description}</Paragraph>
            <Paragraph style={styles.points}>{achievement.points} очков</Paragraph>
            <Paragraph style={styles.status}>
              {achievement.earned ? 'Получено' : 'Не получено'}
            </Paragraph>
          </Card.Content>
        </Card>
      ))}

      <View style={styles.infoSection}>
        <Text style={styles.infoText}>
          Достижения начисляются автоматически за активность в школе.
        </Text>
        <Text style={styles.infoText}>Собирайте очки и получайте награды!</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.background, // Используем цвет Arsenal
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: COLORS.text, // Используем цвет Arsenal
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: COLORS.textSecondary, // Используем цвет Arsenal
  },
  achievementCard: {
    marginBottom: 16,
  },
  earnedCard: {
    backgroundColor: COLORS.surface, // Используем цвет Arsenal
  },
  unearnedCard: {
    backgroundColor: COLORS.surface, // Используем цвет Arsenal
  },
  earnedTitle: {
    color: COLORS.success, // Используем цвет Arsenal
  },
  unearnedTitle: {
    color: COLORS.error, // Используем цвет Arsenal
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
    color: COLORS.text, // Используем цвет Arsenal
  },
  points: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: COLORS.primary, // Используем цвет Arsenal
  },
  status: {
    fontSize: 14,
    fontStyle: 'italic',
    color: COLORS.textSecondary, // Используем цвет Arsenal
  },
  infoSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: COLORS.surface, // Используем цвет Arsenal
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border, // Используем цвет Arsenal
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
    color: COLORS.textSecondary, // Используем цвет Arsenal
  },
});

export default AchievementsScreen;
