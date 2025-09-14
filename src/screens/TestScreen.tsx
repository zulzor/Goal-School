import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth, UserRole } from '../context/LocalStorageAuthContext';
import { UnderDevelopmentBanner } from '../components/UnderDevelopmentBanner';

export const TestScreen: React.FC = () => {
  const { user } = useAuth();

  // Показываем заглушку для экрана в разработке
  if (user?.role === UserRole.MANAGER) {
    return (
      <UnderDevelopmentBanner
        title="Тестовый экран"
        description="Этот раздел находится в активной разработке. Функционал тестового экрана будет доступен в следующем обновлении."
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Test Screen</Text>
      <Text style={styles.text}>If you can see this, the app is working!</Text>
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
  text: {
    fontSize: 20,
    marginBottom: 10,
  },
});
