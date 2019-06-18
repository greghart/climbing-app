import * as express from 'express';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import {
  matchRoutes,
} from 'react-router-config';
import { createMemoryHistory } from 'history';
import { Store } from 'redux';
import Bluebird from 'bluebird';
import config from 'config';

import HtmlComponent from './HtmlComponent';
import getRoutes from '../redux/getRoutes';
import renderApplication from './renderApplication';
import fetchDataForMatches from './fetchDataForMatches';
import getStore from '../redux/store/getStore';

interface ResponseWithExpose extends express.Response {
  expose?(value: any, key: string): any;
}

function renderWithStore(req: express.Request, res: ResponseWithExpose, store: Store<any>) {
  // Context is used by router to seed redirect data by side effects
  const context: { url?: string } = {};

  const content = renderApplication(req.url, store);

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
      content={content}
      state={res.locals.state.toString()}
    />,
  );
  res.header('Content-Type', 'text/html; charset=utf-8');
  res.write(doctype + html);
  res.end();
}

/**
 * Render a request to the response
 */
const renderRequest = async (req: express.Request, res: express.Response) => {
  const matches = matchRoutes(
    getRoutes(),
    req.path
  );
  const openPromises = [];
  const store = getStore(
    {},
    createMemoryHistory({
      initialEntries: [req.url],
    }),
    (promise) => openPromises.push(promise)
  );

  if (config.get<boolean>('ssr.hydrate')) {
    // First, render the app and let all the fetches go out
    // Wait for promises, and then we can render synchronously
    renderApplication(req.url, store);
    // Wait a tick for fetches to kick in
    await Bluebird.delay(0);
    await Promise.all(openPromises);
  }

  // await fetchDataForMatches(matches, store, {});
  return renderWithStore(req, res, store);
};

export default function getServerRenderMiddleware(): express.RequestHandler {
  return (req: express.Request, res, next) => {
    renderRequest(req, res).catch(next);
  };
}
