import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Platform } from 'react-native';
import { useNotifications } from '../context/NotificationContext';
import { AnimatedNotification } from './AnimatedNotification';
import { ImportantNewsBanner } from './ImportantNewsBanner';
import { AchievementNotification } from './AchievementNotification'; // Добавляем импорт

export const EnhancedNotificationsContainer: React.FC = () => {
  const { notifications, markAsRead, removeNotification } = useNotifications();
  const [animatedNotifications, setAnimatedNotifications] = useState<
    Array<{ id: string; animation: Animated.Value }>
  >([]);
  const notificationRefs = useRef<
    Map<string, { translateY: Animated.Value; opacity: Animated.Value }>
  >(new Map());
  const bannerAnimation = useRef(new Animated.Value(0)).current;

  // Отображаем только непрочитанные уведомления, но ограничиваем их количество
  const unreadNotifications = notifications.filter(notification => !notification.read).slice(0, 3); // Ограничиваем до 3 уведомлений для предотвращения наложения

  // Инициализируем анимации для уведомлений
  useEffect(() => {
    // Создаем или обновляем анимации для каждого уведомления
    unreadNotifications.forEach((notification, index) => {
      if (!notificationRefs.current.has(notification.id)) {
        const translateY = new Animated.Value(-100);
        const opacity = new Animated.Value(0);

        notificationRefs.current.set(notification.id, { translateY, opacity });

        // Анимируем появление
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            delay: index * 100,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 300,
            delay: index * 100,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start();
      }
    });

    // Удаляем анимации для уведомлений, которых больше нет
    const currentIds = new Set(unreadNotifications.map(n => n.id));
    for (const [id] of notificationRefs.current) {
      if (!currentIds.has(id)) {
        notificationRefs.current.delete(id);
      }
    }
  }, [unreadNotifications]);

  // Анимация для баннера важных новостей
  useEffect(() => {
    const importantNotification = unreadNotifications.find(n => n.isImportant);

    if (importantNotification) {
      // Анимируем появление баннера
      Animated.timing(bannerAnimation, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      // Анимируем исчезновение баннера
      Animated.timing(bannerAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [unreadNotifications, bannerAnimation]);

  const handleDismiss = (id: string) => {
    const notificationAnim = notificationRefs.current.get(id);

    if (notificationAnim) {
      // Анимируем исчезновение
      Animated.parallel([
        Animated.timing(notificationAnim.translateY, {
          toValue: -100,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(notificationAnim.opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // После завершения анимации удаляем уведомление
        removeNotification(id);
      });
    } else {
      removeNotification(id);
    }
  };

  // Получаем первое важное уведомление
  const importantNotification = unreadNotifications.find(n => n.isImportant);

  // Проверяем, является ли уведомление уведомлением о достижении
  const isAchievementNotification = (notification: any) => {
    return notification.title === 'Новое достижение!';
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Баннер для важных новостей */}
      {importantNotification && (
        <ImportantNewsBanner
          title={importantNotification.title}
          message={importantNotification.message}
          onDismiss={() => handleDismiss(importantNotification.id)}
          onPress={() => {
            markAsRead(importantNotification.id);
            // Здесь можно добавить навигацию к экрану новости
            console.log('Переход к важной новости:', importantNotification.id);
          }}
          animation={bannerAnimation}
        />
      )}

      {/* Обычные уведомления */}
      {unreadNotifications
        .filter(n => !n.isImportant)
        .map((notification, index) => {
          const anim = notificationRefs.current.get(notification.id);

          if (!anim) return null;

          const { translateY, opacity } = anim;

          // Проверяем, является ли это уведомление о достижении
          if (isAchievementNotification(notification)) {
            return (
              <Animated.View
                key={notification.id}
                style={[
                  styles.notificationWrapper,
                  {
                    transform: [{ translateY }],
                    opacity,
                    // Добавляем отступ сверху для каждого уведомления, чтобы они не перекрывали друг друга
                    top: index * 100 + (importantNotification ? 100 : 0), // Увеличиваем отступ для достижений
                  },
                ]}>
                <AchievementNotification
                  title={notification.title}
                  message={notification.message}
                  points={100} // В реальной реализации это будет браться из данных достижения
                  onDismiss={() => handleDismiss(notification.id)}
                  onPress={() => {
                    markAsRead(notification.id);
                    // Здесь можно добавить навигацию к экрану достижений
                    console.log('Переход к достижению:', notification.id);
                  }}
                />
              </Animated.View>
            );
          }

          return (
            <Animated.View
              key={notification.id}
              style={[
                styles.notificationWrapper,
                {
                  transform: [{ translateY }],
                  opacity,
                  // Добавляем отступ сверху для каждого уведомления, чтобы они не перекрывали друг друга
                  top: index * 70 + (importantNotification ? 100 : 0), // Учитываем высоту баннера
                },
              ]}>
              <AnimatedNotification
                notification={{
                  id: notification.id,
                  title: notification.title,
                  message: notification.message,
                  type: notification.type || 'info',
                  timestamp: notification.timestamp.toISOString(),
                  read: notification.read,
                  isImportant: notification.isImportant,
                }}
                onDismiss={handleDismiss}
                onPress={() => {
                  markAsRead(notification.id);
                  // Здесь можно добавить навигацию к экрану новости
                  console.log('Переход к новости:', notification.id);
                }}
              />
            </Animated.View>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60, // Отступ сверху, чтобы не перекрывать заголовок
    left: 0,
    right: 0,
    zIndex: 1000,
    pointerEvents: 'box-none', // Позволяет событиям проходить через контейнер
    ...Platform.select({
      web: {
        position: 'fixed', // Для веб-версии используем fixed позиционирование
      },
    }),
  },
  notificationWrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 1000,
    ...Platform.select({
      web: {
        maxWidth: 400, // Ограничиваем ширину на вебе
        left: '50%',
        transform: [{ translateX: '-50%' }], // Центрируем на вебе
      },
    }),
  },
});
