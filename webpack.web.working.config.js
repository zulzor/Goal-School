const path = require('path');
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Для веб-версии устанавливаем правильный publicPath
  if (env && env.mode === 'production') {
    config.output.publicPath = './';
  }

  // Добавляем алиасы для веб-совместимых модулей
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native': 'react-native-web',
    'react-native-vector-icons': '@expo/vector-icons',
    'react-native-vector-icons/MaterialIcons': '@expo/vector-icons/MaterialIcons',
    'react-native-vector-icons/MaterialCommunityIcons': '@expo/vector-icons/MaterialCommunityIcons',
    'react-native-vector-icons/Ionicons': '@expo/vector-icons/Ionicons',
    'react-native-vector-icons/FontAwesome': '@expo/vector-icons/FontAwesome',
    // Используем mock модули для серверных зависимостей
    mysql2: path.resolve(__dirname, 'src/utils/mockMysql.js'),
    'mysql2/promise': path.resolve(__dirname, 'src/utils/mockMysql.js'),
    bcryptjs: path.resolve(__dirname, 'src/utils/mockBcrypt.js'),
  };

  // Полностью отключаем проблемные модули
  config.resolve.fallback = {
    ...config.resolve.fallback,
    stream: false,
    crypto: false,
    timers: false,
    zlib: false,
    http: false,
    https: false,
    fs: false,
    net: false,
    tls: false,
    child_process: false,
    dns: false,
    os: false,
    assert: false,
    util: false,
    vm: false,
    path: false,
    url: false,
    querystring: false,
    punycode: false,
  };

  // Игнорируем все предупреждения
  config.ignoreWarnings = [...(config.ignoreWarnings || []), () => true];

  return config;
};
