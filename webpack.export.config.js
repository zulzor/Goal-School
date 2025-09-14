const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      mode: 'production',
    },
    argv
  );

  // Добавляем необходимые настройки для веб-экспорта
  config.output.publicPath = './';

  // Убеждаемся, что все необходимые модули включены
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native': 'react-native-web',
    'react-native-vector-icons': '@expo/vector-icons',
  };

  return config;
};
