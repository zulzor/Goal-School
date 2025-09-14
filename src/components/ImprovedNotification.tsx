// src/components/ImprovedNotification.tsx
// Улучшенная система уведомлений с анимациями

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { COLORS } from '../constants';
import { AppIcon } from './AppIcon';

export interface NotificationProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose?: (id: string) => void;
  onPress?: () => void;
  showIcon?: boolean;
  position?: 'top' | 'bottom';
  animated?: boolean;
}

export const ImprovedNotification: React.FC<NotificationProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
  onPress,
  showIcon = true,
  position = 'top',
  animated = true,
}) => {
  const translateY = useRef(new Animated.Value(position === 'top' ? -100 : 100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (animated) {
      // Анимация появления
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }

    // Автоматическое закрытие
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, animated]);

  const handleClose = () => {
    if (animated) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: position === 'top' ? -100 : 100,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onClose?.(id);
      });
    } else {
      onClose?.(id);
    }
  };

  const getIconName = () => {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'error':
        return 'alert-circle';
      case 'warning':
        return 'alert-triangle';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          background: '#10B981',
          text: '#FFFFFF',
          icon: '#FFFFFF',
        };
      case 'error':
        return {
          background: '#EF4444',
          text: '#FFFFFF',
          icon: '#FFFFFF',
        };
      case 'warning':
        return {
          background: '#F59E0B',
          text: '#FFFFFF',
          icon: '#FFFFFF',
        };
      case 'info':
        return {
          background: '#3B82F6',
          text: '#FFFFFF',
          icon: '#FFFFFF',
        };
      default:
        return {
          background: COLORS.primary,
          text: '#FFFFFF',
          icon: '#FFFFFF',
        };
    }
  };

  const colors = getColors();

  const animatedStyle = {
    transform: [
      { translateY },
      { scale },
    ],
    opacity,
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity
        style={[
          styles.notification,
          { backgroundColor: colors.background },
          position === 'top' && styles.topPosition,
          position === 'bottom' && styles.bottomPosition,
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.content}>
          {showIcon && (
            <View style={styles.iconContainer}>
              <AppIcon
                name={getIconName()}
                size={24}
                color={colors.icon}
              />
            </View>
          )}
          
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              {title}
            </Text>
            {message && (
              <Text style={[styles.message, { color: colors.text }]}>
                {message}
              </Text>
            )}
          </View>
          
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <AppIcon
              name="close"
              size={20}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  notification: {
    borderRadius: 12,
    padding: 16,
    elevation: 8,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  topPosition: {
    top: StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 16,
  },
  bottomPosition: {
    bottom: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    opacity: 0.9,
    lineHeight: 20,
  },
  closeButton: {
    marginLeft: 12,
    padding: 4,
  },
});

// Контейнер для уведомлений
export interface NotificationContainerProps {
  notifications: NotificationProps[];
  onClose: (id: string) => void;
  position?: 'top' | 'bottom';
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onClose,
  position = 'top',
}) => {
  return (
    <View style={styles.container}>
      {notifications.map((notification) => (
        <ImprovedNotification
          key={notification.id}
          {...notification}
          position={position}
          onClose={onClose}
        />
      ))}
    </View>
  );
};