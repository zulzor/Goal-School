import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Text } from 'react-native-paper';
import { COLORS, SIZES } from '../constants';
import { useNotifications } from '../context/NotificationContext';
import { useAuth, UserRole } from '../context/LocalStorageAuthContext';
import { UnderDevelopmentBanner } from '../components/UnderDevelopmentBanner';

export const TestNotificationsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const {
    notifications,
    addNotification,
    markAsRead,
    removeNotification,
    clearAllNotifications,
    markAllAsRead,
    getUnreadCount,
  } = useNotifications();

  const { user } = useAuth();

  // Показываем заглушку для экрана в разработке
  if (user?.role === UserRole.MANAGER) {
    return (
      <UnderDevelopmentBanner
        title="Тест уведомлений"
        description="Этот раздел находится в активной разработке. Функционал тестирования уведомлений будет доступен в следующем обновлении."
        onBackPress={() => navigation.goBack()}
      />
    );
  }

  const handleAddInfoNotification = () => {
    addNotification({
      title: 'Информация',
      message: 'Это информационное уведомление',
      isImportant: false,
      type: 'info',
    });
  };

  const handleAddSuccessNotification = () => {
    addNotification({
      title: 'Успех',
      message: 'Операция выполнена успешно',
      isImportant: false,
      type: 'success',
    });
  };

  const handleAddWarningNotification = () => {
    addNotification({
      title: 'Предупреждение',
      message: 'Обратите внимание на это сообщение',
      isImportant: false,
      type: 'warning',
    });
  };

  const handleAddErrorNotification = () => {
    addNotification({
      title: 'Ошибка',
      message: 'Произошла ошибка при выполнении операции',
      isImportant: false,
      type: 'error',
    });
  };

  const handleAddImportantNotification = () => {
    addNotification({
      title: 'Важное уведомление',
      message: 'Это важное уведомление, требующее вашего внимания',
      isImportant: true,
      type: 'warning',
    });
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    Alert.alert('Успех', 'Все уведомления отмечены как прочитанные');
  };

  const handleClearAll = () => {
    clearAllNotifications();
    Alert.alert('Успех', 'Все уведомления удалены');
  };

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
    Alert.alert('Успех', 'Уведомление отмечено как прочитанное');
  };

  const handleRemoveNotification = (id: string) => {
    removeNotification(id);
    Alert.alert('Успех', 'Уведомление удалено');
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title style={styles.title}>Тестирование уведомлений</Title>
          <Paragraph style={styles.description}>
            Экран для тестирования функционала системы уведомлений
          </Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Добавить уведомление</Title>
          <View style={styles.grid}>
            <Button mode="outlined" onPress={handleAddInfoNotification} style={styles.button}>
              Информация
            </Button>
            <Button
              mode="outlined"
              onPress={handleAddSuccessNotification}
              style={[styles.button, styles.successButton]}>
              Успех
            </Button>
            <Button
              mode="outlined"
              onPress={handleAddWarningNotification}
              style={[styles.button, styles.warningButton]}>
              Предупреждение
            </Button>
            <Button
              mode="outlined"
              onPress={handleAddErrorNotification}
              style={[styles.button, styles.errorButton]}>
              Ошибка
            </Button>
            <Button
              mode="contained"
              onPress={handleAddImportantNotification}
              style={[styles.button, styles.importantButton]}>
              Важное
            </Button>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Управление уведомлениями</Title>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{notifications.length}</Text>
              <Text style={styles.statLabel}>Всего</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{getUnreadCount()}</Text>
              <Text style={styles.statLabel}>Непрочитанных</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {notifications.filter(n => n.isImportant).length}
              </Text>
              <Text style={styles.statLabel}>Важных</Text>
            </View>
          </View>
          <View style={styles.buttonRow}>
            <Button mode="outlined" onPress={handleMarkAllAsRead} style={styles.actionButton}>
              Отметить все как прочитанные
            </Button>
            <Button
              mode="outlined"
              onPress={handleClearAll}
              textColor={COLORS.error}
              style={styles.actionButton}>
              Очистить все
            </Button>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Список уведомлений</Title>
          {notifications.length === 0 ? (
            <Paragraph style={styles.emptyText}>Нет уведомлений</Paragraph>
          ) : (
            notifications.map(notification => (
              <Card key={notification.id} style={styles.notificationCard}>
                <Card.Content>
                  <View style={styles.notificationHeader}>
                    <Title
                      style={[
                        styles.notificationTitle,
                        notification.isImportant && styles.importantTitle,
                      ]}>
                      {notification.title}
                    </Title>
                    {!notification.read && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>Новое</Text>
                      </View>
                    )}
                  </View>
                  <Paragraph style={styles.notificationMessage}>{notification.message}</Paragraph>
                  <View style={styles.notificationMeta}>
                    <Text style={styles.timestamp}>
                      {new Date(notification.timestamp).toLocaleString('ru-RU')}
                    </Text>
                    {notification.isImportant && <Text style={styles.importantTag}>Важное</Text>}
                  </View>
                  <View style={styles.notificationActions}>
                    {!notification.read && (
                      <Button
                        mode="text"
                        onPress={() => handleMarkAsRead(notification.id)}
                        style={styles.actionButtonSmall}>
                        Прочитано
                      </Button>
                    )}
                    <Button
                      mode="text"
                      onPress={() => handleRemoveNotification(notification.id)}
                      textColor={COLORS.error}
                      style={styles.actionButtonSmall}>
                      Удалить
                    </Button>
                  </View>
                </Card.Content>
              </Card>
            ))
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerCard: {
    margin: SIZES.padding,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: COLORS.textSecondary,
  },
  sectionCard: {
    margin: SIZES.padding,
    marginBottom: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    minWidth: 120,
    margin: 4,
  },
  successButton: {
    borderColor: COLORS.success,
  },
  warningButton: {
    borderColor: COLORS.warning,
  },
  errorButton: {
    borderColor: COLORS.error,
  },
  importantButton: {
    backgroundColor: COLORS.error,
    minWidth: '100%',
    marginVertical: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  notificationCard: {
    marginBottom: 12,
    elevation: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  importantTitle: {
    color: COLORS.error,
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  notificationMessage: {
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  notificationMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  importantTag: {
    fontSize: 12,
    color: COLORS.error,
    fontWeight: 'bold',
  },
  notificationActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButtonSmall: {
    minWidth: 100,
  },
});
