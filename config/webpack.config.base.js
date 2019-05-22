// Common Webpack configuration used by webpack.config.development and webpack.config.production

const path = require('path');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const isNode = (typeof process !== 'undefined') && (process.release.name === 'node');

module.exports = {
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, '../build'),
    chunkFilename: '[name].bundle.js',
    publicPath: '/build'
  },
  resolve: {
    modules: [
      path.join(__dirname, '../src/typescript'),
      path.join(__dirname, '../src/scss'),
      'node_modules'
    ],
    alias: {
    },
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.json', '.scss', '.css', '.js']
  },
  // optimization: {
  //   splitChunks: {

  //   }
  // },
  plugins: [
    new ForkTsCheckerWebpackPlugin({ memoryLimit: 1024 }),
    // Direct typescript to a browser compatible
    new webpack.NormalModuleReplacementPlugin(/swagger-client$/, function (result) {
      result.request = result.request.replace(/swagger-client/, "swagger-client/browser");
    }),
    new webpack.NormalModuleReplacementPlugin(/typeorm$/, function (result) {
      result.request = result.request.replace(/typeorm/, "typeorm/browser");
    }),
    new webpack.NormalModuleReplacementPlugin(/react-native-sqlite-storage$/, function (result) {
      result.request = result.request.replace(/typeorm/, "typeorm/browser");
    }),
    new webpack.NormalModuleReplacementPlugin(/getClient/, function(resource) {
      resource.request = resource.request.replace(
        /getServiceClient/, 
        'getSwaggerClient'
      );
    }),
    // Provide globals we expect/setup through HtmlComponent
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default']
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
        }
        // loader: 'ts-loader',
        // options: {
        //   transpileOnly: true,
        //   compilerOptions: {
        //     module: 'esnext',
        //     esModuleInterop: true,
        //     allowSyntheticDefaultImports: true,
        //   }
        // }
      },
      // Images
      // Inline base64 URLs for <=8k images, direct URLs for the rest
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        loader: 'url-loader',
        query: {
          limit: 8192,
          name: 'images/[name].[ext]?[hash]'
        }
      },
      // Fonts
      {
        test: /\.(woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        query: {
          limit: 8192,
          name: 'fonts/[name].[ext]?[hash]'
        }
      }
    ]
  }
};
