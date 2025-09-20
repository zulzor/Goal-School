import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { COLORS } from '../constants';

interface NewsItemProps {
  title: string;
  content: string;
  date: string;
  author: string;
  isImportant?: boolean;
  onPress: () => void;
}

export const NewsItem: React.FC<NewsItemProps> = ({
  title,
  content,
  date,
  author,
  isImportant = false,
  onPress,
}) => {
  return (
    <Card style={[styles.newsCard, isImportant && styles.importantCard]} onPress={onPress}>
      <Card.Content>
        <View style={styles.newsHeader}>
          <View style={styles.titleContainer}>
            <Title style={[styles.newsTitle, isImportant && styles.importantTitle]}>{title}</Title>
            {isImportant && (
              <View style={styles.importantBadge}>
                <Text style={styles.importantBadgeText}>Важно</Text>
              </View>
            )}
          </View>
          <View style={styles.newsMeta}>
            <Text style={styles.authorText}>{author}</Text>
            <Text style={styles.dateText}>{date}</Text>
          </View>
        </View>

        <Paragraph style={styles.content} numberOfLines={3}>
          {content}
        </Paragraph>

        <Button mode="text" onPress={onPress} style={styles.readMoreButton}>
          Читать далее
        </Button>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  newsCard: {
    marginBottom: 12,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  importantCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
  },
  newsHeader: {
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    lineHeight: 22,
    flex: 1,
  },
  importantTitle: {
    color: COLORS.error,
  },
  importantBadge: {
    backgroundColor: COLORS.error,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  importantBadgeText: {
    color: COLORS.surface, // Используем цвет Arsenal вместо хардкодного значения
    fontSize: 10,
    fontWeight: 'bold',
  },
  newsMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorText: {
    fontSize: 12,
    color: COLORS.textSecondary, // Используем цвет Arsenal вместо хардкодного значения
    fontWeight: '500',
  },
  dateText: {
    fontSize: 12,
    color: COLORS.textSecondary, // Используем цвет Arsenal вместо хардкодного значения
  },
  content: {
    color: COLORS.textSecondary, // Используем цвет Arsenal вместо хардкодного значения
    marginBottom: 12,
    lineHeight: 20,
  },
  readMoreButton: {
    alignSelf: 'flex-start',
    minWidth: 100,
  },
});
