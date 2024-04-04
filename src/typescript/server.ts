import * as express from "express";

import("./externals.js");
import getExpressApplication from "./server/getExpressApplication.js";
// import getAPIRouter from './api/getRouter.js';
// import rollbar from './util/getRollbar.js';
// import { serverOptions as rollbarServerOptions } from './util/getRollbar.js';
import getConnection from "./db/index.js";

import _debug from "./debug.js";
const debug = _debug.extend("server");

// rollbar.handleUncaughtExceptionsAndRejections(
//   rollbarServerOptions.token,
//   {
//     exitOnUncaughtException: true
//   }
// );

// @todo Test continuous deployment
// getAPIRouter()
// .then((apiRouter) => {
getConnection()
  .then(() => {
    return getExpressApplication();
  })
  .then((app: express.Express) => {
    const port = process.env.PORT || 5001;
    app.listen(port, () => {
      debug(`Server started listening on port ${port}`);
    });
  })
  // Catch errors during app startup
  .catch((error: Error) => {
    debug("Error during startup");
    debug(error.message);
    debug(error.stack);
    process.exit(1);
  });
