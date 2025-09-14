// Mock для bcryptjs в веб-версии
console.warn('bcryptjs is not available in web version');

// Создаем mock объект, который будет использоваться в веб-версии
const mockBcrypt = {
  hash: (data, salt, callback) => {
    console.warn('bcrypt hash is not available in web version');
    if (callback) {
      callback(new Error('bcrypt is not available in web version'));
    }
    return Promise.reject(new Error('bcrypt is not available in web version'));
  },
  hashSync: (data, salt) => {
    console.warn('bcrypt hashSync is not available in web version');
    return data; // Возвращаем данные без хеширования
  },
  compare: (data, encrypted, callback) => {
    console.warn('bcrypt compare is not available in web version');
    const result = data === encrypted;
    if (callback) {
      callback(null, result);
    }
    return Promise.resolve(result);
  },
  compareSync: (data, encrypted) => {
    console.warn('bcrypt compareSync is not available in web version');
    return data === encrypted;
  },
  genSalt: (rounds, callback) => {
    console.warn('bcrypt genSalt is not available in web version');
    const salt = 'mock-salt';
    if (callback) {
      callback(null, salt);
    }
    return Promise.resolve(salt);
  },
  genSaltSync: rounds => {
    console.warn('bcrypt genSaltSync is not available in web version');
    return 'mock-salt';
  },
};

module.exports = mockBcrypt;
