import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Card, Text, TouchableRipple } from 'react-native-paper';
import { COLORS } from '../constants';

interface EnhancedAnimatedCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: object;
  elevation?: number;
}

export const EnhancedAnimatedCard: React.FC<EnhancedAnimatedCardProps> = ({
  children,
  onPress,
  style,
  elevation = 2,
}) => {
  const cardContent = (
    <Card
      style={[
        styles.card,
        style,
        Platform.select({
          web: {
            boxShadow: `0 ${elevation}px ${elevation * 2}px rgba(0, 0, 0, 0.1)`,
            transition: 'all 0.3s ease',
          },
          default: {
            elevation,
          },
        }),
      ]}
      onPress={onPress}>
      <Card.Content>{children}</Card.Content>
    </Card>
  );

  if (onPress) {
    return (
      <TouchableRipple onPress={onPress} rippleColor="rgba(0, 0, 0, .32)">
        {cardContent}
      </TouchableRipple>
    );
  }

  return cardContent;
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
  },
});
