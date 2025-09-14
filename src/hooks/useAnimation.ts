import { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

interface AnimationOptions {
  type?: 'fade' | 'scale' | 'slide';
  delay?: number;
  duration?: number;
}

// Хук для создания и управления анимациями
export const useAnimation = (options?: AnimationOptions) => {
  const { type = 'fade', delay = 0, duration = 300 } = options || {};

  // Анимация прозрачности
  const opacity = useRef(new Animated.Value(0)).current;

  // Анимация масштабирования
  const scale = useRef(new Animated.Value(type === 'scale' ? 0.8 : 1)).current;

  // Анимация перемещения по оси Y
  const translateY = useRef(new Animated.Value(type === 'slide' ? 50 : 0)).current;

  // Анимация вращения
  const rotate = useRef(new Animated.Value(0)).current;

  // Запуск анимации при монтировании
  useEffect(() => {
    const animationTimer = setTimeout(() => {
      switch (type) {
        case 'scale':
          scaleIn(duration);
          break;
        case 'slide':
          slideIn(duration);
          break;
        case 'fade':
        default:
          fadeIn(duration);
          break;
      }
    }, delay);

    return () => clearTimeout(animationTimer);
  }, [type, delay, duration]);

  // Fade in анимация
  const fadeIn = (duration: number = 300) => {
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  // Fade out анимация
  const fadeOut = (duration: number = 300) => {
    Animated.timing(opacity, {
      toValue: 0,
      duration,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  // Анимация появления с масштабированием
  const scaleIn = (duration: number = 300) => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Анимация появления с перемещением сверху
  const slideIn = (duration: number = 300) => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Анимация пульсации
  const pulse = (minScale: number = 0.95, maxScale: number = 1.05, duration: number = 500) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: maxScale,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: minScale,
          duration,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Анимация вращения
  const rotateAnimation = (duration: number = 1000) => {
    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  // Интерполяция значений для вращения
  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Стили для анимации
  const animatedStyle = {
    opacity,
    transform: [{ scale }, { translateY }, { rotate: rotateInterpolate }],
  };

  return {
    opacity,
    scale,
    translateY,
    rotate,
    rotateInterpolate,
    animatedStyle,
    fadeIn,
    fadeOut,
    scaleIn,
    slideIn,
    pulse,
    rotateAnimation,
  };
};
