import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './src/navigation/AppNavigator.web';
import { COLORS } from './src/constants';

// Импортируем все необходимые контексты
import { DatabaseProvider } from './src/context/DatabaseContext';
import { LocalStorageAuthProvider } from './src/context/LocalStorageAuthContext';
import { BranchProvider } from './src/context/BranchContext';
import { NetworkProvider } from './src/context/NetworkContext';
import { NotificationProvider } from './src/context/NotificationContext';
import { TaskProvider } from './src/context/TaskContext';

// Импортируем компонент для отображения офлайн статуса
import { OfflineBanner } from './src/components/OfflineBanner';

// Компонент, который выбирает правильный провайдер аутентификации в зависимости от типа базы данных
const AuthProviderSelector: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Для веб-версии всегда используем LocalStorageAuthProvider
  return <LocalStorageAuthProvider>{children}</LocalStorageAuthProvider>;
};

export default function App() {
  return (
    <PaperProvider>
      <NetworkProvider>
        <TaskProvider>
          <DatabaseProvider>
            <BranchProvider>
              <AuthProviderSelector>
                <NotificationProvider>
                  <NavigationContainer
                    theme={{
                      dark: false,
                      colors: {
                        primary: COLORS.primary,
                        background: COLORS.background,
                        card: COLORS.surface,
                        text: COLORS.text,
                        border: COLORS.border,
                        notification: COLORS.accent,
                      },
                      fonts: {
                        regular: {
                          fontFamily: 'System',
                          fontWeight: 'normal',
                        },
                        medium: {
                          fontFamily: 'System',
                          fontWeight: 'normal',
                        },
                        bold: {
                          fontFamily: 'System',
                          fontWeight: 'normal',
                        },
                        heavy: {
                          fontFamily: 'System',
                          fontWeight: 'normal',
                        },
                      },
                    }}>
                    <View style={styles.container}>
                      <OfflineBanner />
                      <AppNavigator />
                    </View>
                  </NavigationContainer>
                </NotificationProvider>
              </AuthProviderSelector>
            </BranchProvider>
          </DatabaseProvider>
        </TaskProvider>
      </NetworkProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});