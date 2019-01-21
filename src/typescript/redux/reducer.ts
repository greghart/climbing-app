import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form'
import explorer, { State as ExplorerState } from './ducks/explorer';
import entities, { State as EntitiesState } from './ducks/entities';
import sidebar, { State as SidebarState } from './ducks/sidebar';
import search, { State as SearchState } from './ducks/search';
import freeScopeReducer, { FreeScopeReducerState } from './ducks/util/freeScopeReducer';

export type State = {
  explorer: ExplorerState;
  entities: EntitiesState;
  sidebar: FreeScopeReducerState<SidebarState>;
  search: SearchState
};

const reducer = combineReducers<State>({
  explorer,
  entities,
  sidebar: freeScopeReducer(sidebar),
  search: search,
  form: formReducer
});

export default reducer;
