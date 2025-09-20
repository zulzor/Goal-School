import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNotifications } from '../context/NotificationContext';
import { COLORS } from '../constants';

interface NotificationBadgeProps {
  style?: any;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({ style }) => {
  const { getUnreadCount } = useNotifications();
  const unreadCount = getUnreadCount();

  if (unreadCount === 0) {
    return null;
  }

  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount.toString()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
