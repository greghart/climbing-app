import { createStore, applyMiddleware, compose } from "redux";
// import { persistState } from 'redux-devtools';
import { createLogger } from "redux-logger";
import type { History } from "history";
import { routerMiddleware } from "connected-react-router";

import reducer from "../reducer.js";
import DevTools from "../DevTools.js";
import thunkBundler from "./thunkBundler.js";

/**
 * Entirely optional.
 * This tiny library adds some functionality to your DevTools,
 * by logging actions/state to your console. Used in conjunction
 * with your standard DevTools monitor gives you great flexibility.
 */
const logger = createLogger();

// By default we try to read the key from ?debug_session=<key> in the address bar
const getDebugSessionKey = function () {
  const matches =
    window &&
    window.location &&
    window.location.href &&
    window.location.href.match(/[?&]debug_session=([^&]+)\b/);
  return matches && matches.length ? matches[1] : null;
};
export default function getStore(
  initialState: any,
  history: History,
  onPromise?: (promise: Promise<unknown>) => unknown
) {
  // Enhancer is a function of router middleware, which is a function of history
  const enhancer = compose<any>(
    applyMiddleware(thunkBundler(onPromise), logger, routerMiddleware(history))
    // DevTools.instrument(),
    // Optional. Lets you write ?debug_session=<key> in address bar to persist debug sessions
    // persistState(getDebugSessionKey()),
  );

  const store = createStore(reducer(history), initialState, enhancer);

  // Enable hot module replacement for reducers (requires Webpack or Browserify HMR to be enabled)
  if (module.hot) {
    module.hot.accept("../reducer", () => {
      const nextReducer = require("../reducer").default;
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
