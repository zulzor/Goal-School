// Mock для bcryptjs
const mockBcrypt = {
  hash: (data, salt, callback) => {
    console.warn('bcrypt hash mock:', data, salt);
    const hashed = `mock_hashed_${data}`;
    if (callback) callback(null, hashed);
    return Promise.resolve(hashed);
  },
  
  hashSync: (data, salt) => {
    console.warn('bcrypt hashSync mock:', data, salt);
    return `mock_hashed_${data}`;
  },
  
  compare: (data, encrypted, callback) => {
    console.warn('bcrypt compare mock:', data, encrypted);
    const result = data === encrypted.replace('mock_hashed_', '');
    if (callback) callback(null, result);
    return Promise.resolve(result);
  },
  
  compareSync: (data, encrypted) => {
    console.warn('bcrypt compareSync mock:', data, encrypted);
    return data === encrypted.replace('mock_hashed_', '');
  },
  
  genSalt: (rounds, callback) => {
    console.warn('bcrypt genSalt mock:', rounds);
    const salt = 'mock_salt';
    if (callback) callback(null, salt);
    return Promise.resolve(salt);
  },
  
  genSaltSync: (rounds) => {
    console.warn('bcrypt genSaltSync mock:', rounds);
    return 'mock_salt';
  },
};

module.exports = mockBcrypt;