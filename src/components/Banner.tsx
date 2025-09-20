import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { COLORS } from '../constants';

interface BannerProps {
  title: string;
  subtitle?: string;
  backgroundColor?: string;
  textColor?: string;
  style?: any;
}

export const Banner: React.FC<BannerProps> = ({
  title,
  subtitle,
  backgroundColor = COLORS.primary,
  textColor = 'white',
  style,
}) => {
  return (
    <Card style={[styles.card, { backgroundColor }, style]}>
      <Card.Content style={styles.content}>
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        {subtitle && <Text style={[styles.subtitle, { color: textColor }]}>{subtitle}</Text>}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    elevation: 2,
  },
  content: {
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
  },
});
