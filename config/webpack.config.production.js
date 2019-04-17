const merge = require('webpack-merge');
const webpack = require('webpack');
const config = require('./webpack.config.base');
const path = require('path');

module.exports = merge(config, {
  mode: 'production',
  cache: true,
  entry: {
    application: [
      'whatwg-fetch',
      // App entry point
      path.join(__dirname, '/../src/typescript/client.tsx')
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NormalModuleReplacementPlugin(/typeorm$/, function (result) {
      result.request = result.request.replace(/typeorm/, "typeorm/browser");
    }),
  ],
  module: {
    rules: [
      // Sass
      {
        test: /\.scss$/,
        loaders: [
          'style-loader',
          'css-loader',
          { loader: 'sass-loader', query: { outputStyle: 'expanded' } }
        ]
      },
      // CSS
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  }
});
