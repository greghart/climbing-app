/**
 * Get an Express application
 */
import * as express from 'express';
import * as session from 'express-session';
import * as favicon from 'serve-favicon';
import * as helmet from 'helmet';
const state = require('express-state');
import * as bodyParser from 'body-parser';
import * as serveStatic from 'serve-static';
import * as cookieParser from 'cookie-parser';
import connectFlash = require('connect-flash');
import * as cors from 'cors';
import * as path from 'path';
import * as Promise from 'bluebird';
import * as config from 'config';
import * as _debug from 'debug';
const debug = _debug('apollo-demand-app:getApp');

import isLocal from '../util/isLocal';
import { appSessionOptions } from './sessions/getSessionOptions';
import getServerRenderMiddleware from './getServerRenderMiddleware';
// import { APIRouter } from './api/getRouter';
// import getAuthRouter from './util/authentication/getRouter';

// import getServerRenderMiddleware from './util/getServerRenderMiddleware';
// import getValidateMiddleware from './util/getValidateMiddleware';
// import getAuthorizeMiddleware from './util/getAuthorizeMiddleware';
// import getServerErrorMiddleware from './util/errors/getServerErrorMiddleware';

// other routers
// import { UniversalErrorMiddleware } from './util/errors/UniversalErrorFactory';
import getCrags from '../api/routes/crags';
import action from '../api/action';

// Application with express-state
interface Application extends express.Express {
  expose: (data: any, key: string) => any;
}

function getExpressApplication(_app?: Application) {
  const app = _app ? _app : (express() as Application);

  state.extend(app);

  // Basic server setup
  app.set('trust proxy', 1);
  app.set('port', config.get('server.port'));
  // Server favicon
  app.use(
    favicon(
      path.join(__dirname, '../../../static/ico/favicon.ico')
    )
  );
  // Security headers can make things annoying during local dev
  if (!isLocal()) {
    app.use(helmet());
  }
  app.use(cors({ origin: '*' }));
  app.use(bodyParser.json({
    limit: '100mb',
    strict: false
  }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
  app.use('/build', serveStatic(
    path.join(__dirname, '../build')
  ));

  // Setup cookies and sessions
  app.use(
    cookieParser(
      config.get<string>('server.cookies.secret')
    )
  );
  app.use(
    session(
      appSessionOptions
    )
  );
  app.use(connectFlash());

  app.get('/crags', action(getCrags, () => {}));
  // // Allow unauthorized access to API docs, and expose to all requests
  // app.get('/api-docs', (req, res, next) => {
  //   res.send(apiRouter.apiDocs);
  // });
  // app.expose(apiRouter.apiDocs, 'apiDocs');

  // app.use(getAuthRouter());

  // TODO Re-implement or module validate middleware, authorize middleware
  // app.use(apiRouter);

  app.use(getServerRenderMiddleware());

  // Temporary add for local testing
  app.use((req, res, next) => {
    if (isLocal()) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    }
  });

  // app.use(UniversalErrorMiddleware);
  // app.use(getServerErrorMiddleware());

  return app;
}

export default Promise.method(getExpressApplication);
