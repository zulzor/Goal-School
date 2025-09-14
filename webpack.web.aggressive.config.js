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
    // Агрессивно игнорируем серверные модули
    mysql2: path.resolve(__dirname, 'src/utils/mockMysql.js'),
    'mysql2/promise': path.resolve(__dirname, 'src/utils/mockMysql.js'),
    bcryptjs: path.resolve(__dirname, 'src/utils/mockBcrypt.js'),
    // Дополнительные алиасы для проблемных модулей
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

  // Полностью отключаем все Node.js полифилы
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

  // Добавляем плагины
  config.plugins = [
    ...config.plugins,
    new webpack.DefinePlugin({
      __DEV__: env.mode !== 'production',
    }),
    // Игнорируем все предупреждения
    new webpack.IgnorePlugin({
      resourceRegExp: /^mysql2$/,
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^bcryptjs$/,
    }),
  ];

  // Агрессивно игнорируем все предупреждения
  config.ignoreWarnings = [
    ...(config.ignoreWarnings || []),
    // Игнорируем все ошибки компиляции
    () => true,
  ];

  // Оптимизация для production
  if (env && env.mode === 'production') {
    // Уменьшаем размер бандла
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    };
  }

  return config;
};
