import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useAnimation } from '../hooks/useAnimation';
import { COLORS } from '../constants'; // Добавляем импорт цветов

interface AnimatedLoaderProps {
  loading: boolean;
  message?: string;
  size?: 'small' | 'large';
  color?: string;
}

export const AnimatedLoader: React.FC<AnimatedLoaderProps> = ({
  loading,
  message = 'Загрузка...',
  size = 'large',
  color = COLORS.primary, // Используем цвет Arsenal вместо хардкодного значения
}) => {
  const { scale, pulse } = useAnimation();

  useEffect(() => {
    if (loading) {
      pulse(0.9, 1.1, 1000);
    }
  }, [loading, pulse]);

  if (!loading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.loader, { transform: [{ scale }] }]}>
        <ActivityIndicator size={size} color={color} />
      </Animated.View>
      {message && <Text style={[styles.message, { color }]}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loader: {
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: COLORS.text, // Используем цвет Arsenal вместо хардкодного значения
  },
});
