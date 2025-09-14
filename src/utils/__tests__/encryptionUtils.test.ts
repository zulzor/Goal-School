import { encryptionUtils } from '../encryptionUtils';

describe('encryptionUtils', () => {
  describe('hashPassword', () => {
    it('должен хэшировать пароли последовательно', () => {
      const password = 'testPassword123';
      const hash1 = encryptionUtils.hashPassword(password);
      const hash2 = encryptionUtils.hashPassword(password);

      expect(hash1).toBe(hash2);
      expect(hash1).not.toBe(password);
    });

    it('должен создавать разные хэши для разных паролей', () => {
      const hash1 = encryptionUtils.hashPassword('password1');
      const hash2 = encryptionUtils.hashPassword('password2');

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('generateSecurityToken', () => {
    it('должен генерировать уникальные токены безопасности', () => {
      const token1 = encryptionUtils.generateSecurityToken();
      const token2 = encryptionUtils.generateSecurityToken();

      expect(token1).not.toBe(token2);
      expect(token1).toHaveLength(32);
    });
  });

  describe('generateCSRFToken', () => {
    it('должен генерировать CSRF токены', () => {
      const token = encryptionUtils.generateCSRFToken();

      expect(token).toHaveLength(32);
    });
  });

  describe('encryptData/decryptData', () => {
    it('должен правильно шифровать и дешифровать данные', () => {
      const originalData = 'Секретное сообщение';
      const key = 'testKey123';

      const encrypted = encryptionUtils.encryptData(originalData, key);
      const decrypted = encryptionUtils.decryptData(encrypted, key);

      expect(decrypted).toBe(originalData);
      expect(encrypted).not.toBe(originalData);
    });

    it('должен создавать разный зашифрованный вывод для одинаковых данных', () => {
      const data = 'Секретное сообщение';
      const key = 'testKey123';

      const encrypted1 = encryptionUtils.encryptData(data, key);
      const encrypted2 = encryptionUtils.encryptData(data, key);

      expect(encrypted1).not.toBe(encrypted2);
    });
  });
});
