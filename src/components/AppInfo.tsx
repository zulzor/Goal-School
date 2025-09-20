import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Title, List, Divider } from 'react-native-paper';
import { AnimatedCard } from './AnimatedCard';
import { COLORS } from '../constants';

interface AppInfoItem {
  title: string;
  description: string;
  icon: string;
  onPress?: () => void;
}

interface AppInfoProps {
  infoItems: AppInfoItem[];
  title?: string;
}

export const AppInfo: React.FC<AppInfoProps> = ({ infoItems, title = 'О приложении' }) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>{title}</Title>
        {infoItems.map((item, index) => (
          <AnimatedCard key={index} animationType="slide" delay={index * 100}>
            <React.Fragment key={index}>
              <List.Item
                title={item.title}
                description={item.description}
                left={props => <List.Icon {...props} icon={item.icon} />}
                right={
                  item.onPress ? props => <List.Icon {...props} icon="chevron-right" /> : undefined
                }
                onPress={item.onPress}
                style={styles.infoItem}
              />
              {index < infoItems.length - 1 && <Divider />}
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
  infoItem: {
    paddingVertical: 8,
  },
});
