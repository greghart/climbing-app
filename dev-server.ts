// Creates a hot reloading development environment
// Includes both server and webpack server in one go

const path = require('path');
import * as express from 'express';
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const DashboardPlugin = require('webpack-dashboard/plugin');

const config = require('./config/webpack.config.development.js');
import getExpressApplication from './src/typescript/server/getExpressApplication';

const app = express();
console.log({ config }, 'webpack config');
const compiler = webpack(config);

// Apply CLI dashboard for your webpack dev server
compiler.apply(new DashboardPlugin());

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 5001;

function log(...args: any[]) {
  console.log.apply(console, args);
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
getExpressApplication(app)
.then(() => {

  app.listen(
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