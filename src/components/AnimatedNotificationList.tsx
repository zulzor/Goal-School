import React, { memo } from 'react';
import { View, Text, StyleSheet, FlatList, Platform } from 'react-native';
import { Card, Title, Button } from 'react-native-paper';
import { AnimatedNotification } from './AnimatedNotification';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  isImportant?: boolean;
}

// Мемоизированный компонент для отдельного уведомления
const NotificationItem = memo(
  ({
    notification,
    onDismiss,
    onPress,
  }: {
    notification: Notification;
    onDismiss: (id: string) => void;
    onPress?: (id: string) => void;
  }) => <AnimatedNotification notification={notification} onDismiss={onDismiss} onPress={onPress} />
);

interface AnimatedNotificationListProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  onDismissAll: () => void;
  onPress?: (id: string) => void;
  title?: string;
}

export const AnimatedNotificationList: React.FC<AnimatedNotificationListProps> = ({
  notifications,
  onDismiss,
  onDismissAll,
  onPress,
  title = 'Уведомления',
}) => {
  if (notifications.length === 0) {
    return (
      <Card style={styles.emptyCard}>
        <Card.Content style={styles.emptyContent}>
          <Title style={styles.emptyTitle}>Нет уведомлений</Title>
          <Text style={styles.emptyText}>У вас пока нет новых уведомлений</Text>
        </Card.Content>
      </Card>
    );
  }

  // Функция для рендеринга отдельного уведомления
  const renderItem = ({ item }: { item: Notification }) => (
    <NotificationItem notification={item} onDismiss={onDismiss} onPress={onPress} />
  );

  // Функция для извлечения ключа элемента
  const keyExtractor = (item: Notification) => item.id;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>{title}</Title>
        {notifications.length > 0 && (
          <Button mode="text" onPress={onDismissAll} style={styles.clearButton}>
            Очистить все
          </Button>
        )}
      </View>

      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={21}
        removeClippedSubviews={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearButton: {
    padding: 0,
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyCard: {
    margin: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  emptyContent: {
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
  },
});
