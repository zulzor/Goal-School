import React, { useEffect } from 'react';
import { View, StyleSheet, Platform, Animated } from 'react-native';
import { Card } from 'react-native-paper';
import { useAnimation } from '../hooks/useAnimation';

interface AnimatedCardProps {
  children: React.ReactNode;
  style?: any;
  delay?: number;
  animationType?: 'fade' | 'scale' | 'slide';
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  style,
  delay = 0,
  animationType = 'scale',
}) => {
  const { opacity, scale, translateY, scaleIn, fadeIn } = useAnimation();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (animationType === 'scale') {
        scaleIn(500);
      } else if (animationType === 'fade') {
        fadeIn(500);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, animationType, scaleIn, fadeIn]);

  const animatedStyle = {
    opacity,
    transform: [{ scale }, { translateY }],
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[animatedStyle, style]}>
        <Card style={styles.card}>{children}</Card>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  card: {
    margin: 8,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
});
