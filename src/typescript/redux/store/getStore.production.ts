import { createStore, applyMiddleware, compose } from 'redux';
import * as promiseMiddleware from 'redux-promise';

import rootReducer from '../reducers';

const enhancer = compose(
  applyMiddleware(promiseMiddleware)
)(createStore);

export default function getStore(initialState: any) {
  return enhancer(rootReducer, initialState);
}
