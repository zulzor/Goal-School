import React from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { NewsItem } from './NewsItem';
import { COLORS } from '../constants';

interface NewsListProps {
  news: any[];
  onNewsPress: (newsItem: any) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export const NewsList: React.FC<NewsListProps> = ({
  news,
  onNewsPress,
  refreshing = false,
  onRefresh,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
    });
  };

  const renderNewsItem = ({ item }: { item: any }) => (
    <NewsItem
      title={item.title}
      content={item.content}
      date={formatDate(item.publishedAt)}
      author={item.authorName}
      isImportant={item.isImportant}
      onPress={() => onNewsPress(item)}
    />
  );

  const keyExtractor = (item: any) => item.id;

  return (
    <FlatList
      data={news}
      renderItem={renderNewsItem}
      keyExtractor={keyExtractor}
      style={styles.list}
      contentContainerStyle={styles.contentContainer}
      refreshing={refreshing}
      onRefresh={onRefresh}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Новости не найдены</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});
