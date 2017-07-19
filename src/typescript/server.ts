import * as Promise from 'bluebird';
import * as express from 'express';
import * as _debug from 'debug';
const debug = _debug('climbing-app:server');

import getExpressApplication from './server/getExpressApplication';
// import getAPIRouter from './api/getRouter';
// import rollbar from './util/getRollbar';
// import { serverOptions as rollbarServerOptions } from './util/getRollbar';
import getDatabase from './db/getDatabase';

// rollbar.handleUncaughtExceptionsAndRejections(
//   rollbarServerOptions.token,
//   {
//     exitOnUncaughtException: true
//   }
// );

// @todo Test continuous deployment
// getAPIRouter()
// .then((apiRouter) => {
getDatabase()
.then(() => {
  return getExpressApplication();
})
.then((app: express.Express) => {
  app.listen(
    app.get('port'),
    () => {
      debug(`Server started listening on port ${app.get('port')}`);
    }
  );
})
// Catch errors during app startup
.catch((error: Error) => {
  debug('Error during startup');
  debug(error.message);
  debug(error.stack);
  process.exit(1);
});
