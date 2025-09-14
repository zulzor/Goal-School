import React, { useState } from 'react';
import { View, StyleSheet, Text, Platform, Dimensions } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { COLORS } from '../constants';

interface NutritionRecommendation {
  id: string;
  title: string;
  description: string;
}

interface NutritionListProps {
  recommendations: NutritionRecommendation[];
  onRecommendationPress: (id: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const NutritionList: React.FC<NutritionListProps> = ({ recommendations }) => {
  return (
    <View style={styles.container}>
      {recommendations.map(item => (
        <Card key={item.id} style={styles.card}>
          <Card.Content>
            <Title>{item.title}</Title>
            <Paragraph>{item.description}</Paragraph>
          </Card.Content>
        </Card>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
});
