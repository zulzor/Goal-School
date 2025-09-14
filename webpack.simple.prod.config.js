// Simple production webpack configuration for React Native Web
console.log('Loading webpack configuration...');

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

console.log('Webpack configuration loaded');

module.exports = {
  mode: 'production',
  entry: './index.ts',
  output: {
    path: path.resolve(__dirname, 'web-export'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      'react-native': 'react-native-web',
      'react-native-vector-icons': '@expo/vector-icons',
    },
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer'),
      url: require.resolve('url'),
      path: require.resolve('path-browserify'),
      util: require.resolve('util'),
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
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'assets/images',
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'web-export', 'index.html'),
      filename: 'index.html',
    }),
  ],
  externals: {
    'react-native': 'react-native-web',
  },
};
