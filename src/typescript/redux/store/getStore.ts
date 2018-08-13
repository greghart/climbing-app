import { History } from 'history';
import { Store } from 'redux';

type GetStore = (state: any, history: History) => Store<any>;

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./getStore.production').default as GetStore;
} else {
  module.exports = require('./getStore.development').default as GetStore;
}
