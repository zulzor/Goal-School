// Mock для react-native-gesture-handler
const React = require('react');

// Создаем mock-компоненты
const PanGestureHandler = ({ children }) => React.createElement('div', {}, children);
const TapGestureHandler = ({ children }) => React.createElement('div', {}, children);
const State = { BEGAN: 'BEGAN', ACTIVE: 'ACTIVE', END: 'END', FAILED: 'FAILED' };

// Экспортируем mock-компоненты и объекты
module.exports = {
  PanGestureHandler,
  TapGestureHandler,
  State,
  gestureHandlerRootHOC: (component) => component,
};