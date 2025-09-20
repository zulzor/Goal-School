import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { COLORS } from '../constants';

interface DevelopmentNoticeBannerProps {
  title: string;
  description: string;
  onAction?: () => void;
  actionLabel?: string;
}

export const DevelopmentNoticeBanner: React.FC<DevelopmentNoticeBannerProps> = ({
  title,
  description,
  onAction,
  actionLabel = 'Подробнее',
}) => {
  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🚧</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        {onAction && (
          <Button
            mode="outlined"
            onPress={onAction}
            style={styles.button}
            textColor={COLORS.primary}>
            {actionLabel}
          </Button>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    backgroundColor: '#fff9e6',
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  button: {
    minWidth: 80,
  },
});
