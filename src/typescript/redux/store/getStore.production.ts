import { createStore, applyMiddleware, compose } from 'redux';
import * as promiseMiddleware from 'redux-promise';
import reduxThunk from 'redux-thunk';

import reducer from '../reducer';
import { routerMiddleware, connectRouter } from 'connected-react-router';
import { History } from 'history';

const middlewares = [
  promiseMiddleware,
  thunk,
];
export default function getStore(initialState: any, history: History) {
  // Enhancer is a function of router middleware, which is a function of history
  middlewares.push(routerMiddleware(history));
  const enhancer = compose<any>(
    applyMiddleware(...middlewares),
  );
  const store = createStore<any>(
    connectRouter(history)(rootReducer),
    initialState,
    enhancer,
  );
  return store;
}
