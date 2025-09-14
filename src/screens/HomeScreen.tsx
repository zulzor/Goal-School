import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { useAuth } from '../context/LocalStorageAuthContext';
import { useMySQLAuth } from '../context/MySQLAuthContext';
import { useDatabase } from '../context/DatabaseContext';
import { ArsenalButton } from '../components/ArsenalButton';
import { useNavigation } from '@react-navigation/native';
import { AnimatedCard } from '../components/AnimatedCard';
import { COLORS } from '../constants'; // Используем COLORS вместо ARSENAL_COLORS

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { databaseType, isMySQLAvailable } = useDatabase();

  // Используем соответствующий контекст в зависимости от типа базы данных
  const localStorageAuth = useAuth();
  const mySQLAuth = useMySQLAuth();

  const { user } = databaseType === 'mysql' ? mySQLAuth : localStorageAuth;

  // Определяем приветствие в зависимости от роли пользователя
  const getGreeting = () => {
    if (!user) {
      return 'Добро пожаловать!';
    }

    switch (user.role) {
      case 'admin':
        return `Добро пожаловать, администратор ${user.name}!`;
      case 'manager':
        return `Добро пожаловать, менеджер ${user.name}!`;
      case 'coach':
        return `Добро пожаловать, тренер ${user.name}!`;
      case 'parent':
        return `Добро пожаловать, ${user.name}!`;
      case 'student':
        return `Добро пожаловать, ученик ${user.name}!`;
      default:
        return `Добро пожаловать, ${user.name}!`;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <AnimatedCard animationType="fade" delay={0}>
        <Card style={styles.welcomeCard}>
          <Card.Content>
            <Title style={styles.welcomeTitle}>{getGreeting()}</Title>
            <Paragraph style={styles.welcomeText}>
              Добро пожаловать в приложение футбольной школы Goal School!
            </Paragraph>

            {databaseType === 'mysql' ? (
              <Paragraph style={styles.dbInfo}>
                <Text style={styles.dbLabel}>Тип базы данных:</Text> MySQL
                {!isMySQLAvailable && (
                  <Text style={styles.dbWarning}>
                    {' '}
                    (недоступен, используется локальное хранилище)
                  </Text>
                )}
              </Paragraph>
            ) : (
              <Paragraph style={styles.dbInfo}>
                <Text style={styles.dbLabel}>Тип базы данных:</Text> Локальное хранилище
              </Paragraph>
            )}
          </Card.Content>
        </Card>
      </AnimatedCard>

      <AnimatedCard animationType="slide" delay={200}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Новости</Title>
            <Paragraph>Последние новости и объявления футбольной школы.</Paragraph>
            <ArsenalButton
              title="Перейти к новостям"
              variant="primary"
              onPress={() => navigation.navigate('News' as never)}
              style={styles.button}
            />
          </Card.Content>
        </Card>
      </AnimatedCard>

      <AnimatedCard animationType="slide" delay={400}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Расписание</Title>
            <Paragraph>Просмотр расписания тренировок и мероприятий.</Paragraph>
            <ArsenalButton
              title="Посмотреть расписание"
              variant="primary"
              onPress={() => navigation.navigate('Schedule' as never)}
              style={styles.button}
            />
          </Card.Content>
        </Card>
      </AnimatedCard>

      <AnimatedCard animationType="slide" delay={600}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Питание</Title>
            <Paragraph>Рекомендации по питанию для футболистов.</Paragraph>
            <ArsenalButton
              title="План питания"
              variant="primary"
              onPress={() => navigation.navigate('Nutrition' as never)}
              style={styles.button}
            />
          </Card.Content>
        </Card>
      </AnimatedCard>

      {user?.role === 'student' && (
        <AnimatedCard animationType="slide" delay={800}>
          <Card style={styles.card}>
            <Card.Content>
              <Title>Мой профиль</Title>
              <Paragraph>Просмотр и редактирование вашего профиля.</Paragraph>
              <ArsenalButton
                title="Перейти в профиль"
                variant="primary"
                onPress={() => navigation.navigate('Profile' as never)}
                style={styles.button}
              />
            </Card.Content>
          </Card>
        </AnimatedCard>
      )}

      {(user?.role === 'coach' || user?.role === 'parent') && (
        <AnimatedCard animationType="slide" delay={800}>
          <Card style={styles.card}>
            <Card.Content>
              <Title>Прогресс учеников</Title>
              <Paragraph>Отслеживание прогресса учеников.</Paragraph>
              <ArsenalButton
                title="Просмотр прогресса"
                variant="primary"
                onPress={() => navigation.navigate('Students' as never)}
                style={styles.button}
              />
            </Card.Content>
          </Card>
        </AnimatedCard>
      )}

      {(user?.role === 'manager' || user?.role === 'admin') && (
        <>
          <AnimatedCard animationType="slide" delay={800}>
            <Card style={styles.card}>
              <Card.Content>
                <Title>Админ-панель</Title>
                <Paragraph>Управление приложением и пользователями.</Paragraph>
                <ArsenalButton
                  title="Перейти в админ-панель"
                  variant="primary"
                  onPress={() => navigation.navigate('Admin' as never)}
                  style={styles.button}
                />
              </Card.Content>
            </Card>
          </AnimatedCard>

          <AnimatedCard animationType="slide" delay={1000}>
            <Card style={styles.card}>
              <Card.Content>
                <Title>Аналитика</Title>
                <Paragraph>Просмотр статистики и аналитических данных.</Paragraph>
                <ArsenalButton
                  title="Перейти к аналитике"
                  variant="primary"
                  onPress={() => navigation.navigate('Analytics' as never)}
                  style={styles.button}
                />
              </Card.Content>
            </Card>
          </AnimatedCard>

          <AnimatedCard animationType="slide" delay={1200}>
            <Card style={styles.card}>
              <Card.Content>
                <Title>Управление новостями</Title>
                <Paragraph>Создание и публикация новостей для футбольной школы.</Paragraph>
                <ArsenalButton
                  title="Перейти к управлению новостями"
                  variant="primary"
                  onPress={() => navigation.navigate('SMManager' as never)}
                  style={styles.button}
                />
              </Card.Content>
            </Card>
          </AnimatedCard>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.background, // Используем COLORS.background вместо ARSENAL_COLORS.background
  },
  welcomeCard: {
    marginBottom: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  welcomeTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeText: {
    textAlign: 'center',
    marginBottom: 16,
  },
  dbInfo: {
    textAlign: 'center',
    padding: 8,
    backgroundColor: COLORS.surface, // Используем COLORS.surface вместо ARSENAL_COLORS.blueTransparent
    borderRadius: 4,
  },
  dbLabel: {
    fontWeight: 'bold',
  },
  dbWarning: {
    color: COLORS.warning, // Используем COLORS.warning вместо ARSENAL_COLORS.warning
  },
  card: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
});
