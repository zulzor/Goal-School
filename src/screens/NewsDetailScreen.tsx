import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Share } from 'react-native';
import { Card, Title, Paragraph, Button, IconButton, Text, Divider } from 'react-native-paper';
import { useAuth, UserRole } from '../context/LocalStorageAuthContext';
import { COLORS, SIZES } from '../constants';
import { useNotifications } from '../context/NotificationContext';
import { UnderDevelopmentBanner } from '../components/UnderDevelopmentBanner';

interface NewsDetailScreenProps {
  route: any;
  navigation: any;
}

export const NewsDetailScreen: React.FC<NewsDetailScreenProps> = ({ route, navigation }) => {
  const { newsItem } = route.params || {};
  const { user } = useAuth();
  const { markAsRead } = useNotifications();
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Показываем заглушку для экрана в разработке
  if (user?.role === UserRole.MANAGER) {
    return (
      <UnderDevelopmentBanner
        title="Детали новости"
        description="Этот раздел находится в активной разработке. Функционал просмотра деталей новости будет доступен в следующем обновлении."
        onBackPress={() => navigation.goBack()}
      />
    );
  }

  useEffect(() => {
    // Отмечаем новость как прочитанную при открытии
    if (newsItem?.id) {
      markAsRead(newsItem.id);
    }

    // Устанавливаем заголовок экрана
    if (newsItem?.title) {
      navigation.setOptions({ title: newsItem.title });
    }
  }, [newsItem?.id, markAsRead, newsItem?.title, navigation]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${newsItem.title}\n\n${newsItem.content}\n\nИсточник: Футбольная школа Arsenal`,
        title: newsItem.title,
      });
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось поделиться новостью');
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    Alert.alert(
      isBookmarked ? 'Удалено из закладок' : 'Добавлено в закладки',
      isBookmarked ? 'Новость удалена из закладок' : 'Новость добавлена в закладки'
    );
  };

  if (!newsItem) {
    return (
      <View style={styles.container}>
        <Card style={styles.errorCard}>
          <Card.Content>
            <Text style={styles.errorText}>Новость не найдена</Text>
            <Button mode="contained" onPress={() => navigation.goBack()} style={styles.backButton}>
              Назад
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.header}>
            <View style={styles.metaContainer}>
              <Text style={styles.author}>Автор: {newsItem.authorName}</Text>
              <Text style={styles.date}>
                {new Date(newsItem.publishedAt).toLocaleDateString('ru-RU')}
              </Text>
            </View>
            {newsItem.isImportant && (
              <Card style={styles.importantBanner}>
                <Card.Content style={styles.importantContent}>
                  <IconButton icon="alert-circle-outline" size={20} iconColor={COLORS.error} />
                  <Text style={styles.importantText}>Важная новость</Text>
                </Card.Content>
              </Card>
            )}
            <Title style={styles.title}>{newsItem.title}</Title>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.contentCard}>
        <Card.Content>
          <Paragraph style={styles.content}>{newsItem.content}</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.tagsCard}>
        <Card.Content>
          <View style={styles.tagsContainer}>
            {newsItem.tags?.map((tag: string, index: number) => (
              <Card key={index} style={styles.tag}>
                <Card.Content>
                  <Text style={styles.tagText}>{tag}</Text>
                </Card.Content>
              </Card>
            ))}
          </View>
        </Card.Content>
      </Card>

      <View style={styles.actionsContainer}>
        <Button
          mode="outlined"
          onPress={handleShare}
          style={styles.actionButton}
          icon="share-variant">
          Поделиться
        </Button>
        <Button
          mode="outlined"
          onPress={toggleBookmark}
          style={styles.actionButton}
          icon={isBookmarked ? 'bookmark' : 'bookmark-outline'}>
          {isBookmarked ? 'В закладках' : 'В закладки'}
        </Button>
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
    margin: SIZES.padding,
    elevation: 2,
  },
  header: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
    color: COLORS.text,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  author: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  date: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  importantBanner: {
    backgroundColor: COLORS.background,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  importantContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  importantText: {
    color: COLORS.error,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  contentCard: {
    margin: SIZES.padding,
    marginTop: 0,
    elevation: 2,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text,
  },
  tagsCard: {
    margin: SIZES.padding,
    marginTop: 0,
    elevation: 2,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: COLORS.surface,
  },
  tagText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: SIZES.padding,
    marginTop: 0,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  errorCard: {
    margin: SIZES.padding,
    alignItems: 'center',
    elevation: 2,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.error,
    marginBottom: 16,
  },
  backButton: {
    marginTop: 8,
  },
});
