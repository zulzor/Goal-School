import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { Card } from 'react-native-paper';
import { DESIGN_SYSTEM } from '../constants/designSystem';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: string;
  color?: string;
  style?: any;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  color = DESIGN_SYSTEM.colors.primary,
  style,
}) => {
  const scaleAnim = new Animated.Value(0.8);
  const opacityAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
        style,
      ]}>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <View style={styles.header}>
            {icon && (
              <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
                <Text style={[styles.icon, { color }]}>{icon}</Text>
              </View>
            )}
            <Text style={styles.title}>{title}</Text>
          </View>

          <Text style={[styles.value, { color }]}>{value}</Text>

          {description && <Text style={styles.description}>{description}</Text>}
        </Card.Content>
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
    ...Platform.select({
      web: {
        boxShadow: DESIGN_SYSTEM.shadows.md,
      },
      default: {
        elevation: 3,
      },
    }),
    margin: DESIGN_SYSTEM.spacing.sm,
    backgroundColor: DESIGN_SYSTEM.colors.surface,
  },
  content: {
    padding: DESIGN_SYSTEM.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DESIGN_SYSTEM.spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: DESIGN_SYSTEM.spacing.sm,
  },
  icon: {
    fontSize: 20,
    fontWeight: '600',
  },
  title: {
    fontSize: DESIGN_SYSTEM.typography.body1.fontSize,
    color: DESIGN_SYSTEM.colors.textSecondary,
    fontWeight: '500',
  },
  value: {
    fontSize: DESIGN_SYSTEM.typography.h1.fontSize,
    fontWeight: '700',
    marginBottom: DESIGN_SYSTEM.spacing.sm,
  },
  description: {
    fontSize: DESIGN_SYSTEM.typography.caption.fontSize,
    color: DESIGN_SYSTEM.colors.textSecondary,
  },
});
