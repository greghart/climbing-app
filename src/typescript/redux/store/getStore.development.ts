import { createStore, applyMiddleware, compose } from 'redux';
import { persistState } from 'redux-devtools';
import * as promiseMiddleware from 'redux-promise';
import reduxThunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { History } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';

import reducer from '../reducer';
import DevTools from '../DevTools';

/**
 * Entirely optional.
 * This tiny library adds some functionality to your DevTools,
 * by logging actions/state to your console. Used in conjunction
 * with your standard DevTools monitor gives you great flexibility.
 */
const logger = createLogger();

const middlewares = [
  promiseMiddleware,
  thunk,
  logger,
  // require('redux-immutable-state-invariant')()
];

// By default we try to read the key from ?debug_session=<key> in the address bar
const getDebugSessionKey = function () {
  const matches = (
    typeof window !== 'undefined' &&
    window.location.href.match(/[?&]debug_session=([^&]+)\b/)
  );
  return (matches && matches.length) ? matches[1] : null;
};
export default function getStore(initialState: any, history: History) {
  // Enhancer is a function of router middleware, which is a function of history
  middlewares.push(routerMiddleware(history));
  const enhancer = compose<any>(
    applyMiddleware(...middlewares),
    DevTools.instrument(),
    // Optional. Lets you write ?debug_session=<key> in address bar to persist debug sessions
    persistState(getDebugSessionKey()),
  );

  const store = createStore<any>(
    connectRouter(history)(rootReducer),
    initialState,
    enhancer,
  );

  // Enable hot module replacement for reducers (requires Webpack or Browserify HMR to be enabled)
  if (module.hot) {
    module.hot.accept('../reducer', () => {
      const nextReducer = require('../reducer').default;
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
