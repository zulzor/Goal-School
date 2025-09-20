import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Paragraph, Button, IconButton } from 'react-native-paper';
import { COLORS } from '../constants';

interface AdminNewsItem {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  isPublished: boolean;
  isImportant: boolean;
}

interface AdminNewsListProps {
  news: AdminNewsItem[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
  title?: string;
}

export const AdminNewsList: React.FC<AdminNewsListProps> = ({
  news,
  onEdit,
  onDelete,
  onPublish,
  title = 'Новости',
}) => {
  // Форматирование даты для отображения
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const renderNewsItem = ({ item }: { item: AdminNewsItem }) => (
    <Card style={styles.newsCard}>
      <Card.Content>
        <View style={styles.header}>
          <Title style={[styles.title, item.isImportant && styles.importantTitle]}>
            {item.title}
          </Title>
          {item.isImportant && (
            <View style={styles.importantBadge}>
              <Text style={styles.importantBadgeText}>Важно</Text>
            </View>
          )}
        </View>

        <Paragraph style={styles.excerpt}>{item.excerpt}</Paragraph>

        <View style={styles.metaContainer}>
          <Text style={styles.author}>Автор: {item.author}</Text>
          <Text style={styles.date}>{formatDate(item.date)}</Text>
        </View>

        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              item.isPublished ? styles.publishedBadge : styles.draftBadge,
            ]}>
            <Text style={styles.statusText}>{item.isPublished ? 'Опубликовано' : 'Черновик'}</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <Button
            mode="outlined"
            onPress={() => onEdit(item.id)}
            style={styles.actionButton}
            icon="pencil">
            Редактировать
          </Button>

          <Button
            mode="outlined"
            onPress={() => onPublish(item.id)}
            style={styles.actionButton}
            icon={item.isPublished ? 'eye-off' : 'eye'}>
            {item.isPublished ? 'Снять с публикации' : 'Опубликовать'}
          </Button>

          <IconButton
            icon="delete"
            size={24}
            iconColor={COLORS.error}
            onPress={() => onDelete(item.id)}
            style={styles.deleteButton}
          />
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>{title}</Title>

        {news.length > 0 ? (
          <FlatList
            data={news}
            renderItem={renderNewsItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Новости не найдены</Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  importantTitle: {
    color: COLORS.error,
  },
  newsCard: {
    marginBottom: 16,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  importantBadge: {
    backgroundColor: COLORS.error,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  importantBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  excerpt: {
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  author: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  date: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  statusContainer: {
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  publishedBadge: {
    backgroundColor: COLORS.successBackground,
  },
  draftBadge: {
    backgroundColor: COLORS.warningBackground,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
    minWidth: 100,
  },
  deleteButton: {
    margin: 0,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});
