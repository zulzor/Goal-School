import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Divider, List } from 'react-native-paper';
import { AnimatedCard } from './AnimatedCard';
import { COLORS } from '../constants';

interface ActionItem {
  title: string;
  description: string;
  icon: string;
  onPress: () => void;
  badgeText?: string; // Добавляем возможность отображать бейдж
}

interface UserActionsProps {
  actions: ActionItem[];
  title?: string;
}

export const UserActions: React.FC<UserActionsProps> = ({ actions, title = 'Действия' }) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>{title}</Title>
        {actions.map((action, index) => (
          <AnimatedCard key={index} animationType="slide" delay={index * 100}>
            <React.Fragment key={index}>
              <List.Item
                title={action.title}
                description={action.description}
                left={props => <List.Icon {...props} icon={action.icon} />}
                right={props => (
                  <View style={styles.rightContainer}>
                    {action.badgeText && (
                      <View style={styles.badge}>
                        <List.Icon {...props} icon="star" size={16} style={styles.badgeIcon} />
                        <List.Subheader style={styles.badgeText}>{action.badgeText}</List.Subheader>
                      </View>
                    )}
                    <List.Icon {...props} icon="chevron-right" />
                  </View>
                )}
                onPress={action.onPress}
                style={styles.actionItem}
              />
              {index < actions.length - 1 && <Divider />}
            </React.Fragment>
          </AnimatedCard>
        ))}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    marginBottom: 8,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: COLORS.text,
  },
  actionItem: {
    paddingVertical: 8,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  badgeIcon: {
    margin: 0,
  },
  badgeText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
    margin: 0,
  },
});
