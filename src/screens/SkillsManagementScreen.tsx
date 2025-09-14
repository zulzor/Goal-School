import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, RefreshControl, Platform } from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  ActivityIndicator,
  List,
  Divider,
  Searchbar,
  FAB,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { progressService } from '../services/ProgressService';
import { useAuth } from '../context/LocalStorageAuthContext';
import { COLORS, SIZES } from '../constants';
import { UserRole } from '../types';

interface SkillAchievement {
  id: string;
  name: string;
  description: string;
  category: 'technical' | 'physical' | 'tactical' | 'mental' | 'social';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  icon?: string;
  color?: string;
  points: number;
  created_at: string;
}

const categoryNames = {
  technical: 'Технические',
  physical: 'Физические',
  tactical: 'Тактические',
  mental: 'Ментальные',
  social: 'Социальные',
};

const levelNames = {
  beginner: 'Начальный',
  intermediate: 'Средний',
  advanced: 'Продвинутый',
  expert: 'Эксперт',
};

// Обновляем цвета категорий на цвета Arsenal
const categoryColors = {
  technical: COLORS.accent, // Синий Arsenal
  physical: '#10b981', // Оставляем зеленый для физических навыков
  tactical: '#8b5cf6', // Оставляем фиолетовый для тактических навыков
  mental: COLORS.primary, // Красный Arsenal
  social: '#ef4444', // Оставляем красный для социальных навыков
};

