import { Animated, Easing } from 'react-native';

// Утилита для создания анимаций
export const animations = {
  // Анимация появления (fade in)
  fadeIn: (animatedValue: Animated.Value, duration: number = 300) => {
    return Animated.timing(animatedValue, {
      toValue: 1,
      duration,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    });
  },

  // Анимация исчезновения (fade out)
  fadeOut: (animatedValue: Animated.Value, duration: number = 300) => {
    return Animated.timing(animatedValue, {
      toValue: 0,
      duration,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    });
  },

  // Анимация масштабирования
  scale: (animatedValue: Animated.Value, toValue: number, duration: number = 300) => {
    return Animated.spring(animatedValue, {
      toValue,
      friction: 8,
      tension: 50,
      useNativeDriver: true,
    });
  },

  // Анимация пружины
  spring: (animatedValue: Animated.Value, toValue: number) => {
    return Animated.spring(animatedValue, {
      toValue,
      friction: 7,
      tension: 100,
      useNativeDriver: true,
    });
  },

  // Анимация появления снизу
  slideInUp: (animatedValue: Animated.Value, duration: number = 300) => {
    return Animated.timing(animatedValue, {
      toValue: 0,
      duration,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    });
  },

  // Анимация исчезновения вниз
  slideOutDown: (animatedValue: Animated.Value, toValue: number, duration: number = 300) => {
    return Animated.timing(animatedValue, {
      toValue,
      duration,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    });
  },

  // Анимация пульсации
  pulse: (animatedValue: Animated.Value, minScale: number = 0.95, maxScale: number = 1.05) => {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: maxScale,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: minScale,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ); // Бесконечный цикл
  },
};

// Создаем повторяющуюся анимацию
export const createPulseAnimation = (
  value: Animated.Value,
  from: number,
  to: number,
  duration: number
) => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(value, {
        toValue: to,
        duration: duration / 2,
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: from,
        duration: duration / 2,
        useNativeDriver: true,
      }),
    ])
  );
};
