import Bluebird from 'bluebird';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';

// Client-side only imports
import 'leaflet/dist/leaflet.css';
import 'application.scss';
import 'popper.js';
import 'bootstrap/js/dist/util';
import 'bootstrap/js/dist/dropdown';
import 'rc-slider/assets/index.css';

import getStore from './redux/store/getStore';
import Root from './redux/Root';

// Get the DOM Element that will host our React application
const rootEl = document.getElementById('app');

declare global {
  interface Window { preloadedState: any; }
}

// // Don't initialize app until our API is connected, it makes things much
// // simpler in the end
// getSwagger(
//   new Swagger({
//     spec: window.apiDocs,
//     usePromise: true
//   })
// )
// .then((client: Swagger.SwaggerClient) => {
Bluebird.resolve()
.then(() => {

  const history = createBrowserHistory();
  const store = getStore(
    window.preloadedState || {},
    history,
  );

  ReactDOM.render(
    <Root store={store} history={history} />,
    rootEl,
  );

});
