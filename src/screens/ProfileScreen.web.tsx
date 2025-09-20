import React from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants';

// Тестовые данные пользователя для веб-версии
const TEST_USER = {
  id: '1',
  name: 'Тестовый Пользователь',
  email: 'test@example.com',
  role: 'admin',
  branchId: 'main',
};

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert(
      'Подтверждение выхода',
      'Вы уверены, что хотите выйти из аккаунта?',
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Выйти',
          style: 'destructive',
          onPress: () => {
            // Вызываем глобальную функцию выхода
            if (typeof (window as any).handleLogout === 'function') {
              (window as any).handleLogout();
            } else {
              // Если глобальная функция недоступна, просто переходим на экран входа
              navigation.navigate('Login' as never);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Тестовые филиалы
  const branches = [
    { id: 'main', name: 'Основной филиал' },
    { id: 'branch1', name: 'Филиал 1' },
    { id: 'branch2', name: 'Филиал 2' },
  ];

  // Находим информацию о филиале пользователя
  const userBranch = branches.find(branch => branch.id === TEST_USER.branchId);

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Профиль пользователя</Title>

          <Paragraph style={styles.info}>
            <Text style={styles.label}>Имя:</Text> {TEST_USER.name}
          </Paragraph>
          <Paragraph style={styles.info}>
            <Text style={styles.label}>Email:</Text> {TEST_USER.email}
          </Paragraph>
          <Paragraph style={styles.info}>
            <Text style={styles.label}>Роль:</Text> {TEST_USER.role}
          </Paragraph>
          {userBranch && (
            <Paragraph style={styles.info}>
              <Text style={styles.label}>Филиал:</Text> {userBranch.name}
            </Paragraph>
          )}
          <Paragraph style={styles.info}>
            <Text style={styles.label}>Тип базы данных:</Text> Локальное хранилище (веб-версия)
          </Paragraph>

          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
              Выйти из аккаунта
            </Button>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Настройки приложения</Title>
          <Paragraph>
            В веб-версии приложения доступны основные функции мобильного приложения.
          </Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Политика конфиденциальности</Title>
          <Paragraph>
            Мы серьезно относимся к защите вашей конфиденциальности. Вся информация, которую вы
            предоставляете, будет использоваться только для работы приложения и не будет передана
            третьим лицам.
          </Paragraph>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.background,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  info: {
    marginBottom: 8,
    fontSize: 16,
  },
  label: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  logoutButton: {
    minWidth: 200,
    backgroundColor: COLORS.primary,
  },
});
