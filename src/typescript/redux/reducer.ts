import { combineReducers } from "redux";
import { reducer as formReducer, type FormStateMap } from "redux-form";
import explorer, { type State as ExplorerState } from "./ducks/explorer.js";
import entities, { type State as EntitiesState } from "./ducks/entities.js";
import sidebar, { type State as SidebarState } from "./ducks/sidebar.js";
import search, { type State as SearchState } from "./ducks/search.js";
import accordion, { type State as AccordionState } from "./ducks/accordion.js";
import freeScopeReducer, {
  type FreeScopeReducerState,
} from "./ducks/util/freeScopeReducer.js";
import { connectRouter } from "connected-react-router";

export type State = {
  explorer: ExplorerState;
  entities: EntitiesState;
  sidebar: FreeScopeReducerState<SidebarState>;
  search: SearchState;
  accordion: FreeScopeReducerState<AccordionState>;
  form: FormStateMap;
  router: any;
};

const reducer = (history) =>
  combineReducers<State>({
    explorer,
    entities,
    search,
    sidebar: freeScopeReducer(sidebar),
    form: formReducer,
    accordion: freeScopeReducer(accordion),
    router: connectRouter(history),
  });

// Build some obvious selectors
// TODO Flesh this out to separate modules if it grows too large
const selectors = {
  selectEntities: (state: State) => state.entities,
};

export { selectors };
export default reducer;
