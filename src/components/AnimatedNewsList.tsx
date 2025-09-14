import React, { memo } from 'react';
import { View, Text, StyleSheet, Platform, FlatList } from 'react-native';
import { Card, Title, Paragraph, Chip, Button } from 'react-native-paper';
import { AnimatedCard } from './AnimatedCard';
import { News } from '../types';

interface NewsItem extends News {
  author: {
    id: string;
    name: string;
  };
  createdAt: string;
}

interface AnimatedNewsListProps {
  news: News[];
  onNewsPress: (newsId: string) => void;
  title?: string;
}

// Мемоизированный компонент для отдельной новости
const NewsItemComponent = memo(
  ({
    item,
    index,
    onNewsPress,
  }: {
    item: News;
    index: number;
    onNewsPress: (newsId: string) => void;
  }) => (
    <AnimatedCard
      key={item.id}
      animationType="scale"
      delay={index * 100}
      style={[styles.newsCard, item.isImportant && styles.importantCard]}>
      <Card onPress={() => onNewsPress(item.id)}>
        <Card.Content>
          <View style={styles.newsHeader}>
            <View style={styles.newsInfo}>
              <Title style={[styles.newsTitle, item.isImportant && styles.importantTitle]}>
                {item.title}
              </Title>
              <View style={styles.authorContainer}>
                <Text style={styles.authorText}>{item.authorName || 'Администратор'}</Text>
              </View>
            </View>
            <Text style={styles.date}>
              {new Date(item.publishedAt).toLocaleDateString('ru-RU')}
            </Text>
          </View>

          <Paragraph style={styles.excerpt}>{item.excerpt}</Paragraph>

          <View style={styles.tagsRow}>
            {item.tags?.map((tag: string) => (
              <Chip key={tag} mode="outlined" style={styles.newsTag}>
                {tag}
              </Chip>
            ))}
          </View>

          <Button mode="text" onPress={() => onNewsPress(item.id)} style={styles.readMoreButton}>
            Читать далее
          </Button>
        </Card.Content>
      </Card>
    </AnimatedCard>
  )
);

export const AnimatedNewsList: React.FC<AnimatedNewsListProps> = ({
  news,
  onNewsPress,
  title = 'Новости',
}) => {
  if (news.length === 0) {
    return (
      <AnimatedCard animationType="fade" delay={0}>
        <Card style={styles.emptyCard}>
          <Card.Content style={styles.emptyContent}>
            <Title style={styles.emptyTitle}>Новости не найдены</Title>
            <Text style={styles.emptyText}>Пока нет новостей. Загляните позже!</Text>
          </Card.Content>
        </Card>
      </AnimatedCard>
    );
  }

  // Функция для рендеринга отдельной новости
  const renderItem = ({ item, index }: { item: News; index: number }) => (
    <NewsItemComponent item={item} index={index} onNewsPress={onNewsPress} />
  );

  // Функция для извлечения ключа элемента
  const keyExtractor = (item: News) => item.id;

  return (
    <View style={styles.container}>
      <AnimatedCard animationType="fade" delay={0}>
        <Title style={styles.title}>{title}</Title>
      </AnimatedCard>

      <FlatList
        data={news}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={21}
        removeClippedSubviews={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#333',
  },
  emptyCard: {
    margin: 16,
  },
  emptyContent: {
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
  },
  newsCard: {
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
  importantCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF5722',
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  newsInfo: {
    flex: 1,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    lineHeight: 22,
  },
  importantTitle: {
    color: '#FF5722',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorText: {
    fontSize: 12,
    color: '#666',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  excerpt: {
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  newsTag: {
    marginRight: 6,
    marginBottom: 4,
  },
  readMoreButton: {
    alignSelf: 'flex-start',
  },
});
