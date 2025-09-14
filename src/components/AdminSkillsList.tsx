import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Searchbar, Button, IconButton, Chip } from 'react-native-paper';
import { COLORS } from '../constants';

interface AdminSkill {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: number; // 1-5
  isActive: boolean;
}

interface AdminSkillsListProps {
  skills: AdminSkill[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
  title?: string;
}

export const AdminSkillsList: React.FC<AdminSkillsListProps> = ({
  skills,
  onEdit,
  onDelete,
  onToggleActive,
  title = 'Навыки',
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Фильтрация навыков по поисковому запросу
  const filteredSkills = skills.filter(
    skill =>
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderSkillItem = ({ item }: { item: AdminSkill }) => {
    // Определение цвета для уровня сложности
    const getDifficultyColor = (level: number) => {
      if (level >= 4) return COLORS.error;
      if (level >= 3) return COLORS.warning;
      return COLORS.success;
    };

    return (
      <Card style={[styles.skillCard, !item.isActive && styles.inactiveCard]}>
        <Card.Content>
          <View style={styles.header}>
            <Title style={[styles.title, !item.isActive && styles.inactiveText]}>{item.name}</Title>
            <View style={styles.headerActions}>
              <Chip
                style={[
                  styles.difficultyChip,
                  { backgroundColor: getDifficultyColor(item.difficulty) },
                ]}>
                <Text style={styles.difficultyText}>{item.difficulty}/5</Text>
              </Chip>
              <IconButton
                icon={item.isActive ? 'eye' : 'eye-off'}
                size={20}
                iconColor={item.isActive ? COLORS.success : COLORS.textSecondary}
                onPress={() => onToggleActive(item.id)}
                style={styles.visibilityButton}
              />
            </View>
          </View>

          <Text style={[styles.description, !item.isActive && styles.inactiveText]}>
            {item.description}
          </Text>

          <View style={styles.categoryContainer}>
            <Chip icon="tag-outline" style={styles.categoryChip}>
              {item.category}
            </Chip>
          </View>

          <View style={styles.actionsContainer}>
            <Button
              mode="outlined"
              onPress={() => onEdit(item.id)}
              style={styles.actionButton}
              icon="pencil">
              Редактировать
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
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>{title}</Title>

        <Searchbar
          placeholder="Поиск навыков..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        {filteredSkills.length > 0 ? (
          <FlatList
            data={filteredSkills}
            renderItem={renderSkillItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Навыки не найдены</Text>
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
  skillCard: {
    marginBottom: 16,
    elevation: 1,
  },
  inactiveCard: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  inactiveText: {
    color: COLORS.textSecondary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyChip: {
    marginRight: 8,
  },
  difficultyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  visibilityButton: {
    margin: 0,
  },
  description: {
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryChip: {
    backgroundColor: COLORS.surface,
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
