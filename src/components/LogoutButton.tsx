import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Card } from 'react-native-paper';
import { useAuth } from '../context/LocalStorageAuthContext';
import { AnimatedCard } from './AnimatedCard';

interface LogoutButtonProps {
  onLogout?: () => void;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const handleLogout = async () => {
    try {
      console.log('LogoutButton: Начало выхода из аккаунта');
      setLoading(true);

      // Вызываем функцию выхода из контекста аутентификации
      const result = await logout();
      console.log('LogoutButton: Результат выхода', result);

      // Вызываем дополнительный обработчик, если он передан
      if (onLogout) {
        onLogout();
      }

      // Показываем уведомление об успешном выходе
      alert('Вы успешно вышли из аккаунта!');
    } catch (error: any) {
      console.error('LogoutButton: Ошибка выхода', error);
      alert(`Ошибка выхода: ${error.message || 'Неизвестная ошибка'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <View style={styles.logoutSection}>
      <AnimatedCard animationType="scale" delay={1400}>
        <Card style={styles.logoutCard}>
          <Card.Content>
            <Button
              mode="outlined"
              onPress={handleLogout}
              style={styles.logoutButton}
              textColor="#c62828"
              disabled={loading}
              loading={loading}>
              Выйти из аккаунта
            </Button>
          </Card.Content>
        </Card>
      </AnimatedCard>
    </View>
  );
};

const styles = StyleSheet.create({
  logoutSection: {
    marginBottom: 16,
    marginTop: 8,
    marginHorizontal: 16,
    zIndex: 1,
  },
  logoutCard: {
    marginBottom: 8,
    elevation: 2,
  },
  logoutButton: {
    marginTop: 8,
    marginBottom: 8,
    minWidth: 200,
    borderColor: '#c62828',
  },
});
