import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Title, Switch, Divider } from 'react-native-paper';
import { AnimatedCard } from './AnimatedCard';
import { COLORS } from '../constants';

interface NotificationSetting {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

interface NotificationSettingsProps {
  settings: NotificationSetting[];
  title?: string;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  settings,
  title = 'Уведомления',
}) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>{title}</Title>
        {settings.map((setting, index) => (
          <AnimatedCard key={index} animationType="slide" delay={index * 100}>
            <React.Fragment key={index}>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>{setting.title}</Text>
                  <Text style={styles.settingDescription}>{setting.description}</Text>
                </View>
                <Switch value={setting.value} onValueChange={setting.onValueChange} />
              </View>
              {index < settings.length - 1 && <Divider style={styles.divider} />}
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
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  divider: {
    marginVertical: 8,
  },
});
