// src/components/ImprovedLoading.tsx
// Улучшенная система загрузки с анимациями

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../constants';

export interface ImprovedLoadingProps {
  visible: boolean;
  text?: string;
  type?: 'spinner' | 'dots' | 'pulse' | 'wave';
  size?: 'small' | 'medium' | 'large';
  color?: string;
  backgroundColor?: string;
  overlay?: boolean;
  animated?: boolean;
}

export const ImprovedLoading: React.FC<ImprovedLoadingProps> = ({
  visible,
  text,
  type = 'spinner',
  size = 'medium',
  color = COLORS.primary,
  backgroundColor = 'rgba(0, 0, 0, 0.5)',
  overlay = true,
  animated = true,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, animated]);

  if (!visible) return null;

  const getSizeValue = () => {
    switch (size) {
      case 'small':
        return 20;
      case 'medium':
        return 30;
      case 'large':
        return 40;
      default:
        return 30;
    }
  };

  const renderSpinner = () => (
    <ActivityIndicator size={getSizeValue()} color={color} />
  );

  const renderDots = () => {
    const dots = [0, 1, 2];
    return (
      <View style={styles.dotsContainer}>
        {dots.map((index) => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: color,
                width: getSizeValue() / 3,
                height: getSizeValue() / 3,
                borderRadius: getSizeValue() / 6,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  const renderPulse = () => {
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }, []);

    return (
      <Animated.View
        style={[
          styles.pulse,
          {
            width: getSizeValue(),
            height: getSizeValue(),
            backgroundColor: color,
            borderRadius: getSizeValue() / 2,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />
    );
  };

  const renderWave = () => {
    const bars = [0, 1, 2, 3, 4];
    return (
      <View style={styles.waveContainer}>
        {bars.map((index) => {
          const waveAnim = useRef(new Animated.Value(0.3)).current;

          useEffect(() => {
            const wave = Animated.loop(
              Animated.sequence([
                Animated.timing(waveAnim, {
                  toValue: 1,
                  duration: 600,
                  delay: index * 100,
                  useNativeDriver: true,
                }),
                Animated.timing(waveAnim, {
                  toValue: 0.3,
                  duration: 600,
                  useNativeDriver: true,
                }),
              ])
            );
            wave.start();
            return () => wave.stop();
          }, []);

          return (
            <Animated.View
              key={index}
              style={[
                styles.waveBar,
                {
                  backgroundColor: color,
                  height: getSizeValue(),
                  transform: [{ scaleY: waveAnim }],
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  const renderLoader = () => {
    switch (type) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'wave':
        return renderWave();
      default:
        return renderSpinner();
    }
  };

  const animatedStyle = {
    opacity: fadeAnim,
    transform: [{ scale: scaleAnim }],
  };

  const content = (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.loaderContainer}>
        {renderLoader()}
        {text && (
          <Text style={[styles.text, { color }]}>
            {text}
          </Text>
        )}
      </View>
    </Animated.View>
  );

  if (overlay) {
    return (
      <View style={[styles.overlay, { backgroundColor }]}>
        {content}
      </View>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    alignItems: 'center',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    marginHorizontal: 4,
  },
  pulse: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveBar: {
    width: 4,
    marginHorizontal: 2,
    borderRadius: 2,
  },
});

// Полноэкранный загрузчик
export interface FullScreenLoadingProps {
  visible: boolean;
  text?: string;
  type?: ImprovedLoadingProps['type'];
  size?: ImprovedLoadingProps['size'];
  color?: string;
}

export const FullScreenLoading: React.FC<FullScreenLoadingProps> = ({
  visible,
  text = 'Loading...',
  type = 'spinner',
  size = 'large',
  color = COLORS.primary,
}) => {
  return (
    <ImprovedLoading
      visible={visible}
      text={text}
      type={type}
      size={size}
      color={color}
      overlay={true}
      backgroundColor="rgba(255, 255, 255, 0.9)"
    />
  );
};

// Инлайн загрузчик
export interface InlineLoadingProps {
  visible: boolean;
  text?: string;
  type?: ImprovedLoadingProps['type'];
  size?: ImprovedLoadingProps['size'];
  color?: string;
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({
  visible,
  text,
  type = 'spinner',
  size = 'small',
  color = COLORS.primary,
}) => {
  return (
    <ImprovedLoading
      visible={visible}
      text={text}
      type={type}
      size={size}
      color={color}
      overlay={false}
    />
  );
};