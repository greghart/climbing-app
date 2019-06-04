import { combineReducers } from 'redux';
import { reducer as formReducer, FormStateMap } from 'redux-form';
import explorer, { State as ExplorerState } from './ducks/explorer';
import entities, { State as EntitiesState } from './ducks/entities';
import sidebar, { State as SidebarState } from './ducks/sidebar';
import search, { State as SearchState } from './ducks/search';
import accordion, { State as AccordionState } from './ducks/accordion';
import freeScopeReducer, { FreeScopeReducerState } from './ducks/util/freeScopeReducer';
import { connectRouter } from 'connected-react-router';

export type State = {
  explorer: ExplorerState;
  entities: EntitiesState;
  sidebar: FreeScopeReducerState<SidebarState>;
  search: SearchState;
  accordion: FreeScopeReducerState<AccordionState>;
  form: FormStateMap;
  router: any
};

const reducer = (history) => combineReducers<State>({
  explorer,
  entities,
  search,
  sidebar: freeScopeReducer(sidebar),
  form: formReducer,
  accordion: freeScopeReducer(accordion),
  router: connectRouter(history)
});

// Build some obvious selectors
// TODO Flesh this out to separate modules if it grows too large
const selectors = {
  selectEntities: (state: State) => state.entities,
};

export { selectors };
export default reducer;
