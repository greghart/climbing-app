import { createStore, applyMiddleware, compose } from "redux";

import reducer from "../reducer.js";
import { routerMiddleware } from "connected-react-router";
import type { History } from "history";
import thunkBundler from "./thunkBundler.js";

export default function getStore(
  initialState: any,
  history: History,
  onPromise?: (promise: Promise<unknown>) => unknown
) {
  // Enhancer is a function of router middleware, which is a function of history
  const enhancer = compose<any>(
    applyMiddleware(thunkBundler(onPromise), routerMiddleware(history))
  );
  const store = createStore(reducer(history), initialState, enhancer);
  return store;
}
