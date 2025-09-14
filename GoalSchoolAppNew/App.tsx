import React, { useEffect } from 'react';
import { View, ActivityIndicator, Platform, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider } from './src/context/SupabaseAuthContext';
import { NotificationProvider } from './src/context/NotificationContext';
import { SecurityProvider } from './src/context/SecurityContext';
import { NetworkProvider } from './src/context/NetworkContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { COLORS } from './src/constants';
import { supabase } from './src/config/supabase';
import { useNewsNotifications } from './src/hooks/useNewsNotifications';

const theme = {
  colors: {
    primary: COLORS.primary,
    accent: COLORS.secondary,
    background: COLORS.background,
    surface: COLORS.surface,
    text: COLORS.text,
    disabled: COLORS.textSecondary,
    placeholder: COLORS.textSecondary,
    backdrop: 'rgba(0, 0, 0, 0.5)',
    onSurface: COLORS.text,
    notification: COLORS.secondary,
  },
};

const LoadingScreen = () => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: COLORS.background,
    }}>
    <ActivityIndicator size="large" color={COLORS.primary} />
  </View>
);

// Функция для проверки подключения к Supabase
const checkSupabaseConnection = async () => {
  try {
    console.log('🔄 Проверка подключения к Supabase...');

    // Тест подключения к базе данных
    const { data, error } = await supabase.from('profiles').select('count').limit(1);

    if (error) {
      console.error('❌ Ошибка подключения к Supabase:', error);
      Alert.alert(
        'Ошибка подключения',
        'Не удалось подключиться к базе данных. Проверьте настройки подключения в файле .env'
      );
      return false;
    }

    console.log('✅ Подключение к Supabase успешно!');
    return true;
  } catch (error) {
    console.error('❌ Критическая ошибка:', error);
    Alert.alert('Критическая ошибка', 'Произошла критическая ошибка при подключении к Supabase');
    return false;
  }
};

const AppContent: React.FC = () => {
  // Проверяем подключение к Supabase при запуске приложения
  useEffect(() => {
    checkSupabaseConnection();
  }, []);

  // Используем хук для проверки новых важных новостей
  useNewsNotifications();

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <NavigationContainer
            fallback={<LoadingScreen />}
            onReady={() => {
              console.log('Navigation is ready');
            }}>
            <AppNavigator />
            <StatusBar style="light" backgroundColor={COLORS.primary} />
          </NavigationContainer>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default function App() {
  // Добавляем веб-совместимые стили для прокрутки
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Добавляем стили для правильной прокрутки на веб
      const style = document.createElement('style');
      style.textContent = `
        html, body {
          height: 100%;
          margin: 0;
          padding: 0;
          overflow: auto;
        }
        #root {
          height: 100%;
          overflow: auto;
        }
        div[style*="flex: 1"] {
          overflow: auto;
          min-height: 100vh;
        }
        body * {
          -webkit-overflow-scrolling: touch;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <SecurityProvider>
      <NetworkProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </NetworkProvider>
    </SecurityProvider>
  );
}
