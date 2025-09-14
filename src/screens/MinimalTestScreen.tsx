import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth, UserRole } from '../context/LocalStorageAuthContext';
import { UnderDevelopmentBanner } from '../components/UnderDevelopmentBanner';

export const MinimalTestScreen: React.FC = () => {
  const { user } = useAuth();

  // Показываем заглушку для экрана в разработке
  if (user?.role === UserRole.MANAGER) {
    return (
      <UnderDevelopmentBanner
        title="Минимальный тест"
        description="Этот раздел находится в активной разработке. Функционал минимального теста будет доступен в следующем обновлении."
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minimal Test Screen</Text>
      <Text style={styles.text}>If you can see this text, the app is working!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
