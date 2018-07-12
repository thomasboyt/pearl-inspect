var webpack = require('webpack');
var path = require('path');

module.exports = {
  mode: 'development',

  entry: {
    ui: './src/ui-2/index.tsx',
    agent: './src/agent/index.ts',
  },

  devtool: 'source-map',

  output: {
    path: path.join(__dirname, './chrome-extension/build/'),
    publicPath: 'build',
    filename: '[name].bundle.js',
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /(?:\.woff2?$|\.ttf$|\.svg$|\.eot$)/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '/build/font/[hash].[ext]',
            },
          },
        ],
      },
    ],
  },
};
