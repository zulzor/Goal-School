import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DESIGN_SYSTEM } from '../constants/designSystem';

interface AnimatedHeaderProps {
  title: string;
  subtitle?: string;
  showGradient?: boolean;
}

export const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({
  title,
  subtitle,
  showGradient = true,
}) => {
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(20);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (showGradient) {
    return (
      <LinearGradient
        colors={DESIGN_SYSTEM.gradients.primary}
        style={styles.gradientHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </Animated.View>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.regularHeader}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  gradientHeader: {
    padding: DESIGN_SYSTEM.spacing.xl,
    borderBottomLeftRadius: DESIGN_SYSTEM.borderRadius.xl,
    borderBottomRightRadius: DESIGN_SYSTEM.borderRadius.xl,
    marginBottom: DESIGN_SYSTEM.spacing.lg,
  },
  regularHeader: {
    padding: DESIGN_SYSTEM.spacing.xl,
    backgroundColor: DESIGN_SYSTEM.colors.surface,
    marginBottom: DESIGN_SYSTEM.spacing.lg,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: DESIGN_SYSTEM.typography.h1.fontSize,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: DESIGN_SYSTEM.spacing.sm,
  },
  subtitle: {
    fontSize: DESIGN_SYSTEM.typography.body1.fontSize,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
});