export const SkillsManagementScreen = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState<SkillAchievement[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<SkillAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadSkills();
  }, []);

  useEffect(() => {
    filterSkills();
  }, [skills, searchQuery, selectedCategory]);

  const loadSkills = async () => {
    if (!user || ![UserRole.COACH, UserRole.MANAGER].includes(user.role)) {
      return;
    }

    try {
      setLoading(true);
      const skillsData = await progressService.getAllSkills();
      setSkills(skillsData);
    } catch (error) {
      console.error('Ошибка загрузки навыков:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить навыки и достижения');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSkills();
    setRefreshing(false);
  };

  const filterSkills = () => {
    let result = skills;

    // Фильтр по категории
    if (selectedCategory) {
      result = result.filter(skill => skill.category === selectedCategory);
    }

    // Фильтр по поиску
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        skill =>
          skill.name.toLowerCase().includes(query) ||
          skill.description.toLowerCase().includes(query)
      );
    }

    setFilteredSkills(result);
  };

  const getCategories = () => {
    const categories = [...new Set(skills.map(skill => skill.category))];
    return categories;
  };

  const getCategoryName = (category: string) => {
    return categoryNames[category as keyof typeof categoryNames] || category;
  };

  const getLevelName = (level: string) => {
    return levelNames[level as keyof typeof levelNames] || level;
  };

  const getCategoryColor = (category: string) => {
    return categoryColors[category as keyof typeof categoryColors] || COLORS.primary;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Загрузка навыков...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user || ![UserRole.COACH, UserRole.MANAGER].includes(user.role)) {
    return (
      <SafeAreaView style={styles.container}>
        <Card style={styles.errorCard}>
          <Card.Content>
            <Title>Доступ запрещен</Title>
            <Paragraph>Управление навыками доступно только тренерам и управляющим</Paragraph>
          </Card.Content>
        </Card>
      </SafeAreaView>
    );
  }

  // Показываем заглушку для экрана в разработке
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={styles.header}>
          <Title style={styles.title}>Навыки и достижения</Title>
          <Paragraph style={styles.subtitle}>Управление навыками учеников</Paragraph>
        </View>

        {/* Поиск */}
        <Searchbar
          placeholder="Поиск навыков..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />

        {/* Категории */}
        <View style={styles.categoriesContainer}>
          <Chip
            mode={!selectedCategory ? 'flat' : 'outlined'}
            onPress={() => setSelectedCategory(null)}
            style={styles.categoryChip}>
            Все
          </Chip>
          {getCategories().map(category => (
            <Chip
              key={category}
              mode={selectedCategory === category ? 'flat' : 'outlined'}
              onPress={() => setSelectedCategory(selectedCategory === category ? null : category)}
              style={[styles.categoryChip, { borderColor: getCategoryColor(category) }]}
              textStyle={{ color: getCategoryColor(category) }}>
              {getCategoryName(category)}
            </Chip>
          ))}
        </View>

        {/* Список навыков */}
        {filteredSkills.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Title>Навыки не найдены</Title>
              <Paragraph>
                {searchQuery || selectedCategory
                  ? 'Попробуйте изменить критерии поиска'
                  : 'Список навыков пуст'}
              </Paragraph>
            </Card.Content>
          </Card>
        ) : (
          <View style={styles.skillsList}>
            {filteredSkills.map((skill, index) => (
              <React.Fragment key={skill.id}>
                <Card style={styles.skillCard}>
                  <Card.Content>
                    <View style={styles.skillHeader}>
                      <View style={styles.skillInfo}>
                        <Text style={styles.skillName}>{skill.name}</Text>
                        <View style={styles.skillMeta}>
                          <Chip
                            style={[
                              styles.categoryChipSmall,
                              { backgroundColor: getCategoryColor(skill.category) },
                            ]}
                            textStyle={styles.categoryChipText}>
                            {getCategoryName(skill.category)}
                          </Chip>
                          <Chip
                            style={[
                              styles.levelChip,
                              {
                                backgroundColor:
                                  skill.level === 'beginner'
                                    ? '#10b981'
                                    : skill.level === 'intermediate'
                                      ? '#3b82f6'
                                      : skill.level === 'advanced'
                                        ? '#8b5cf6'
                                        : '#f59e0b',
                              },
                            ]}
                            textStyle={styles.levelChipText}>
                            {getLevelName(skill.level)}
                          </Chip>
                        </View>
                      </View>
                      {skill.icon && <Text style={styles.skillIcon}>{skill.icon}</Text>}
                    </View>
                    <Paragraph style={styles.skillDescription}>{skill.description}</Paragraph>
                    <View style={styles.skillFooter}>
                      <Text style={styles.skillPoints}>
                        {skill.points} {skill.points === 1 ? 'балл' : 'баллов'}
                      </Text>
                      <Button
                        mode="outlined"
                        onPress={() =>
                          Alert.alert(
                            'Редактирование навыка',
                            'Функция редактирования будет реализована позже'
                          )
                        }
                        style={styles.editButton}>
                        Редактировать
                      </Button>
                    </View>
                  </Card.Content>
                </Card>
                {index < filteredSkills.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </View>
        )}
      </ScrollView>

      {/* FAB для добавления нового навыка */}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() =>
          Alert.alert('Добавление навыка', 'Функция добавления будет реализована позже')
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // Используем цвет Arsenal
  },
  scrollContainer: {
    flex: 1,
    padding: SIZES.padding,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SIZES.padding,
    color: COLORS.textSecondary,
  },
  errorCard: {
    margin: SIZES.padding,
    // Используем boxShadow вместо elevation для веб-совместимости
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  header: {
    marginBottom: SIZES.padding,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary, // Используем цвет Arsenal
    marginBottom: 4,
  },
  subtitle: {
    color: COLORS.textSecondary,
  },
  searchBar: {
    marginBottom: SIZES.padding,
    // Используем boxShadow вместо elevation для веб-совместимости
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SIZES.padding,
  },
  categoryChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  categoryChipSmall: {
    height: 20,
    marginRight: 8,
  },
  categoryChipText: {
    fontSize: 10,
    color: 'white',
  },
  levelChip: {
    height: 20,
  },
  levelChipText: {
    fontSize: 10,
    color: 'white',
  },
  emptyCard: {
    // Используем boxShadow вместо elevation для веб-совместимости
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  emptyContent: {
    alignItems: 'center',
    padding: 20,
  },
  skillsList: {
    marginBottom: 80,
  },
  skillCard: {
    marginBottom: SIZES.padding,
    // Используем boxShadow вместо elevation для веб-совместимости
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  skillInfo: {
    flex: 1,
  },
  skillName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text, // Используем цвет Arsenal
    marginBottom: 4,
  },
  skillMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillIcon: {
    fontSize: 24,
  },
  skillDescription: {
    color: COLORS.textSecondary, // Используем цвет Arsenal
    marginBottom: 12,
  },
  skillFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skillPoints: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary, // Используем цвет Arsenal
  },
  editButton: {
    minWidth: 120,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary, // Используем цвет Arsenal
  },
});
