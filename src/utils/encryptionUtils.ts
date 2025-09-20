// Утилита для шифрования и дешифрования данных
// В реальном приложении здесь будет использоваться более безопасный метод шифрования

export const encryptionUtils = {
  // Простая функция для хеширования паролей (в реальном приложении использовать bcrypt или аналоги)
  hashPassword: (password: string): string => {
    // В реальном приложении использовать bcrypt, scrypt или argon2
    // Это простая реализация только для демонстрации
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Преобразование в 32-bit integer
    }
    return `hash_${Math.abs(hash)}_${password.length}`;
  },

  // Функция для генерации токена безопасности
  generateSecurityToken: (): string => {
    return (
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    );
  },

  // Функция для шифрования чувствительных данных
  encryptData: (data: string, key: string): string => {
    // В реальном приложении использовать AES или другие надежные алгоритмы
    // Это простая реализация только для демонстрации
    let result = '';
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(result); // base64 encode
  },

  // Функция для дешифрования данных
  decryptData: (encryptedData: string, key: string): string => {
    // В реальном приложении использовать AES или другие надежные алгоритмы
    // Это простая реализация только для демонстрации
    const data = atob(encryptedData); // base64 decode
    let result = '';
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  },

  // Функция для генерации CSRF токена
  generateCSRFToken: function (): string {
    return this.generateSecurityToken();
  },

  // Функция для валидации CSRF токена
  validateCSRFToken: (token: string, expectedToken: string): boolean => {
    return token === expectedToken;
  },
};
