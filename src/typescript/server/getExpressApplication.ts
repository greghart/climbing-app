/**
 * Get an Express application
 */
import express from "express";
import path from "path";
import {
  getExpressApplication as getBaseApplication,
  serveStatic,
} from "power-putty-server";
import browserPolyfill from "../util/browserPolyfill.js";
browserPolyfill();

import getServerRenderMiddleware from "./getServerRenderMiddleware.js";
// import { APIRouter } from './api/getRouter.js';
// import getAuthRouter from './util/authentication/getRouter.js';

// import getServerRenderMiddleware from './util/getServerRenderMiddleware.js';
// import getValidateMiddleware from './util/getValidateMiddleware.js';
// import getAuthorizeMiddleware from './util/getAuthorizeMiddleware.js';
// import getServerErrorMiddleware from './util/errors/getServerErrorMiddleware.js';

// other routers
// import { UniversalErrorMiddleware } from './util/errors/UniversalErrorFactory.js';
import api from "../api/index.js";
import ioEngineRouter from "./ioEngineRouter.js";

function getExpressApplication(_app?: express.Express) {
  const app = getBaseApplication(_app);

  // Static files
  app.use("/build", serveStatic(path.join(__dirname, "../../../build")));
  app.use("/static", serveStatic(path.join(__dirname, "../../../static")));

  // IO Engine
  app.use("/uploads", ioEngineRouter);
  app.use("/api", api);
  // // Allow unauthorized access to API docs, and expose to all requests
  // app.get('/api-docs', (req, res, next) => {
  //   res.send(apiRouter.apiDocs);
  // });
  // app.expose(apiRouter.apiDocs, 'apiDocs');

  // app.use(getAuthRouter());

  // TODO Re-implement or module validate middleware, authorize middleware
  // app.use(apiRouter);

  app.use(getServerRenderMiddleware() as any);

  // app.use(UniversalErrorMiddleware);
  // app.use(getServerErrorMiddleware());

  app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!");
  });

  return app;
}

export default getExpressApplication;
