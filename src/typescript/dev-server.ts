// Creates a hot reloading development environment
// Includes both server and webpack server in one go

const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");

const config = require("../../config/webpack.config.development.js");

import express from "express";
import getExpressApplication from "./server/getExpressApplication";
import getDataSource from "./db";
import _debug from "./debug";
const debug = _debug.extend("dev-server");

const app = express();
debug({ config }, "webpack config");
const compiler = webpack(config);

// Apply CLI dashboard for your webpack dev server

const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 5001;

function log(...args: any[]) {
  debug.apply(console, args);
}

app.use(
  webpackDevMiddleware(compiler, {
    // noInfo: true,
    publicPath: config.output.publicPath,
    stats: {
      colors: true,
    },
    // historyApiFallback: true,
  })
);

app.use(webpackHotMiddleware(compiler));

// getAPIRouter()
// .then((apiRouter) => {
getDataSource()
  .then(() => {
    return getExpressApplication(app);
  })
  .then((finalApp) => {
    finalApp.listen(parseInt(port.toString(), 10), host, () => {
      log("🚧  App is listening at http://%s:%s", host, port);
    });
  });
