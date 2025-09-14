import React from 'react';
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import { Card } from 'react-native-paper';
import { AnimatedCard } from './AnimatedCard';

interface ImageCardProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  onPress?: () => void;
  style?: any;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  title,
  subtitle,
  imageUrl,
  onPress,
  style,
}) => {
  return (
    <AnimatedCard animationType="scale" delay={0} style={style}>
      <Card style={styles.card} onPress={onPress}>
        {imageUrl ? (
          <Card.Cover source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>📷</Text>
          </View>
        )}
        <Card.Content style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </Card.Content>
      </Card>
    </AnimatedCard>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 3,
      },
    }),
    borderRadius: 12,
  },
  image: {
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  placeholder: {
    height: 150,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  placeholderText: {
    fontSize: 40,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
});
