import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { COLORS } from '../constants';

interface NewFeatureNoticeProps {
  title: string;
  description: string;
  onAction?: () => void;
  actionLabel?: string;
}

export const NewFeatureNotice: React.FC<NewFeatureNoticeProps> = ({
  title,
  description,
  onAction,
  actionLabel = 'Попробовать',
}) => {
  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>✨</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        {onAction && (
          <Button
            mode="contained"
            onPress={onAction}
            style={styles.button}
            buttonColor={COLORS.primary}>
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
    backgroundColor: '#e3f2fd',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
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
