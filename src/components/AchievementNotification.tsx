import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import { AnimatedCard } from './AnimatedCard';
import { COLORS } from '../constants';

interface AchievementNotificationProps {
  title: string;
  message: string;
  points: number;
  onDismiss: () => void;
  onPress?: () => void;
}

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  title,
  message,
  points,
  onDismiss,
  onPress,
}) => {
  return (
    <AnimatedCard animationType="slide" delay={0}>
      <Card style={styles.card}>
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
          <Card.Content style={styles.content}>
            <View style={styles.iconContainer}>
              <IconButton icon="trophy" iconColor="#FF9800" size={24} style={styles.trophyIcon} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
              <Text style={styles.message} numberOfLines={2}>
                {message}
              </Text>
              <View style={styles.pointsContainer}>
                <IconButton icon="star" iconColor="#FFD700" size={16} style={styles.starIcon} />
                <Text style={styles.pointsText}>+{points} очков</Text>
              </View>
            </View>
            <IconButton
              icon="close"
              size={20}
              onPress={e => {
                e.stopPropagation();
                onDismiss();
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
    borderLeftColor: '#FF9800',
    borderLeftWidth: 4,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 12,
  },
  trophyIcon: {
    margin: 0,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    margin: 0,
    marginRight: 4,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  dismissButton: {
    margin: 0,
  },
});
