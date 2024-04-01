import { createAction } from "redux-actions";
// Type imports
// Type imports
import type { Reducer } from "redux";

const initialize = createAction("INITIALIZE");
interface ScopedReduxAction<Payload> extends ReduxActions.Action<Payload> {
  scope?: string;
}

interface FreeScopeReducerState<S> {
  init: S;
  [key: string]: S;
}

/**
 * Dynamically allow reducer to manage separate state based on action scope.
 *
 * A dynamic alternative to `inScope`. While `inScope` statically sets up
 * allowable scopes at generation time, `freeScopeReducer` dynamically handles
 * scope actions at action time.
 *
 * TODO We can probably jimmy it to inherit the handled actions of reducer, as
 * an interface against `handleActions`.
 * TODO Issue with the Reducer type definition prevents us from using generics properly
 * https://github.com/reactjs/redux/issues/2364
 * For now defined our own type in types/reducers.ts
 */
const freeScopeReducer = <S, P>(reducer: Reducer<S>) => {
  const initialState = reducer(undefined, initialize());
  return (state: FreeScopeReducerState<S>, action: ScopedReduxAction<P>) => {
    // Simple key value object of scope state.
    if (action.scope) {
      console.warn({ action }, `freeScopeReducer(${action.scope})`);
      const key = action.scope;
      return {
        ...state,
        [key]: reducer(state[key], action),
        init: initialState,
      };
    }
    return {
      ...state,
      init: initialState,
    };
  };
};

export type { FreeScopeReducerState };
export default freeScopeReducer;
