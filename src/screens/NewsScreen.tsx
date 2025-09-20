import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  RefreshControl,
  Platform,
  TextInput,
  ScrollView,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  ActivityIndicator,
  FAB,
  Chip,
  IconButton,
  Text,
} from 'react-native-paper';
import { useAuth, UserRole } from '../context/LocalStorageAuthContext';
import { NewsService } from '../services';
import { COLORS, SIZES } from '../constants';
import { NewsList } from '../components/NewsList';
import { useFocusEffect } from '@react-navigation/native';
import { AnimatedCard } from '../components/AnimatedCard';
import { ArsenalBanner } from '../components/ArsenalBanner';
import { UnderDevelopmentBanner } from '../components/UnderDevelopmentBanner';

interface NewsScreenProps {
  navigation: any;
}

export const NewsScreen: React.FC<NewsScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [news, setNews] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const isAdmin = user?.role === UserRole.MANAGER;

  // Категории новостей
  const categories = useMemo(() => {
    const cats = new Set(news.flatMap(item => item.tags || []));
    return Array.from(cats).sort();
  }, [news]);

  const loadNews = useCallback(async () => {
    try {
      setLoading(true);
      // В реальном приложении здесь будет запрос к сервису новостей
      // Пока используем моковые данные
      const mockNews = [
        {
          id: '1',
          title: 'Новая тренировочная программа',
          content:
            'Мы внедрили новую программу тренировок для всех возрастных групп. Программа включает в себя новые упражнения для развития техники владения мячом и улучшения физической подготовки.',
          excerpt: 'Мы внедрили новую программу тренировок для всех возрастных групп.',
          date: '2025-09-05',
          authorName: 'Администрация',
          image: null,
          tags: ['тренировки', 'программа'],
          isImportant: false,
          publishedAt: '2025-09-05',
        },
        {
          id: '2',
          title: 'Победа на турнире',
          content:
            'Наша команда U-12 одержала победу в городском турнире. Команда показала отличную игру и заслуженно выиграла со счетом 3:1.',
          excerpt: 'Наша команда U-12 одержала победу в городском турнире.',
          date: '2025-09-03',
          authorName: 'Главный тренер',
          image: null,
          tags: ['турнир', 'победа'],
          isImportant: true,
          publishedAt: '2025-09-03',
        },
        {
          id: '3',
          title: 'Открытие нового поля',
          content:
            'С 1 сентября открыто новое тренировочное поле для юных футболистов. Поле соответствует всем стандартам и оснащено современным покрытием.',
          excerpt: 'С 1 сентября открыто новое тренировочное поле для юных футболистов.',
          date: '2025-09-01',
          authorName: 'Администрация',
          image: null,
          tags: ['инфраструктура', 'поле'],
          isImportant: false,
          publishedAt: '2025-09-01',
        },
        {
          id: '4',
          title: 'Новые рекомендации по питанию',
          content:
            'Наши диетологи разработали новые рекомендации по питанию для юных футболистов. Рекомендации включают в себя сбалансированное меню на каждый день недели.',
          excerpt: 'Новые рекомендации по питанию для юных футболистов.',
          date: '2025-08-28',
          authorName: 'Служба питания',
          image: null,
          tags: ['питание', 'здоровье'],
          isImportant: false,
          publishedAt: '2025-08-28',
        },
        {
          id: '5',
          title: 'Международный обмен',
          content:
            'Наши лучшие игроки поедут на международный обмен в Испанию. Это отличная возможность для развития навыков и получения международного опыта.',
          excerpt: 'Лучшие игроки поедут на международный обмен в Испанию.',
          date: '2025-08-25',
          authorName: 'Администрация',
          image: null,
          tags: ['международное', 'обмен'],
          isImportant: true,
          publishedAt: '2025-08-25',
        },
      ];
      setNews(mockNews);
      setError(''); // Очищаем ошибку при успешной загрузке
    } catch (err) {
      setError('Не удалось загрузить новости. Проверьте подключение к интернету.');
      console.error('Ошибка загрузки новостей:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadNews();
    }, [loadNews])
  );

  // Мемоизированный список новостей с учетом поиска и категории
  const filteredNews = useMemo(() => {
    return news.filter(item => {
      // Фильтрация по поисковому запросу
      if (
        searchQuery &&
        !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.content.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Фильтрация по категории
      if (selectedCategory && (!item.tags || !item.tags.includes(selectedCategory))) {
        return false;
      }

      return true;
    });
  }, [news, searchQuery, selectedCategory]);

  // Оптимизированный колбэк для обработки поиска
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Оптимизированный колбэк для обновления
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadNews();
    setRefreshing(false);
  }, [loadNews]);

  // Оптимизированный колбэк для перехода к новости
  const handleNewsPress = useCallback(
    (newsItem: any) => {
      // Навигация к экрану деталей новости
      navigation.navigate('NewsDetail', { newsItem });
    },
    [navigation]
  );

  // Оптимизированный колбэк для добавления новости
  const handleAddNews = useCallback(() => {
    Alert.alert('Добавить новость', 'Вы уверены, что хотите добавить новость?', [
      {
        text: 'Отмена',
        style: 'cancel',
      },
      {
        text: 'Добавить',
        onPress: () => {
          navigation.navigate('AdminPanel');
        },
      },
    ]);
  }, [navigation]);

  // Показываем заглушку для экрана в разработке
  if (isAdmin) {
    return (
      <UnderDevelopmentBanner
        title="Управление новостями"
        description="Этот раздел находится в активной разработке. Функционал управления новостями будет доступен в следующем обновлении."
        onBackPress={() => navigation.goBack()}
      />
    );
  }

  return (
    <View style={styles.container}>
      <ArsenalBanner
        title="Новости футбольной школы"
        subtitle="Будьте в курсе последних событий и объявлений"
      />

      <AnimatedCard animationType="fade" delay={0}>
        <View style={styles.controlsContainer}>
          <TextInput
            placeholder="Поиск новостей..."
            onChangeText={handleSearch}
            value={searchQuery}
            style={styles.searchbar}
          />

          {/* Категории */}
          <View style={styles.categoriesContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContent}>
              <Chip
                mode="outlined"
                selected={selectedCategory === null}
                onPress={() => setSelectedCategory(null)}
                style={styles.categoryChip}>
                Все
              </Chip>
              {categories.map(category => (
                <Chip
                  key={category}
                  mode="outlined"
                  selected={selectedCategory === category}
                  onPress={() =>
                    setSelectedCategory(category === selectedCategory ? null : category)
                  }
                  style={styles.categoryChip}>
                  {category}
                </Chip>
              ))}
            </ScrollView>
          </View>
        </View>
      </AnimatedCard>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Загрузка новостей...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <IconButton icon="alert-circle-outline" size={48} iconColor={COLORS.error} />
          <Title style={styles.errorTitle}>Ошибка загрузки</Title>
          <Paragraph style={styles.errorText}>{error}</Paragraph>
          <Button mode="contained" onPress={loadNews} style={styles.retryButton}>
            Повторить попытку
          </Button>
        </View>
      ) : filteredNews.length === 0 ? (
        <View style={styles.centerContainer}>
          <IconButton icon="newspaper-variant-outline" size={48} iconColor={COLORS.textSecondary} />
          <Title style={styles.emptyTitle}>Новости не найдены</Title>
          <Paragraph style={styles.emptyText}>
            Попробуйте изменить поисковый запрос или сбросить фильтры
          </Paragraph>
          <Button
            mode="outlined"
            onPress={() => {
              setSearchQuery('');
              setSelectedCategory(null);
            }}
            style={styles.retryButton}>
            Сбросить фильтры
          </Button>
        </View>
      ) : (
        <NewsList
          news={filteredNews}
          onNewsPress={handleNewsPress}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}

      {isAdmin && (
        <FAB icon="plus" label="Добавить новость" style={styles.fab} onPress={handleAddNews} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  controlsContainer: {
    padding: SIZES.padding,
    paddingBottom: 8,
  },
  searchbar: {
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  categoriesContainer: {
    flexGrow: 0,
  },
  categoriesContent: {
    alignItems: 'center',
  },
  categoryChip: {
    marginHorizontal: 4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  errorTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.error,
  },
  errorText: {
    marginTop: 8,
    textAlign: 'center',
    color: COLORS.textSecondary,
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  emptyText: {
    marginTop: 8,
    textAlign: 'center',
    color: COLORS.textSecondary,
  },
  retryButton: {
    marginTop: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
  },
});
