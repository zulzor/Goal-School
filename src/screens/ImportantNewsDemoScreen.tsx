import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Text, IconButton } from 'react-native-paper';
import { COLORS, SIZES } from '../constants';
import { useNotifications } from '../context/NotificationContext';
import { useImportantNewsNotifications } from '../hooks/useImportantNewsNotifications';
import { useAuth, UserRole } from '../context/LocalStorageAuthContext';
import { UnderDevelopmentBanner } from '../components/UnderDevelopmentBanner';

export const ImportantNewsDemoScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { notifications, addNotification, clearAllNotifications } = useNotifications();
  const { importantNews, dismissNews, checkForNewImportantNews } = useImportantNewsNotifications();
  const [showBanner, setShowBanner] = useState(false);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const { user } = useAuth();

  // Показываем заглушку для экрана в разработке
  if (user?.role === UserRole.MANAGER) {
    return (
      <UnderDevelopmentBanner
        title="Демонстрация важных новостей"
        description="Этот раздел находится в активной разработке. Функционал демонстрации важных новостей будет доступен в следующем обновлении."
        onBackPress={() => navigation.goBack()}
      />
    );
  }

  const handleAddTestNotification = () => {
    addNotification({
      title: 'Тестовое уведомление',
      message: 'Это тестовое уведомление для проверки функционала',
      isImportant: false,
      type: 'info',
    });
  };

  const handleAddImportantNotification = () => {
    addNotification({
      title: 'Важное объявление',
      message: 'Срочное объявление о переносе тренировки',
      isImportant: true,
      type: 'warning',
    });
  };

  const handleShowBanner = () => {
    if (importantNews.length > 0) {
      setShowBanner(true);
      setCurrentNewsIndex(0);
    } else {
      Alert.alert('Нет важных новостей', 'Добавьте важные новости для демонстрации баннера');
    }
  };

  const handleNextNews = () => {
    if (currentNewsIndex < importantNews.length - 1) {
      setCurrentNewsIndex(currentNewsIndex + 1);
    } else {
      setCurrentNewsIndex(0);
    }
  };

  const handlePrevNews = () => {
    if (currentNewsIndex > 0) {
      setCurrentNewsIndex(currentNewsIndex - 1);
    } else {
      setCurrentNewsIndex(importantNews.length - 1);
    }
  };

  const currentNews = importantNews[currentNewsIndex];

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title style={styles.title}>Демонстрация важных новостей</Title>
          <Paragraph style={styles.description}>
            Экран для тестирования функционала уведомлений о важных новостях
          </Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Тестовые уведомления</Title>
          <View style={styles.buttonRow}>
            <Button mode="outlined" onPress={handleAddTestNotification} style={styles.button}>
              Добавить обычное
            </Button>
            <Button mode="contained" onPress={handleAddImportantNotification} style={styles.button}>
              Добавить важное
            </Button>
          </View>
          <Button mode="text" onPress={clearAllNotifications} textColor={COLORS.error}>
            Очистить все уведомления
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Важные новости</Title>
          <Paragraph style={styles.stats}>Всего важных новостей: {importantNews.length}</Paragraph>
          <Button mode="contained" onPress={checkForNewImportantNews} style={styles.actionButton}>
            Проверить новости
          </Button>
          <Button
            mode="outlined"
            onPress={handleShowBanner}
            style={styles.actionButton}
            disabled={importantNews.length === 0}>
            Показать баннер
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Статистика уведомлений</Title>
          <Paragraph style={styles.stats}>Всего уведомлений: {notifications.length}</Paragraph>
          <Paragraph style={styles.stats}>
            Непрочитанных: {notifications.filter(n => !n.read).length}
          </Paragraph>
          <Paragraph style={styles.stats}>
            Важных: {notifications.filter(n => n.isImportant).length}
          </Paragraph>
        </Card.Content>
      </Card>

      {showBanner && currentNews && (
        <View style={styles.bannerContainer}>
          <View style={styles.bannerHeader}>
            <Text style={styles.bannerTitle}>Демонстрация баннера</Text>
            <IconButton icon="close" onPress={() => setShowBanner(false)} />
          </View>
          <Card style={styles.bannerCard}>
            <Card.Content>
              <View style={styles.newsNavigation}>
                <IconButton
                  icon="chevron-left"
                  onPress={handlePrevNews}
                  disabled={importantNews.length <= 1}
                />
                <Text style={styles.newsCounter}>
                  {currentNewsIndex + 1} из {importantNews.length}
                </Text>
                <IconButton
                  icon="chevron-right"
                  onPress={handleNextNews}
                  disabled={importantNews.length <= 1}
                />
              </View>
              <Title style={styles.newsTitle}>{currentNews.title}</Title>
              <Paragraph style={styles.newsContent}>{currentNews.excerpt}</Paragraph>
              <Button
                mode="contained"
                onPress={() => {
                  Alert.alert('Переход', `Переход к новости: ${currentNews.title}`);
                }}
                style={styles.detailsButton}>
                Подробнее
              </Button>
              <Button
                mode="text"
                onPress={() => {
                  dismissNews(currentNews.id);
                  Alert.alert('Отклонено', `Новость "${currentNews.title}" отклонена`);
                  setShowBanner(false);
                }}
                textColor={COLORS.error}>
                Больше не показывать
              </Button>
            </Card.Content>
          </Card>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerCard: {
    margin: SIZES.padding,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: COLORS.textSecondary,
  },
  sectionCard: {
    margin: SIZES.padding,
    marginBottom: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  actionButton: {
    marginBottom: 12,
  },
  stats: {
    fontSize: 16,
    marginBottom: 8,
  },
  bannerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: SIZES.padding,
    marginBottom: 8,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  bannerCard: {
    width: '90%',
    maxWidth: 500,
    elevation: 8,
  },
  newsNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  newsCounter: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  newsContent: {
    marginBottom: 16,
  },
  detailsButton: {
    marginBottom: 8,
  },
});
