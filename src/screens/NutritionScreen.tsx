import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Platform, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { useAuth, UserRole } from '../context/LocalStorageAuthContext';
import { COLORS } from '../constants';
import { AnimatedCard } from '../components/AnimatedCard';
import { ArsenalBanner } from '../components/ArsenalBanner';
import { UnderDevelopmentBanner } from '../components/UnderDevelopmentBanner';
import { ArsenalButton } from '../components/ArsenalButton';

interface NutritionScreenProps {
  navigation: any;
}

export const NutritionScreen: React.FC<NutritionScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Простая загрузка данных
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const isAdmin = user?.role === UserRole.MANAGER;

  // Если админ, показываем заглушку
  if (isAdmin) {
    return (
      <UnderDevelopmentBanner
        title="Питание юного футболиста"
        description="Этот раздел находится в активной разработке. Функционал управления питанием будет доступен в следующем обновлении."
        onBackPress={() => navigation.goBack()}
      />
    );
  }

  // Если загрузка
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Загрузка...</Text>
      </View>
    );
  }

  // Если ошибка
  if (error) {
    return (
      <View style={styles.container}>
        <AnimatedCard animationType="fade" delay={0}>
          <Card style={styles.errorCard}>
            <Card.Content>
              <Title style={styles.errorTitle}>Ошибка загрузки</Title>
              <Paragraph style={styles.errorText}>{error}</Paragraph>
              <ArsenalButton
                title="Повторить попытку"
                variant="primary"
                onPress={() => window.location.reload()}
                style={styles.retryButton}
              />
            </Card.Content>
          </Card>
        </AnimatedCard>
      </View>
    );
  }

  // Основной контент
  return (
    <ScrollView style={styles.container}>
      <ArsenalBanner
        title="Питание юного футболиста"
        subtitle="Рекомендации по питанию для юных спортсменов"
      />

      <AnimatedCard animationType="scale" delay={0}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Основные принципы питания</Title>
            <Paragraph style={styles.paragraph}>
              Правильное питание играет ключевую роль в спортивных достижениях юных футболистов. Оно
              обеспечивает энергию для тренировок, способствует восстановлению после нагрузок и
              поддерживает здоровье в целом.
            </Paragraph>

            <Title style={styles.sectionTitle}>Белки</Title>
            <Paragraph style={styles.paragraph}>
              Белки необходимы для роста и восстановления мышц. Источники: куриная грудка, рыба,
              яйца, молочные продукты, бобовые.
            </Paragraph>

            <Title style={styles.sectionTitle}>Углеводы</Title>
            <Paragraph style={styles.paragraph}>
              Углеводы обеспечивают энергию для тренировок. Предпочтение следует отдавать сложным
              углеводам: овсянка, гречка, киноа, цельнозерновой хлеб.
            </Paragraph>

            <Title style={styles.sectionTitle}>Жиры</Title>
            <Paragraph style={styles.paragraph}>
              Полезные жиры необходимы для здоровья. Источники: авокадо, орехи, оливковое масло,
              жирная рыба (лосось, скумбрия).
            </Paragraph>

            <Title style={styles.sectionTitle}>Витамины и минералы</Title>
            <Paragraph style={styles.paragraph}>
              Разнообразные фрукты и овощи обеспечивают необходимые витамины и минералы. Особенно
              важны витамины D, C, железо и кальций.
            </Paragraph>

            <Title style={styles.sectionTitle}>Гидратация</Title>
            <Paragraph style={styles.paragraph}>
              Питьевой режим: за 2 часа до тренировки - 500 мл воды, во время тренировки - 150-250
              мл каждые 15-20 минут, после тренировки - 150% от потерянной массы тела.
            </Paragraph>

            <ArsenalButton
              title="Показать индивидуальный план питания"
              variant="primary"
              onPress={() => alert('Функция в разработке')}
              style={styles.mainButton}
            />
          </Card.Content>
        </Card>
      </AnimatedCard>

      <AnimatedCard animationType="slide" delay={200}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Перед тренировкой</Title>
            <Paragraph style={styles.paragraph}>
              За 2-3 часа до тренировки: каша с фруктами или бутерброд с вареным яйцом.
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              За 30 минут до тренировки: банан или энергетический батончик.
            </Paragraph>
          </Card.Content>
        </Card>
      </AnimatedCard>

      <AnimatedCard animationType="slide" delay={400}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>После тренировки</Title>
            <Paragraph style={styles.paragraph}>
              В течение 30 минут после тренировки: белково-углеводный коктейль или йогурт с ягодами.
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              Через 1-2 часа: полноценный прием пищи с белками и углеводами.
            </Paragraph>
          </Card.Content>
        </Card>
      </AnimatedCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  errorCard: {
    margin: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  errorTitle: {
    textAlign: 'center',
    color: COLORS.error,
    marginBottom: 16,
  },
  errorText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  retryButton: {
    marginTop: 16,
  },
  card: {
    marginBottom: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: COLORS.text,
  },
  paragraph: {
    marginBottom: 16,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  mainButton: {
    marginTop: 16,
  },
});
