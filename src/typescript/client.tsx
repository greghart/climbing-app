import * as Promise from 'bluebird';
import * as React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { createBrowserHistory } from 'history';
const Redbox = require('redbox-react');

// Client-side only imports
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import 'application.scss';
import 'popper.js';
import 'bootstrap/js/dist/util';
import 'bootstrap/js/dist/dropdown';

const getStore = require('./redux/store/getStore');
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
Promise.resolve()
.then(() => {

  const history = createBrowserHistory();
  const store = getStore(
    window.preloadedState || {},
    history
  );

  render(
    <AppContainer>
      <Root store={store} history={history} />
    </AppContainer>,
    rootEl
  );

  if (module.hot) {
    module.hot.accept('./redux/Root', () => {
      // If you use Webpack 2 in ES modules mode, you can
      // use <App /> here rather than require() a <NextApp />.
      const NextApp = require('./redux/Root').default;

      render(
        <AppContainer errorReporter={Redbox}>
          <NextApp store={store} history={history} />
        </AppContainer>,
        rootEl
      );
    });
  }

});
