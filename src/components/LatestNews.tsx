import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { NewsItem } from './NewsItem';
import { COLORS } from '../constants';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  isImportant?: boolean;
}

interface LatestNewsProps {
  news: NewsItem[];
  onNewsPress: (newsItem: NewsItem) => void;
  onSeeAllPress: () => void;
  title?: string;
}

export const LatestNews: React.FC<LatestNewsProps> = ({
  news,
  onNewsPress,
  onSeeAllPress,
  title = 'Последние новости',
}) => {
  // Форматирование даты для отображения
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>{title}</Title>
        <Button mode="text" onPress={onSeeAllPress} style={styles.seeAllButton}>
          Все новости
        </Button>
      </View>

      <View style={styles.newsList}>
        {news.slice(0, 3).map(item => (
          <NewsItem
            key={item.id}
            title={item.title}
            content={item.content}
            date={formatDate(item.date)}
            author={item.author}
            isImportant={item.isImportant}
            onPress={() => onNewsPress(item)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  seeAllButton: {
    minWidth: 100,
  },
  newsList: {
    // Дополнительные стили для списка новостей
  },
});
