const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './index.web.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      'react-native': 'react-native-web',
      'react-native-vector-icons': '@expo/vector-icons',
      'react-native-vector-icons/MaterialIcons': '@expo/vector-icons/MaterialIcons',
      'react-native-vector-icons/MaterialCommunityIcons': '@expo/vector-icons/MaterialCommunityIcons',
      'react-native-vector-icons/Ionicons': '@expo/vector-icons/Ionicons',
      'react-native-vector-icons/FontAwesome': '@expo/vector-icons/FontAwesome',
      // Mock для нативных модулей
      'react-native-gesture-handler': 'react-native-web',
      'react-native-safe-area-context': 'react-native-web',
      'react-native-svg': 'react-native-svg-web',
      // Заменяем MySQL на веб-заглушку
      'mysql2': path.resolve(__dirname, 'src/config/mysql.web.ts'),
      'mysql2/promise': path.resolve(__dirname, 'src/config/mysql.web.ts'),
      // React Navigation веб-заглушки
      '@react-navigation/native/lib/module/useBackButton': path.resolve(__dirname, 'src/config/react-navigation.web.ts'),
      '@react-navigation/native/lib/module/useDocumentTitle': path.resolve(__dirname, 'src/config/react-navigation.web.ts'),
      '@react-navigation/native/lib/module/useLinking': path.resolve(__dirname, 'src/config/react-navigation.web.ts'),
      '@react-navigation/elements/lib/module/Header/MaskedView': path.resolve(__dirname, 'src/config/react-navigation.web.ts'),
      '@react-navigation/stack/lib/module/views/Stack/GestureHandler': path.resolve(__dirname, 'src/config/react-navigation.web.ts'),
    },
    fallback: {
      fs: false,
      net: false,
      tls: false,
      timers: false,
      path: require.resolve('path-browserify'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer'),
      process: require.resolve('process'),
      url: require.resolve('url/'),
      util: require.resolve('util/'),
      zlib: require.resolve('browserify-zlib'),
      assert: require.resolve('assert'),
      os: require.resolve('os-browserify'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      vm: require.resolve('vm-browserify'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript'
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-object-rest-spread',
            ],
          },
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules\/(?!(@expo\/vector-icons|@react-navigation|react-native-web|expo-linear-gradient))/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: { browsers: ['last 2 versions'] } }],
              '@babel/preset-react'
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-transform-react-jsx',
            ],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,
            publicPath: '/assets',
            outputPath: 'assets',
          },
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
      {
        test: /\.(js|jsx)$/,
        include: /node_modules\/@expo\/vector-icons/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: { browsers: ['last 2 versions'] } }],
              '@babel/preset-react'
            ],
            plugins: [
              '@babel/plugin-transform-react-jsx',
            ],
          },
        },
      },
      {
        test: /\.(js|jsx)$/,
        include: /node_modules\/@react-navigation/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: { browsers: ['last 2 versions'] } }],
              '@babel/preset-react'
            ],
            plugins: [
              '@babel/plugin-transform-react-jsx',
              ['@babel/plugin-transform-modules-commonjs', { allowTopLevelThis: true }],
            ],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'web-export', 'index.html'),
      filename: 'index.html',
    }),
  ],
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 3000,
    historyApiFallback: true,
  },
};