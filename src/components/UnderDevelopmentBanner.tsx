import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { COLORS } from '../constants';

interface UnderDevelopmentBannerProps {
  title?: string;
  description?: string;
  onBackPress?: () => void;
  showBackButton?: boolean;
}

export const UnderDevelopmentBanner: React.FC<UnderDevelopmentBannerProps> = ({
  title = 'Раздел в разработке',
  description = 'Этот раздел приложения находится в активной разработке. Пожалуйста, зайдите позже.',
  onBackPress,
  showBackButton = true,
}) => {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{title}</Title>
          <Paragraph style={styles.description}>{description}</Paragraph>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🚧</Text>
          </View>
          <Paragraph style={styles.note}>
            Мы работаем над улучшением этого раздела и добавлением новых функций.
          </Paragraph>
          {showBackButton && onBackPress && (
            <Button
              mode="contained"
              onPress={onBackPress}
              style={styles.button}
              buttonColor={COLORS.primary}>
              Назад
            </Button>
          )}
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    elevation: 4,
    borderRadius: 8,
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
    textAlign: 'center',
    color: COLORS.primary,
    marginBottom: 16,
  },
  description: {
    textAlign: 'center',
    marginBottom: 24,
    color: COLORS.textSecondary,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 48,
  },
  note: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 24,
    color: COLORS.textSecondary,
  },
  button: {
    marginTop: 8,
  },
});
