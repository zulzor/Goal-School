const path = require('path');
const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const webpack = require('webpack');

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
  };

  // Полностью отключаем все Node.js модули
  config.resolve.fallback = {
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

  // Добавляем плагины для игнорирования проблемных модулей
  config.plugins = [
    ...config.plugins,
    new webpack.NormalModuleReplacementPlugin(
      /^mysql2$/,
      path.resolve(__dirname, 'src/utils/mockMysql.js')
    ),
    new webpack.NormalModuleReplacementPlugin(
      /^bcryptjs$/,
      path.resolve(__dirname, 'src/utils/mockBcrypt.js')
    ),
  ];

  // Игнорируем все предупреждения
  config.ignoreWarnings = [...(config.ignoreWarnings || []), () => true];

  return config;
};
