/**
 * Get an Express application
 */
import express from 'express';
import path from 'path';
import {
  getExpressApplication as getBaseApplication,
  favicon,
  serveStatic
} from 'power-putty-server';
import browserPolyfill from '../util/browserPolyfill';
browserPolyfill();

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

function getExpressApplication(_app?: express.Express) {
  const app = getBaseApplication(_app);

  // Static files
  app.use('/build', serveStatic(
    path.join(__dirname, '../../../build'),
  ));
  app.use('/static', serveStatic(
    path.join(__dirname, '../../../static'),
  ));

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

  // app.use(UniversalErrorMiddleware);
  // app.use(getServerErrorMiddleware());

  app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!");
  });

  return app;
}

export default getExpressApplication;
