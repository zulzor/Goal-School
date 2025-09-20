import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  TextInput,
  Chip,
  IconButton,
  Text,
  Switch,
  List,
  Divider,
} from 'react-native-paper';
import { useAuth, UserRole } from '../context/LocalStorageAuthContext';
import { NewsStorageService } from '../services';
import { COLORS, SIZES } from '../constants';
import { ArsenalBanner } from '../components/ArsenalBanner';
import { UnderDevelopmentBanner } from '../components/UnderDevelopmentBanner';

interface SMManagerScreenProps {
  navigation: any;
}

export const SMManagerScreen: React.FC<SMManagerScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newsList, setNewsList] = useState<any[]>([]);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Проверяем, что пользователь является менеджером или SMM-менеджером
  const isSMManager = user?.role === UserRole.MANAGER || user?.role === UserRole.SMM_MANAGER;

  // Загрузка списка новостей
  const loadNews = useCallback(async () => {
    try {
      setRefreshing(true);
      const news = await NewsStorageService.getAllNews();
      setNewsList(news);
    } catch (error) {
      console.error('Ошибка загрузки новостей:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить список новостей');
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  // Добавление тега
  const addTag = useCallback(() => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  }, [tagInput, tags]);

  // Удаление тега
  const removeTag = useCallback(
    (tagToRemove: string) => {
      setTags(tags.filter(tag => tag !== tagToRemove));
    },
    [tags]
  );

  // Редактирование новости
  const editNews = useCallback((newsItem: any) => {
    setTitle(newsItem.title);
    setContent(newsItem.content);
    setTags(newsItem.tags || []);
    setIsImportant(newsItem.isImportant || false);
    setEditingNewsId(newsItem.id);
  }, []);

  // Удаление новости
  const deleteNews = useCallback(
    async (id: string, title: string) => {
      Alert.alert(
        'Подтверждение удаления',
        `Вы уверены, что хотите удалить новость "${title}"?`,
        [
          {
            text: 'Отмена',
            style: 'cancel',
          },
          {
            text: 'Удалить',
            style: 'destructive',
            onPress: async () => {
              try {
                await NewsStorageService.deleteNews(id);
                Alert.alert('Успех', 'Новость успешно удалена');
                loadNews(); // Перезагрузить список новостей
              } catch (error) {
                Alert.alert('Ошибка', 'Не удалось удалить новость');
                console.error('Ошибка удаления новости:', error);
              }
            },
          },
        ]
      );
    },
    [loadNews]
  );

  // Сохранение новости
  const handleSaveNews = useCallback(async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все обязательные поля');
      return;
    }

    try {
      setLoading(true);

      if (editingNewsId) {
        // Редактирование существующей новости
        await NewsStorageService.updateNews(editingNewsId, {
          title,
          content,
          excerpt: content.substring(0, 100) + '...',
          tags,
          isImportant,
        });
        Alert.alert('Успех', 'Новость успешно обновлена!');
      } else {
        // Создание новой новости
        await NewsStorageService.createNews({
          title,
          content,
          excerpt: content.substring(0, 100) + '...',
          date: new Date().toISOString().split('T')[0],
          authorName: user?.name || 'СММ-менеджер',
          image: null,
          tags,
          isImportant,
        });
        Alert.alert('Успех', 'Новость успешно создана!');
      }

      // Очищаем форму после успешного создания/обновления
      setTitle('');
      setContent('');
      setTags([]);
      setIsImportant(false);
      setEditingNewsId(null);
      setLoading(false);
      
      // Перезагрузить список новостей
      loadNews();
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить новость. Попробуйте еще раз.');
      console.error('Ошибка сохранения новости:', error);
      setLoading(false);
    }
  }, [title, content, tags, isImportant, user, editingNewsId, loadNews]);

  // Отмена редактирования
  const cancelEdit = useCallback(() => {
    setTitle('');
    setContent('');
    setTags([]);
    setIsImportant(false);
    setEditingNewsId(null);
  }, []);

  // Показываем заглушку, если пользователь не является менеджером или SMM-менеджером
  if (!isSMManager) {
    return (
      <UnderDevelopmentBanner
        title="Доступ запрещен"
        description="Только менеджеры и SMM-менеджеры могут управлять новостями."
        onBackPress={() => navigation.goBack()}
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ArsenalBanner
        title="Управление новостями"
        subtitle="Создание и публикация новостей для футбольной школы"
      />

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>
            {editingNewsId ? 'Редактировать новость' : 'Создать новую новость'}
          </Title>

          <TextInput
            label="Заголовок *"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="Содержание *"
            value={content}
            onChangeText={setContent}
            style={styles.input}
            mode="outlined"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Важная новость</Text>
            <Switch value={isImportant} onValueChange={setIsImportant} color={COLORS.primary} />
          </View>

          <View style={styles.tagsSection}>
            <Title style={styles.sectionTitle}>Теги</Title>
            <View style={styles.tagInputContainer}>
              <TextInput
                label="Добавить тег"
                value={tagInput}
                onChangeText={setTagInput}
                style={styles.tagInput}
                mode="outlined"
                onSubmitEditing={addTag}
              />
              <Button
                mode="contained"
                onPress={addTag}
                style={styles.addButton}
                disabled={!tagInput.trim()}>
                Добавить
              </Button>
            </View>

            <View style={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <Chip key={index} onClose={() => removeTag(tag)} style={styles.tagChip}>
                  {tag}
                </Chip>
              ))}
            </View>
          </View>

          <Button
            mode="contained"
            onPress={handleSaveNews}
            loading={loading}
            disabled={loading}
            style={styles.saveButton}>
            {loading ? (editingNewsId ? 'Сохранение...' : 'Публикация...') : 
             (editingNewsId ? 'Обновить новость' : 'Опубликовать новость')}
          </Button>

          {editingNewsId ? (
            <Button mode="outlined" onPress={cancelEdit} style={styles.cancelButton}>
              Отменить редактирование
            </Button>
          ) : (
            <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.cancelButton}>
              Назад
            </Button>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.headerContainer}>
            <Title style={styles.sectionTitle}>Существующие новости</Title>
            <Button 
              mode="text" 
              onPress={loadNews}
              loading={refreshing}
              disabled={refreshing}
            >
              Обновить
            </Button>
          </View>
          
          {newsList.length === 0 ? (
            <Paragraph style={styles.description}>
              Новости еще не созданы. Создайте первую новость, используя форму выше.
            </Paragraph>
          ) : (
            <View>
              {newsList.map((newsItem) => (
                <View key={newsItem.id}>
                  <List.Item
                    title={newsItem.title}
                    description={`${newsItem.excerpt.substring(0, 60)}...`}
                    left={props => (
                      <IconButton 
                        {...props} 
                        icon={newsItem.isImportant ? "star" : "newspaper"} 
                      />
                    )}
                    right={props => (
                      <View style={styles.newsActions}>
                        <IconButton
                          {...props}
                          icon="pencil"
                          onPress={() => editNews(newsItem)}
                        />
                        <IconButton
                          {...props}
                          icon="delete"
                          onPress={() => deleteNews(newsItem.id, newsItem.title)}
                        />
                      </View>
                    )}
                    onPress={() => editNews(newsItem)}
                  />
                  <Divider />
                </View>
              ))}
            </View>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Аналитика новостей</Title>
          <Paragraph style={styles.description}>
            Здесь будет отображаться статистика по просмотрам и взаимодействию с новостями.
          </Paragraph>
          <Button
            mode="outlined"
            onPress={() =>
              Alert.alert(
                'Функция в разработке',
                'Аналитика новостей будет доступна в следующем обновлении.'
              )
            }
            style={styles.actionButton}>
            Просмотреть аналитику
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  card: {
    margin: SIZES.padding,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: COLORS.text,
  },
  input: {
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    color: COLORS.text,
  },
  tagsSection: {
    marginBottom: 16,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tagInput: {
    flex: 1,
    marginRight: 8,
  },
  addButton: {
    minWidth: 100,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  saveButton: {
    marginTop: 16,
    marginBottom: 8,
  },
  cancelButton: {
    marginBottom: 16,
  },
  actionButton: {
    marginBottom: 8,
  },
  description: {
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  newsActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});