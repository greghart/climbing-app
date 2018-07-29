import { combineReducers } from 'redux';
import explorer, { State as ExplorerState } from './ducks/explorer';
import entities, { State as EntitiesState } from './ducks/entities';
import sidebar, { State as SidebarState } from './ducks/sidebar';
import freeScopeReducer, { FreeScopeReducerState } from './ducks/util/freeScopeReducer';

export type State = {
  explorer: ExplorerState;
  entities: EntitiesState;
  sidebar: FreeScopeReducerState<SidebarState>;
};

const reducer = combineReducers<State>({
  explorer,
  entities,
  sidebar: freeScopeReducer(sidebar)
});

export default reducer;
