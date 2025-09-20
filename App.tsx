import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { DatabaseProvider } from './src/context/DatabaseContext';
import { LocalStorageAuthProvider } from './src/context/LocalStorageAuthContext';
import { MySQLAuthProvider } from './src/context/MySQLAuthContext';
import { BranchProvider } from './src/context/BranchContext'; // Добавляем импорт провайдера филиалов
import { AppNavigator } from './src/navigation/AppNavigator';
import { useDatabase } from './src/context/DatabaseContext';
import { NetworkProvider } from './src/context/NetworkContext';
import { NotificationProvider } from './src/context/NotificationContext';
import { TaskProvider } from './src/context/TaskContext';
import { COLORS } from './src/constants';

// Компонент, который выбирает правильный провайдер аутентификации в зависимости от типа базы данных
const AuthProviderSelector: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { databaseType } = useDatabase();

  if (databaseType === 'mysql') {
    return <MySQLAuthProvider>{children}</MySQLAuthProvider>;
  }

  return <LocalStorageAuthProvider>{children}</LocalStorageAuthProvider>;
};

export default function App() {
  return (
    <PaperProvider>
      <NetworkProvider>
        <TaskProvider>
          <DatabaseProvider>
            <BranchProvider>
              {' '}
              {/* Добавляем провайдер филиалов */}
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
                    <AppNavigator />
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
