import scopeThunk from './scopeThunk';

import * as ThunkTypes from 'redux-thunk';

/**
 * Scope the given thunk creator
 *
 * @param {function} - Action creator that we know returns a thunk
 * @returns {function} A new action creator that first curries scope.
 */
export default (thunker: (...args: any[]) => ThunkTypes.ThunkAction<any, any, any>) => {
  return (scope: string) => {
    return (...args: any[]) => {
      return scopeThunk(thunker(...args, scope), scope);
    };
  };
};
