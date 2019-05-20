import { History } from 'history';
import { Store } from 'redux';

type GetStore = (state: any, history: History) => Store<any>;

let getStore: GetStore;
if (process.env.NODE_ENV === 'production') {
  getStore = require('./getStore.production').default as GetStore;
} else {
  getStore = require('./getStore.development').default as GetStore;
}

export default getStore;
