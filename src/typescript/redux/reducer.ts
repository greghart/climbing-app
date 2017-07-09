import { combineReducers } from 'redux';
import explorer, { State as ExplorerState } from './ducks/explorer';
import entities, { State as EntitiesState } from './ducks/entities';

export type State = {
  explorer: ExplorerState;
  entities: EntitiesState;
};

const reducer = combineReducers({
  explorer,
  entities
});

export default reducer;
