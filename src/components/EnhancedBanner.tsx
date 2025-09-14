import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { COLORS } from '../constants';
import { EnhancedAnimatedCard } from './EnhancedAnimatedCard';

interface EnhancedBannerProps {
  title: string;
  subtitle?: string;
  icon?: string;
  style?: object;
}

export const EnhancedBanner: React.FC<EnhancedBannerProps> = ({ title, subtitle, icon, style }) => {
  return (
    <EnhancedAnimatedCard style={[styles.banner, style]}>
      <View style={styles.content}>
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
    </EnhancedAnimatedCard>
  );
};

const styles = StyleSheet.create({
  banner: {
    margin: 16,
    marginBottom: 8,
    backgroundColor: COLORS.primary,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 4,
      },
    }),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    marginRight: 16,
    color: COLORS.surface,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.surface,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.surface,
    opacity: 0.9,
  },
});
