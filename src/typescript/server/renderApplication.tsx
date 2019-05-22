import * as React from 'react';
import { Store } from 'redux';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';

import getRoutes from '../redux/getRoutes';

/**
 * Render our application for a given path
 *
 * @param url Url to render against
 * @param store The data store to render against. This may be manipulated by the render flow.
 */
function renderApplication(url: string, store: Store<any>) {
  // Context is used by router to seed redirect data by side effects
  const context: { url?: string } = {};

  const content = ReactDOMServer.renderToString(
    <StaticRouter
      location={url}
      context={context}
    >
      <Provider
        store={store}
      >
        {renderRoutes(getRoutes())}
      </Provider>
    </StaticRouter>
  );
  return content;
}

export default renderApplication;
