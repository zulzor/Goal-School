// Mock для react-native-svg
const React = require('react');

// Создаем mock-компоненты
const Svg = ({ children, ...props }) => React.createElement('svg', props, children);
const Circle = (props) => React.createElement('circle', props);
const Rect = (props) => React.createElement('rect', props);
const Path = (props) => React.createElement('path', props);
const Line = (props) => React.createElement('line', props);
const Text = (props) => React.createElement('text', props);
const G = ({ children, ...props }) => React.createElement('g', props, children);

// Экспортируем mock-компоненты
module.exports = {
  Svg,
  Circle,
  Rect,
  Path,
  Line,
  Text,
  G,
};