import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { COLORS } from '../constants';
import { useAuth, UserRole } from '../context/LocalStorageAuthContext';
import { UnderDevelopmentBanner } from '../components/UnderDevelopmentBanner';

export const DebugScreen: React.FC = () => {
  const { user } = useAuth();

  // Показываем заглушку для экрана в разработке
  if (user?.role === UserRole.MANAGER) {
    return (
      <UnderDevelopmentBanner
        title="Экран отладки"
        description="Этот раздел находится в активной разработке. Функционал отладки будет доступен в следующем обновлении."
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title>Экран отладки</Title>
          <Paragraph>Проверка отображения базовых компонентов</Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.section}>
        <Title style={styles.sectionTitle}>Тест отображения</Title>
        <Card style={styles.testCard}>
          <Card.Content>
            <Title>Тестовая карточка</Title>
            <Paragraph>Если вы видите этот текст, значит экран отображается правильно</Paragraph>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={() => Alert.alert('Тест', 'Кнопка работает корректно')}
          style={styles.testButton}>
          Тестовая кнопка
        </Button>
      </View>

      <View style={styles.section}>
        <Title style={styles.sectionTitle}>Информация</Title>
        <Card style={styles.infoCard}>
          <Card.Content>
            <Paragraph>
              Этот экран используется для проверки базового отображения компонентов.
            </Paragraph>
            <Paragraph style={styles.infoText}>
              Если вы видите этот текст, значит приложение работает корректно.
            </Paragraph>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerCard: {
    margin: 16,
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: COLORS.text,
  },
  testCard: {
    marginBottom: 16,
  },
  testButton: {
    marginVertical: 8,
  },
  infoCard: {
    marginBottom: 16,
  },
  infoText: {
    marginTop: 8,
    color: COLORS.textSecondary,
  },
});
