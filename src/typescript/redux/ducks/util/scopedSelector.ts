import * as _debug from 'debug';
const debug = _debug('apollo-demand-app:client:util:scopedSelector');

import mapValues = require('lodash/mapValues');
import { FreeScopeReducerState } from './freeScopeReducer';
import { State as ReducerState } from '../../reducer';

/**
 * Get a selector that resolves scoped state
 *
 * @param {string} scope Scope key
 */
function scopedSelector(scope: string) {
  return <S>(state: FreeScopeReducerState<S>) => {
    return (state[scope] || state.init) as S;
  };
}

function isScopedState<S>(state: any): state is FreeScopeReducerState<S> {
  return !!state.init;
}

/**
 * Get a selector that returns a map of resolved state
 *
 * @param {string} scope Scope key
 * @param {reducerMap} object A map of alias -> to reducer names.
 *  Each alias key is assigned the reducer's section of state, resolved
 *  under the given scope.
 */
type ReducerKey = keyof ReducerState;
type InputMap<K extends string> = {
  [P in K]: ReducerKey;
};
function scopedMapSelector<K extends string>(scope: string, reducerMap: InputMap<K>) {
  type GivenMap = typeof reducerMap;
  const selector = scopedSelector(scope);
  type ResultMap = {
    [P in K]: ReducerState[GivenMap[P]];
  };

  return (state: ReducerState) => {
    return (mapValues(
      reducerMap,
      (reducer: ReducerKey) => {
        const target = state[reducer];
        if (isScopedState(target)) {
          return selector(target);
        }
        throw new Error(`Reducer ${reducer} is not scoped state`);
      }
    ) as ResultMap);
  };
}
export { scopedMapSelector };

export default scopedSelector;
