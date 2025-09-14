import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Title } from 'react-native-paper';
import { GradientCard } from './GradientCard';
import { COLORS } from '../constants';

interface QuickAction {
  title: string;
  subtitle: string;
  icon: string;
  onPress: () => void;
  gradient: [string, string];
  badge?: string; // Добавляем возможность отображать бейдж
}

interface QuickActionsProps {
  actions: QuickAction[];
  title?: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  title = 'Быстрые действия',
}) => {
  return (
    <View style={styles.container}>
      <Title style={styles.title}>{title}</Title>
      <View style={styles.actionsGrid}>
        {actions.map((action, index) => (
          <View key={index} style={styles.actionContainer}>
            <GradientCard
              title={action.title}
              subtitle={action.subtitle}
              icon={action.icon}
              onPress={action.onPress}
              gradientColors={action.gradient}
              style={styles.actionCard}
            />
            {action.badge && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{action.badge}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionContainer: {
    width: '48%',
    marginBottom: 16,
  },
  actionCard: {
    // Стили перенесены в actionContainer
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  badgeText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
