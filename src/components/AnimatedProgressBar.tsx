import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { COLORS } from '../constants'; // Импортируем общие цвета

interface AnimatedProgressBarProps {
  progress: number; // 0 to 100
  title?: string;
  color?: string;
  height?: number;
  showPercentage?: boolean;
}

export const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({
  progress,
  title,
  color = COLORS.primary, // Используем цвет Arsenal
  height = 12,
  showPercentage = true,
}) => {
  const widthAnim = new Animated.Value(0);
  const progressAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(widthAnim, {
        toValue: progress,
        duration: 1000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 1000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
    ]).start();
  }, [progress]);

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}

      <View style={[styles.track, { height, backgroundColor: `${color}20` }]}>
        <Animated.View
          style={[
            styles.progress,
            {
              width: widthAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
              backgroundColor: color,
              height,
              borderRadius: height / 2,
            },
          ]}
        />
      </View>

      {showPercentage && (
        <Animated.Text style={styles.percentage}>
          {progressAnim.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
          })}
        </Animated.Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text, // Используем цвет Arsenal
    marginBottom: 4,
  },
  track: {
    borderRadius: 6,
    overflow: 'hidden',
    marginVertical: 4,
  },
  progress: {
    height: '100%',
  },
  percentage: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text, // Используем цвет Arsenal
    marginTop: 4,
    textAlign: 'right',
  },
});
