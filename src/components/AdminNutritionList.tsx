import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Searchbar, Button, IconButton, Chip } from 'react-native-paper';
import { COLORS } from '../constants';

interface AdminNutrition {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  ageGroup: string;
  isPublished: boolean;
  tags: string[];
}

interface AdminNutritionListProps {
  recommendations: AdminNutrition[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
  title?: string;
}

export const AdminNutritionList: React.FC<AdminNutritionListProps> = ({
  recommendations,
  onEdit,
  onDelete,
  onPublish,
  title = 'Рекомендации по питанию',
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Фильтрация рекомендаций по поисковому запросу
  const filteredRecommendations = recommendations.filter(
    rec =>
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.ageGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Форматирование даты для отображения
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const renderRecommendationItem = ({ item }: { item: AdminNutrition }) => (
    <Card style={styles.recommendationCard}>
      <Card.Content>
        <View style={styles.header}>
          <Title style={styles.title}>{item.title}</Title>
          <View
            style={[
              styles.statusBadge,
              item.isPublished ? styles.publishedBadge : styles.draftBadge,
            ]}>
            <Text style={styles.statusText}>{item.isPublished ? 'Опубликовано' : 'Черновик'}</Text>
          </View>
        </View>

        <Text style={styles.excerpt}>{item.excerpt}</Text>

        <View style={styles.metaContainer}>
          <Text style={styles.author}>Автор: {item.author}</Text>
          <Text style={styles.date}>{formatDate(item.date)}</Text>
        </View>

        <View style={styles.tagsContainer}>
          <Chip icon="account-child-outline" style={styles.ageGroupChip}>
            {item.ageGroup}
          </Chip>
          {item.tags.map((tag, index) => (
            <Chip key={index} style={styles.tagChip} mode="outlined">
              {tag}
            </Chip>
          ))}
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

        <Searchbar
          placeholder="Поиск рекомендаций..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        {filteredRecommendations.length > 0 ? (
          <FlatList
            data={filteredRecommendations}
            renderItem={renderRecommendationItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Рекомендации не найдены</Text>
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
  searchbar: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  recommendationCard: {
    marginBottom: 16,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
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
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  ageGroupChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: COLORS.surface,
  },
  tagChip: {
    marginRight: 8,
    marginBottom: 8,
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
