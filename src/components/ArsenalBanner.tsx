import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArsenalLogo } from './ArsenalLogo';
import { COLORS } from '../constants'; // Используем COLORS вместо ARSENAL_COLORS

interface ArsenalBannerProps {
  title: string;
  subtitle?: string;
  showLogo?: boolean;
  style?: any;
}

export const ArsenalBanner: React.FC<ArsenalBannerProps> = ({
  title,
  subtitle,
  showLogo = true,
  style,
}) => {
  return (
    <LinearGradient
      colors={COLORS.gradients.primary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.banner, style]}>
      <View style={styles.content}>
        {showLogo && (
          <View style={styles.logoContainer}>
            <ArsenalLogo size="small" showText={false} />
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  banner: {
    padding: 20,
    borderRadius: 16,
    margin: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
    }),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.surface,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
});
