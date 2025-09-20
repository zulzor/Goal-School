import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkUsers = async () => {
  try {
    const usersData = await AsyncStorage.getItem('app_users');
    const users = usersData ? JSON.parse(usersData) : [];

    console.log('Существующие пользователи:');
    users.forEach((user: any) => {
      console.log(`- Email: ${user.email}, Роль: ${user.role}, Хэш пароля: ${user.passwordHash}`);
    });

    return users;
  } catch (error) {
    console.error('Ошибка при проверке пользователей:', error);
    return [];
  }
};
