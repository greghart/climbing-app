const { merge } = require('webpack-merge');
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
  devtool: 'eval-cheap-module-source-map',
  output: {
    publicPath: "/build",
  },
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
      // CSS
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      // Sass
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ]
      },
    ]
  }
});
