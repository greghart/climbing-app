const merge = require('webpack-merge');
const webpack = require('webpack');
const config = require('./webpack.config.base');
const path = require('path');


const GLOBALS = {
  'process.env': {
    'NODE_ENV': JSON.stringify('development')
  }
};

module.exports = merge(config, {
  mode: 'development',
  cache: true,
  devtool: 'cheap-module-eval-source-map',
  entry: {
    application: [
      'webpack-hot-middleware/client',
      'whatwg-fetch',
      // App entry point
      path.join(__dirname, '/../dist/typescript/client.js')
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin(GLOBALS),
    new webpack.NormalModuleReplacementPlugin(/typeorm$/, function (result) {
      result.request = result.request.replace(/typeorm/, "typeorm/browser");
    })
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
      // Sass + CSS Modules
      // {
      //   test: /\.scss$/,
      //   include: /src\/client\/assets\/javascripts/,
      //   loaders: [
      //     'style',
      //     {
      //       loader: 'css',
      //       query: {
      //         modules: true,
      //         importLoaders: 1,
      //         localIdentName: '[path][name]__[local]--[hash:base64:5]'
      //       }
      //     },
      //     'postcss',
      //     { loader: 'sass', query: { outputStyle: 'expanded' } }
      //   ]
      // },
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
