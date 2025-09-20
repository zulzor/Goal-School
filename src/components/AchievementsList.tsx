import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Searchbar, Chip, Menu, IconButton } from 'react-native-paper';
import { COLORS, SIZES } from '../constants';
import { Achievement } from '../types';
import { AchievementCard } from './AchievementCard';

interface AchievementsListProps {
  achievements: Achievement[];
  onAchievementPress?: (achievement: Achievement) => void;
}

export const AchievementsList: React.FC<AchievementsListProps> = ({
  achievements,
  onAchievementPress,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<
    'unlocked-first' | 'locked-first' | 'points-desc' | 'points-asc' | 'date-desc'
  >('unlocked-first');
  const [menuVisible, setMenuVisible] = useState(false);

  const categories = [
    { key: null, label: 'Все' },
    { key: 'training', label: 'Тренировки' },
    { key: 'skill', label: 'Навыки' },
    { key: 'progress', label: 'Прогресс' },
    { key: 'attendance', label: 'Посещаемость' },
    { key: 'special', label: 'Специальные' },
  ];

  const sortOptions = [
    { key: 'unlocked-first', label: 'Сначала разблокированные' },
    { key: 'locked-first', label: 'Сначала заблокированные' },
    { key: 'points-desc', label: 'По очкам (убывание)' },
    { key: 'points-asc', label: 'По очкам (возрастание)' },
    { key: 'date-desc', label: 'По дате разблокировки' },
  ];

  const filteredAchievements = achievements.filter(achievement => {
    const matchesSearch =
      achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achievement.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory ? achievement.category === selectedCategory : true;

    return matchesSearch && matchesCategory;
  });

  // Сортировка достижений
  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    switch (sortOrder) {
      case 'unlocked-first':
        return a.isUnlocked === b.isUnlocked ? 0 : a.isUnlocked ? -1 : 1;
      case 'locked-first':
        return a.isUnlocked === b.isUnlocked ? 0 : a.isUnlocked ? 1 : -1;
      case 'points-desc':
        return b.points - a.points;
      case 'points-asc':
        return a.points - b.points;
      case 'date-desc':
        if (!a.earnedAt && !b.earnedAt) return 0;
        if (!a.earnedAt) return 1;
        if (!b.earnedAt) return -1;
        return new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime();
      default:
        return 0;
    }
  });

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalCount = achievements.length;

  // Группируем достижения по статусу (разблокированные/заблокированные)
  const unlockedAchievements = sortedAchievements.filter(a => a.isUnlocked);
  const lockedAchievements = sortedAchievements.filter(a => !a.isUnlocked);

  // Создаем массив для отображения с разделителями
  const displayAchievements = [
    ...(unlockedAchievements.length > 0
      ? [{ type: 'header', title: 'Разблокированные' }, ...unlockedAchievements]
      : []),
    ...(lockedAchievements.length > 0
      ? [{ type: 'header', title: 'Заблокированные' }, ...lockedAchievements]
      : []),
  ];

  // Если нет достижений вообще
  if (displayAchievements.length === 0) {
    displayAchievements.push({ type: 'empty', title: 'Нет достижений' });
  }

  const renderItem = ({ item }: any) => {
    if (item.type === 'header') {
      return <Text style={styles.sectionTitle}>{item.title}</Text>;
    }

    if (item.type === 'empty') {
      return <Text style={styles.emptyText}>{item.title}</Text>;
    }

    return <AchievementCard achievement={item} onPress={() => onAchievementPress?.(item)} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Достижения</Text>
        <Text style={styles.counter}>
          {unlockedCount}/{totalCount}
        </Text>
      </View>

      <Searchbar
        placeholder="Поиск достижений..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <View style={styles.filtersContainer}>
        <View style={styles.categoryContainer}>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Chip
                mode="outlined"
                selected={selectedCategory === item.key}
                onPress={() => setSelectedCategory(item.key)}
                style={[
                  styles.categoryChip,
                  selectedCategory === item.key && styles.selectedCategoryChip,
                ]}
                textStyle={[
                  styles.categoryText,
                  selectedCategory === item.key && styles.selectedCategoryText,
                ]}>
                {item.label}
              </Chip>
            )}
            keyExtractor={item => item.key || 'all'}
          />
        </View>

        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton
              icon="sort"
              onPress={() => setMenuVisible(true)}
              style={styles.sortButton}
            />
          }>
          {sortOptions.map(option => (
            <Menu.Item
              key={option.key}
              title={option.label}
              onPress={() => {
                setSortOrder(option.key as any);
                setMenuVisible(false);
              }}
              style={sortOrder === option.key ? styles.selectedSortOption : {}}
            />
          ))}
        </Menu>
      </View>

      <FlatList
        data={displayAchievements}
        renderItem={renderItem}
        keyExtractor={(item: any, index) => (item.id ? item.id : index.toString())}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  counter: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  searchbar: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: 'white',
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  categoryContainer: {
    flex: 1,
  },
  categoryChip: {
    marginRight: 8,
    backgroundColor: 'white',
  },
  selectedCategoryChip: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    color: COLORS.text,
  },
  selectedCategoryText: {
    color: 'white',
  },
  sortButton: {
    margin: 0,
  },
  selectedSortOption: {
    backgroundColor: COLORS.surface,
  },
  listContent: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.surface,
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    color: COLORS.textSecondary,
  },
});
