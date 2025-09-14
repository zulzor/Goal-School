const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Убедимся, что у нас правильная обработка JSX и TSX файлов
  config.module.rules.push({
    test: /\.(jsx?|tsx?)$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
        plugins: [
          '@babel/plugin-proposal-class-properties',
          '@babel/plugin-proposal-object-rest-spread',
        ],
      },
    },
  });

  // Добавим алиасы для веб-версии
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native': 'react-native-web',
    '@react-native-async-storage/async-storage': 'react-native-web/dist/exports/AsyncStorage',
    '@react-native-community/netinfo': require.resolve('./src/utils/netinfo.web.ts'),
  };

  return config;
};
