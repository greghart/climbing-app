import scopeThunk from './scopeThunk';

import * as ThunkTypes from 'redux-thunk';

/**
 * Scope the given thunk creator
 *
 * @param {function} - Action creator that we know returns a thunk
 * @returns {function} A new action creator that first curries scope.
 */
export default <T extends any[]>(
  thunker: (scope: string, ...args: T) => ThunkTypes.ThunkAction<any, any, any, any>
) => {
  return (scope: string) => {
    return (...args: T) => {
      return scopeThunk(thunker(scope, ...args), scope);
    };
  };
};
