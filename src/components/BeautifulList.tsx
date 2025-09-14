import React from 'react';
import { View, Text, StyleSheet, FlatList, Platform } from 'react-native';
import { Card, Divider } from 'react-native-paper';
import { AnimatedCard } from './AnimatedCard';
import { DESIGN_SYSTEM } from '../constants/designSystem';

interface BeautifulListItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  badge?: string;
  onPress?: () => void;
}

interface BeautifulListProps {
  data: BeautifulListItem[];
  title?: string;
  emptyMessage?: string;
}

export const BeautifulList: React.FC<BeautifulListProps> = ({
  data,
  title,
  emptyMessage = 'Нет данных для отображения',
}) => {
  const renderListItem = ({ item, index }: { item: BeautifulListItem; index: number }) => (
    <AnimatedCard animationType="slide" delay={index * 50} style={styles.itemContainer}>
      <Card style={styles.card} onPress={item.onPress}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.itemHeader}>
            {item.icon && (
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>{item.icon}</Text>
              </View>
            )}
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              {item.subtitle && <Text style={styles.subtitle}>{item.subtitle}</Text>}
            </View>
            {item.badge && (
              <View style={styles.badgeContainer}>
                <Text style={styles.badge}>{item.badge}</Text>
              </View>
            )}
          </View>
        </Card.Content>
      </Card>
    </AnimatedCard>
  );

  if (data.length === 0) {
    return (
      <AnimatedCard animationType="fade" delay={0}>
        <Card style={styles.emptyCard}>
          <Card.Content style={styles.emptyContent}>
            <Text style={styles.emptyText}>{emptyMessage}</Text>
          </Card.Content>
        </Card>
      </AnimatedCard>
    );
  }

  return (
    <View style={styles.container}>
      {title && (
        <AnimatedCard animationType="fade" delay={0}>
          <Text style={styles.listTitle}>{title}</Text>
        </AnimatedCard>
      )}

      <FlatList
        data={data}
        renderItem={renderListItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <Divider style={styles.divider} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listTitle: {
    fontSize: DESIGN_SYSTEM.typography.h2.fontSize,
    fontWeight: '700',
    margin: DESIGN_SYSTEM.spacing.md,
    color: DESIGN_SYSTEM.colors.text,
  },
  listContent: {
    padding: DESIGN_SYSTEM.spacing.sm,
  },
  itemContainer: {
    marginVertical: DESIGN_SYSTEM.spacing.sm,
  },
  card: {
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  cardContent: {
    padding: DESIGN_SYSTEM.spacing.md,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: DESIGN_SYSTEM.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: DESIGN_SYSTEM.spacing.md,
  },
  icon: {
    fontSize: 20,
    color: DESIGN_SYSTEM.colors.primary,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: DESIGN_SYSTEM.typography.body1.fontSize,
    fontWeight: '600',
    color: DESIGN_SYSTEM.colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: DESIGN_SYSTEM.typography.caption.fontSize,
    color: DESIGN_SYSTEM.colors.textSecondary,
  },
  badgeContainer: {
    backgroundColor: DESIGN_SYSTEM.colors.secondary,
    borderRadius: DESIGN_SYSTEM.borderRadius.pill,
    paddingHorizontal: DESIGN_SYSTEM.spacing.sm,
    paddingVertical: DESIGN_SYSTEM.spacing.xs,
  },
  badge: {
    fontSize: DESIGN_SYSTEM.typography.caption.fontSize,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyCard: {
    margin: DESIGN_SYSTEM.spacing.md,
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
    padding: DESIGN_SYSTEM.spacing.xl,
  },
  emptyText: {
    fontSize: DESIGN_SYSTEM.typography.body1.fontSize,
    color: DESIGN_SYSTEM.colors.textSecondary,
    textAlign: 'center',
  },
  divider: {
    marginVertical: DESIGN_SYSTEM.spacing.sm,
  },
});
