import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuth, UserRole } from '../context/LocalStorageAuthContext'; // Добавляем UserRole
import { COLORS } from '../constants';
import { AchievementsList } from '../components/AchievementsList';
import { Achievement } from '../types';
import { ArsenalBanner } from '../components/ArsenalBanner';
import { AnimatedCard } from '../components/AnimatedCard';
import AchievementService from '../services/AchievementService';
import { AchievementProgress } from '../components/AchievementProgress';
import { AchievementSummary } from '../components/AchievementSummary';
import { AchievementDetail } from '../components/AchievementDetail';
import { UnderDevelopmentBanner } from '../components/UnderDevelopmentBanner'; // Добавляем импорт

export const StudentAchievementsScreen: React.FC = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  // Показываем заглушку для экрана в разработке
  if (user?.role !== UserRole.CHILD && user?.role !== UserRole.PARENT) {
    return (
      <UnderDevelopmentBanner
        title="Достижения ученика"
        description="Этот раздел находится в активной разработке. Функционал просмотра достижений будет доступен в следующем обновлении."
      />
    );
  }

  // Имитация загрузки достижений
  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      // Загружаем достижения через сервис
      const data = await AchievementService.getStudentAchievements(user?.id || '');
      setAchievements(data);
    } catch (error) {
      console.error('Ошибка загрузки достижений:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAchievementPress = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
  };

  const handleBackToList = () => {
    setSelectedAchievement(null);
  };

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalCount = achievements.length;

  // Если выбрано достижение, показываем детали
  if (selectedAchievement) {
    return (
      <View style={styles.container}>
        <ArsenalBanner title="Детали достижения" subtitle={selectedAchievement.title} />
        <AnimatedCard animationType="fade" delay={100}>
          <AchievementDetail achievement={selectedAchievement} onBack={handleBackToList} />
        </AnimatedCard>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <ArsenalBanner
          title="Достижения"
          subtitle="Войдите в систему, чтобы видеть свои достижения"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ArsenalBanner title="Мои достижения" subtitle={`Ученик: ${user.name}`} />

      <AnimatedCard animationType="fade" delay={100}>
        <AchievementProgress unlocked={unlockedCount} total={totalCount} title="Общий прогресс" />
      </AnimatedCard>

      <AnimatedCard animationType="fade" delay={200}>
        <AchievementSummary achievements={achievements} />
      </AnimatedCard>

      <AnimatedCard animationType="fade" delay={300}>
        <AchievementsList achievements={achievements} onAchievementPress={handleAchievementPress} />
      </AnimatedCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
