// Mock для react-native-safe-area-context
const React = require('react');

// Создаем mock-компоненты
const SafeAreaProvider = ({ children }) => React.createElement('div', {}, children);
const SafeAreaView = ({ children }) => React.createElement('div', {}, children);

// Mock для хуков
const useSafeAreaInsets = () => ({
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
});

// Экспортируем mock-компоненты и хуки
module.exports = {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
};