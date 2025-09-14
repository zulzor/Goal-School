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
    // Алиасы для веб-версий компонентов
    './src/navigation/AppNavigator': path.resolve(__dirname, 'src/navigation/AppNavigator.web.tsx'),
    './src/screens/LoginScreen': path.resolve(__dirname, 'src/screens/LoginScreen.web.tsx'),
    './src/screens/ProfileScreen': path.resolve(__dirname, 'src/screens/ProfileScreen.web.tsx'),
  };

  // Добавляем fallbacks для Node.js модулей которые используются в браузере
  config.resolve.fallback = {
    ...config.resolve.fallback,
    stream: require.resolve('stream-browserify'),
    crypto: require.resolve('crypto-browserify'),
    timers: require.resolve('timers-browserify'),
    zlib: require.resolve('browserify-zlib'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify/browser'),
    assert: require.resolve('assert/'),
    util: require.resolve('util/'),
    vm: require.resolve('vm-browserify'),
    path: require.resolve('path-browserify'),
    url: require.resolve('url/'),
    buffer: require.resolve('buffer/'),
    process: require.resolve('process/browser'),
  };

  // Добавляем плагины для предоставления глобальных переменных
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.NormalModuleReplacementPlugin(
      /^mysql2$/,
      path.resolve(__dirname, 'src/utils/mockMysql.js')
    ),
    new webpack.NormalModuleReplacementPlugin(
      /^bcryptjs$/,
      path.resolve(__dirname, 'src/utils/mockBcrypt.js')
    ),
  ];

  // Игнорируем предупреждения о размере
  config.performance = {
    ...config.performance,
    maxAssetSize: 1024 * 1024 * 10, // 10 MB
    maxEntrypointSize: 1024 * 1024 * 10, // 10 MB
  };

  // Добавляем правило для обработки шрифтов
  config.module.rules.push({
    test: /\.(woff|woff2|eot|ttf|otf)$/,
    use: {
      loader: 'file-loader',
      options: {
        name: 'fonts/[name].[ext]',
      },
    },
  });

  return config;
};
