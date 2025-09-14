import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import { AnimatedCard } from './AnimatedCard';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  isImportant?: boolean;
}

interface AnimatedNotificationProps {
  notification: Notification;
  onDismiss: (id: string) => void;
  onPress?: (id: string) => void;
}

export const AnimatedNotification: React.FC<AnimatedNotificationProps> = ({
  notification,
  onDismiss,
  onPress,
}) => {
  const getIconAndColor = () => {
    if (notification.isImportant) {
      return { icon: 'alert-decagram', color: '#FF5722', backgroundColor: '#FFECE6' };
    }

    switch (notification.type) {
      case 'success':
        return { icon: 'check-circle', color: '#4CAF50', backgroundColor: '#E8F5E9' };
      case 'warning':
        return { icon: 'alert-circle', color: '#FF9800', backgroundColor: '#FFF3E0' };
      case 'error':
        return { icon: 'close-circle', color: '#F44336', backgroundColor: '#FFEBEE' };
      default:
        return { icon: 'information', color: '#2196F3', backgroundColor: '#E3F2FD' };
    }
  };

  const { icon, color, backgroundColor } = getIconAndColor();

  return (
    <AnimatedCard animationType="slide" delay={0}>
      <Card style={[styles.card, { borderLeftColor: color, borderLeftWidth: 4 }]}>
        <TouchableOpacity onPress={() => onPress && onPress(notification.id)} activeOpacity={0.8}>
          <Card.Content style={styles.content}>
            <View style={[styles.iconContainer, { backgroundColor }]}>
              <IconButton icon={icon} iconColor={color} size={24} />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.title, { color }]} numberOfLines={1}>
                {notification.title}
              </Text>
              <Text style={styles.message} numberOfLines={2}>
                {notification.message}
              </Text>
              <Text style={styles.timestamp}>
                {new Date(notification.timestamp).toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
            <IconButton
              icon="close"
              size={20}
              onPress={e => {
                e.stopPropagation(); // Останавливаем всплытие события
                onDismiss(notification.id); // Вызываем функцию удаления
              }}
              style={styles.dismissButton}
            />
          </Card.Content>
        </TouchableOpacity>
      </Card>
    </AnimatedCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 4,
    marginHorizontal: 8,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
    borderRadius: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    borderRadius: 20,
    padding: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  dismissButton: {
    margin: 0,
  },
});
