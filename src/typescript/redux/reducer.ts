import { combineReducers } from 'redux';
import explorer, { State as ExplorerState } from './ducks/explorer';

export type State = {
  explorer: ExplorerState;
};

const reducer = combineReducers({
  explorer
});

export default reducer;
