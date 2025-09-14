import React, { useState, useCallback } from 'react';
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

  // Проверяем, что пользователь является СММ-менеджером
  const isSMManager = user?.role === UserRole.MANAGER; // Предполагаем, что СММ-менеджер имеет роль менеджера

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

  // Сохранение новости
  const handleSaveNews = useCallback(async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все обязательные поля');
      return;
    }

    try {
      setLoading(true);

      // Создаем новую новость с помощью сервиса
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

      Alert.alert('Успех', 'Новость успешно создана!', [
        {
          text: 'OK',
          onPress: () => {
            // Очищаем форму после успешного создания
            setTitle('');
            setContent('');
            setTags([]);
            setIsImportant(false);
            setLoading(false);
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось создать новость. Попробуйте еще раз.');
      console.error('Ошибка создания новости:', error);
      setLoading(false);
    }
  }, [title, content, tags, isImportant, user]);

  // Показываем заглушку, если пользователь не является СММ-менеджером
  if (!isSMManager) {
    return (
      <UnderDevelopmentBanner
        title="Доступ запрещен"
        description="Только СММ-менеджеры могут управлять новостями."
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
          <Title style={styles.sectionTitle}>Создать новую новость</Title>

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
            {loading ? 'Сохранение...' : 'Опубликовать новость'}
          </Button>

          <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.cancelButton}>
            Отмена
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Управление существующими новостями</Title>
          <Paragraph style={styles.description}>
            Здесь будет возможность редактировать и удалять существующие новости.
          </Paragraph>
          <Button
            mode="outlined"
            onPress={() =>
              Alert.alert(
                'Функция в разработке',
                'Управление существующими новостями будет доступно в следующем обновлении.'
              )
            }
            style={styles.actionButton}>
            Просмотреть новости
          </Button>
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
                'Аналитика новостей будет доступно в следующем обновлении.'
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
});
