import * as express from 'express';
import * as React from 'react';
import { Provider } from 'react-redux';
import * as ReactDOMServer from 'react-dom/server';
import {
  matchRoutes,
  renderRoutes,
  MatchedRoute,
} from 'react-router-config';
import {
StaticRouter,
} from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { Store } from 'redux';
import Promise from 'bluebird';
import _debug from 'debug';
const debug = _debug('apollo-demand:util:getServerRenderMiddleware');

import HtmlComponent from './HtmlComponent';
import getRoutes from '../redux/getRoutes';
const getStore = require('../redux/store/getStore');

// const routes = getRoutes();
interface ResponseWithExpose extends express.Response {
  expose?(value: any, key: string): any;
}

function renderApp(req: express.Request, res: ResponseWithExpose, store: Store<any>) {
  // Context is used by router to seed redirect data by side effects
  const context: { url?: string } = {};

  const content = ReactDOMServer.renderToString(
    <StaticRouter
      location={req.url}
      context={context}
    >
      <Provider
        store={store}
      >
        {renderRoutes(getRoutes())}
      </Provider>
    </StaticRouter>
  );

  // Expose necessary data to client
  if (!!res.expose) {
    res.expose(store.getState(), 'preloadedState');
  }

  if (context.url) {
    res.redirect(context.url);
    return;
  }
  const doctype = '<!DOCTYPE html>';
  // Replace with HtmlComponent
  const html = ReactDOMServer.renderToStaticMarkup(
    <HtmlComponent
      content=""
      state={res.locals.state.toString()}
    />,
  );
  res.header('Content-Type', 'text/html; charset=utf-8');
  res.write(doctype + html);
  res.end();
}

export default function getServerRenderMiddleware(): express.RequestHandler {

  return (req: express.Request, res, next) => {
    Promise.try(() => {
      const store = getStore(
        {},
        createMemoryHistory({
          initialEntries: [req.url],
        }),
      );
      return renderApp(req, res, store);
    })
    .catch(next);
  };
}
