import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { useAuth } from '../context/LocalStorageAuthContext';
import { useMySQLAuth } from '../context/MySQLAuthContext';
import { useDatabase } from '../context/DatabaseContext';
import { useBranch } from '../context/BranchContext'; // Добавляем импорт контекста филиалов
import { ArsenalButton } from '../components/ArsenalButton';
import { COLORS } from '../constants'; // Импортируем цвета Arsenal

export const ProfileScreen: React.FC = () => {
  const { databaseType } = useDatabase();
  const { branches } = useBranch(); // Получаем филиалы из контекста

  // Используем соответствующий контекст в зависимости от типа базы данных
  const localStorageAuth = useAuth();
  const mySQLAuth = useMySQLAuth();

  const { user, logout } = databaseType === 'mysql' ? mySQLAuth : localStorageAuth;

  // Находим информацию о филиале пользователя
  const userBranch = user?.branchId ? branches.find(branch => branch.id === user.branchId) : null;

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
          onPress: async () => {
            try {
              await logout();
              // Дополнительные действия после выхода, если необходимо
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert(
                'Ошибка',
                'Не удалось выйти из аккаунта. Пожалуйста, попробуйте еще раз.'
              );
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Профиль пользователя</Title>

          {user ? (
            <>
              <Paragraph style={styles.info}>
                <Text style={styles.label}>Имя:</Text> {user.name}
              </Paragraph>
              <Paragraph style={styles.info}>
                <Text style={styles.label}>Email:</Text> {user.email}
              </Paragraph>
              <Paragraph style={styles.info}>
                <Text style={styles.label}>Роль:</Text> {user.role}
              </Paragraph>
              {userBranch && (
                <Card style={styles.branchInfoCard}>
                  <Card.Content>
                    <Title style={styles.branchTitle}>Информация о филиале</Title>
                    <Paragraph style={styles.branchInfo}>
                      <Text style={styles.label}>Название:</Text> {userBranch.name}
                    </Paragraph>
                    {userBranch.address && (
                      <Paragraph style={styles.branchInfo}>
                        <Text style={styles.label}>Адрес:</Text> {userBranch.address}
                      </Paragraph>
                    )}
                    {userBranch.phone && (
                      <Paragraph style={styles.branchInfo}>
                        <Text style={styles.label}>Телефон:</Text> {userBranch.phone}
                      </Paragraph>
                    )}
                    {userBranch.email && (
                      <Paragraph style={styles.branchInfo}>
                        <Text style={styles.label}>Email:</Text> {userBranch.email}
                      </Paragraph>
                    )}
                  </Card.Content>
                </Card>
              )}
              <Paragraph style={styles.info}>
                <Text style={styles.label}>Тип базы данных:</Text>{' '}
                {databaseType === 'mysql' ? 'MySQL' : 'Локальное хранилище'}
              </Paragraph>
            </>
          ) : (
            <Paragraph>Информация о пользователе недоступна</Paragraph>
          )}

          <View style={styles.buttonContainer}>
            <ArsenalButton
              title="Выйти из аккаунта"
              variant="primary"
              onPress={handleLogout}
              style={styles.logoutButton}
            />
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Настройки приложения</Title>
          <Paragraph>
            Здесь будут настройки приложения, такие как уведомления, тема и т.д.
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
          <Paragraph>
            Подробную информацию о том, как мы собираем, используем и защищаем ваши данные, вы
            можете найти в полной версии политики конфиденциальности на нашем сайте.
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
    backgroundColor: COLORS.background, // Используем цвет Arsenal
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
  },
  branchInfoCard: {
    backgroundColor: COLORS.surface,
    marginTop: 16,
  },
  branchTitle: {
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
  },
  branchInfo: {
    marginBottom: 8,
  },
});
