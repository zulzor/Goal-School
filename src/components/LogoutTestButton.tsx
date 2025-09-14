import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useAuth } from '../context/LocalStorageAuthContext';

export const LogoutTestButton: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      console.log('LogoutTestButton: Начало выхода из аккаунта');
      const result = await logout();
      console.log('LogoutTestButton: Результат выхода', result);

      // Показываем уведомление об успешном выходе
      alert('Вы успешно вышли из аккаунта!');
    } catch (error: any) {
      console.error('LogoutTestButton: Ошибка выхода', error);
      alert(`Ошибка выхода: ${error.message || 'Неизвестная ошибка'}`);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Тест выхода из аккаунта</Text>
      <Text style={styles.description}>Нажмите кнопку ниже для тестирования выхода</Text>
      <Button mode="contained" onPress={handleLogout} style={styles.button} buttonColor="#c62828">
        Выйти из аккаунта (Тест)
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffebee',
    margin: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#c62828',
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
    color: '#666',
  },
  button: {
    marginTop: 8,
  },
});
