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
    // Полностью игнорируем серверные модули
    mysql2: false,
    'mysql2/promise': false,
    bcryptjs: false,
  };

  // Полностью отключаем все Node.js полифилы
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: false,
    stream: false,
    buffer: false,
    url: false,
    path: false,
    util: false,
    vm: false,
    zlib: false,
    timers: false,
    fs: false,
    net: false,
    tls: false,
    child_process: false,
    dns: false,
    http: false,
    https: false,
    os: false,
    assert: false,
    querystring: false,
    punycode: false,
  };

  // Добавляем плагины
  config.plugins = [
    ...config.plugins,
    new webpack.DefinePlugin({
      __DEV__: env.mode !== 'production',
    }),
  ];

  // Игнорируем все предупреждения о модулях, которые не могут быть разрешены
  config.ignoreWarnings = [
    ...(config.ignoreWarnings || []),
    // Игнорируем все ошибки, связанные с Node.js модулями
    /Module not found: Can't resolve '.*' in '.*node_modules.*'/,
    // Игнорируем специфические ошибки
    /Module not found: Can't resolve 'react-native-reanimated'/,
    /Module not found: Can't resolve '@react-native-vector-icons\/material-design-icons'/,
    /Module not found: Can't resolve 'crypto'/,
    /Module not found: Can't resolve 'timers'/,
    /Module not found: Can't resolve 'stream'/,
    /Module not found: Can't resolve 'zlib'/,
    /Module not found: Can't resolve 'mysql2'/,
    /Module not found: Can't resolve 'bcryptjs'/,
    /Module not found: Can't resolve 'http'/,
    /Module not found: Can't resolve 'https'/,
    /Module not found: Can't resolve 'os'/,
    /Module not found: Can't resolve 'assert'/,
    /Module not found: Can't resolve 'fs'/,
    /Module not found: Can't resolve 'net'/,
    /Module not found: Can't resolve 'tls'/,
    /Module not found: Can't resolve 'child_process'/,
    /Module not found: Can't resolve 'dns'/,
    /Module not found: Can't resolve 'path'/,
    /Module not found: Can't resolve 'url'/,
    /Module not found: Can't resolve 'util'/,
    /Module not found: Can't resolve 'vm'/,
    /Module not found: Can't resolve 'querystring'/,
    /Module not found: Can't resolve 'punycode'/,
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
