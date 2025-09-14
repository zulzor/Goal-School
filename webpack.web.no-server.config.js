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
    // Игнорируем серверные модули
    mysql2: path.resolve(__dirname, 'src/utils/mockMysql.js'),
    'mysql2/promise': path.resolve(__dirname, 'src/utils/mockMysql.js'),
    bcryptjs: path.resolve(__dirname, 'src/utils/mockBcrypt.js'),
  };

  // Добавляем полифилы для модулей, которые не работают в браузере
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

  // Игнорируем предупреждения о модулях, которые не могут быть разрешены
  config.ignoreWarnings = [
    ...(config.ignoreWarnings || []),
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

  return config;
};
