import { createStore, applyMiddleware, compose } from 'redux';

import reducer from '../reducer';
import { routerMiddleware } from 'connected-react-router';
import { History } from 'history';
import thunkBundler from './thunkBundler';

export default function getStore(
  initialState: any,
  history: History,
  onPromise?: (promise: Promise<unknown>) => unknown
) {
  // Enhancer is a function of router middleware, which is a function of history
  const enhancer = compose<any>(
    applyMiddleware(
      thunkBundler(onPromise),
      routerMiddleware(history)
    ),
  );
  const store = createStore<any>(
    reducer(history),
    initialState,
    enhancer,
  );
  return store;
}
