import * as Promise from 'bluebird';
import * as React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
const Redbox = require('redbox-react');

require('bootstrap/dist/css/bootstrap.min.css');
require('leaflet/dist/leaflet.css');
require('application.scss');

const getStore = require('./redux/store/getStore');
import Root from './redux/Root';

// Get the DOM Element that will host our React application
const rootEl = document.getElementById('app');

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

  const store = getStore(
    window.preloadedState || {}
  );

  render(
    <AppContainer>
      <Root store={store} />
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
          <NextApp store={store} />
        </AppContainer>,
        rootEl
      );
    });
  }

});
