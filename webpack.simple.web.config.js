const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './index.web.ts',
  output: {
    path: path.resolve(__dirname, 'web-export'),
    filename: 'app.js',
    publicPath: './',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      'react-native': 'react-native-web',
      // Игнорируем серверные модули
      mysql2: false,
      bcryptjs: false,
    },
    fallback: {
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
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/images',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './web-template.html',
      filename: 'index.html',
    }),
  ],
  externals: {
    'react-native': 'react-native',
  },
};
