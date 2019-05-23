// Creates a hot reloading development environment
// Includes both server and webpack server in one go

const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const DashboardPlugin = require('webpack-dashboard/plugin');

const config = require('./config/webpack.config.development.js');

import express from 'express';
import getExpressApplication from './src/typescript/server/getExpressApplication';
import getConnection from './src/typescript/db/getConnection';
import _debug from './src/typescript/debug';
const debug = _debug.extend('dev-server');

const app = express();
debug({ config }, 'webpack config');
const compiler = webpack(config);

// Apply CLI dashboard for your webpack dev server
compiler.apply(new DashboardPlugin());

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 5001;

function log(...args: any[]) {
  debug.apply(console, args);
}

app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  },
  historyApiFallback: true
}));

app.use(webpackHotMiddleware(compiler));

// getAPIRouter()
// .then((apiRouter) => {
getConnection()
.then(() => {
  return getExpressApplication(app);
})
.then((finalApp) => {
  finalApp.listen(
    parseInt(port.toString(), 10),
    host,
    (err: any) => {
      if (err) {
        log(err);
        return;
      }
      log('🚧  App is listening at http://%s:%s', host, port);
    }
  );
});
