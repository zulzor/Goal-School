import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Card, Title } from 'react-native-paper';
import { COLORS } from '../constants';
import { useAuth, UserRole } from '../context/LocalStorageAuthContext';
import { UnderDevelopmentBanner } from './UnderDevelopmentBanner';

export const WebTestComponent: React.FC = () => {
  const { user } = useAuth();

  // Показываем заглушку для экрана в разработке
  if (user?.role === UserRole.MANAGER) {
    return (
      <UnderDevelopmentBanner
        title="Тест веб-платформы"
        description="Этот раздел находится в активной разработке. Функционал тестирования веб-платформы будет доступен в следующем обновлении."
      />
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Тест веб-платформы</Title>
          <Text style={styles.text}>
            Этот компонент используется для тестирования корректного отображения на веб-платформе.
          </Text>
          <Text style={styles.platformText}>Платформа: {Platform.OS}</Text>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    ...Platform.select({
      web: {
        height: '100%',
        overflow: 'hidden',
      },
    }),
  },
  card: {
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  title: {
    color: COLORS.primary,
    marginBottom: 12,
  },
  text: {
    color: COLORS.text,
    marginBottom: 8,
  },
  platformText: {
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
});
