import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card, Title, ProgressBar, IconButton, Searchbar } from 'react-native-paper';
import { COLORS } from '../constants';

interface Skill {
  id: string;
  name: string;
  description: string;
  level: number; // 0-100
  category: string;
}

interface SkillsListProps {
  skills: Skill[];
  onSkillPress?: (skill: Skill) => void;
  title?: string;
}

export const SkillsList: React.FC<SkillsListProps> = ({
  skills,
  onSkillPress,
  title = 'Навыки',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSkillId, setExpandedSkillId] = useState<string | null>(null);

  // Фильтрация навыков по поисковому запросу
  const filteredSkills = skills.filter(
    skill =>
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Группировка навыков по категориям
  const groupedSkills = filteredSkills.reduce((acc: Record<string, Skill[]>, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const toggleSkillExpansion = (skillId: string) => {
    setExpandedSkillId(expandedSkillId === skillId ? null : skillId);
  };

  const renderSkillItem = ({ item }: { item: Skill }) => {
    const isExpanded = expandedSkillId === item.id;

    return (
      <Card style={styles.skillCard} onPress={() => onSkillPress && onSkillPress(item)}>
        <Card.Content>
          <View style={styles.skillHeader}>
            <Title style={styles.skillTitle}>{item.name}</Title>
            <IconButton
              icon={isExpanded ? 'chevron-up' : 'chevron-down'}
              onPress={() => toggleSkillExpansion(item.id)}
              size={20}
            />
          </View>

          <ProgressBar
            progress={item.level / 100}
            color={COLORS.primary}
            style={styles.progressBar}
          />

          <View style={styles.levelContainer}>
            <Text style={styles.levelText}>Уровень: {item.level}%</Text>
          </View>

          {isExpanded && (
            <View style={styles.expandedContent}>
              <Text style={styles.skillDescription}>{item.description}</Text>
              <Text style={styles.skillCategory}>Категория: {item.category}</Text>
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  const renderCategory = ({ item: [category, categorySkills] }: { item: [string, Skill[]] }) => (
    <View key={category} style={styles.categoryContainer}>
      <Text style={styles.categoryTitle}>{category}</Text>
      <FlatList
        data={categorySkills}
        renderItem={renderSkillItem}
        keyExtractor={item => item.id}
        scrollEnabled={false}
      />
    </View>
  );

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

        {filteredSkills.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Навыки не найдены</Text>
          </View>
        ) : (
          <FlatList
            data={Object.entries(groupedSkills)}
            renderItem={renderCategory}
            keyExtractor={([category]) => category}
            showsVerticalScrollIndicator={false}
          />
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
  categoryContainer: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  skillCard: {
    marginBottom: 12,
    elevation: 1,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  skillTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  levelContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  levelText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  expandedContent: {
    marginTop: 12,
  },
  skillDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  skillCategory: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
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
