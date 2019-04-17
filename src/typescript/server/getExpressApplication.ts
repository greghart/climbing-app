/**
 * Get an Express application
 */
import express from 'express';
import session from 'express-session';
import favicon from 'serve-favicon';
import helmet from 'helmet';
const state = require('express-state');
import bodyParser from 'body-parser';
import serveStatic from 'serve-static';
import cookieParser from 'cookie-parser';
import connectFlash from 'connect-flash';
import cors from 'cors';
import * as path from 'path';
import config from 'config';
import _debug from 'debug';
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
import api from '../api';
import ioEngineRouter from './ioEngineRouter';

// Application with express-state
interface Application extends express.Express {
  expose: (data: any, key: string) => any;
}

function getExpressApplication(_app?: express.Express) {
  const app = _app ? _app : (express() as Application);

  state.extend(app);

  // Basic server setup
  app.set('trust proxy', 1);
  app.set('port', config.get('port'));
  // Server favicon
  app.use(
    favicon(
      path.join(__dirname, '../../../static/ico/favicon.ico'),
    ),
  );
  // Security headers can make things annoying during local dev
  if (!isLocal()) {
    app.use(helmet());
  }
  app.use(cors({ origin: '*' }));
  // Body parse support
  app.use(bodyParser.json({
    limit: '100mb',
    strict: false,
  }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
  // Static files
  app.use('/build', serveStatic(
    path.join(__dirname, '../../../build'),
  ));
  app.use('/static', serveStatic(
    path.join(__dirname, '../../../static'),
  ));

  // Setup cookies and sessions
  app.use(
    cookieParser(
      config.get<string>('cookies.secret'),
    ),
  );
  app.use(
    session(
      appSessionOptions,
    ),
  );
  app.use(connectFlash());

  // IO Engine
  app.use('/uploads', ioEngineRouter);
  app.use('/api', api);
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

  app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!");
  });

  return app;
}

export default getExpressApplication;
