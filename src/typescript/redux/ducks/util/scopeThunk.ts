import scopeDispatch from './scopeDispatch';

import * as ThunkTypes from 'redux-thunk';
import * as ReduxTypes from 'redux';

/**
 * Compose a thunk to dispatch within given scope
 *
 * @param {function} - Thunk method (dispatch) => { ... }
 * @param {Scope} - Scope to dispatch under
 * @returns {function} a new thunk which wraps dispatch in given scope
 */
 // TODO - Does exposing these generics create a helpful interface?  Or should we just use 'any'?
function scopeThunk<R, S, E, A extends ReduxTypes.Action<any>>(
  thunk: ThunkTypes.ThunkAction<R, S, E, A>,
  scope: string,
) {
  return (dispatch: ThunkTypes.ThunkDispatch<S, E, A>, getState: () => S, extra: E): R => {
    return thunk(scopeDispatch(dispatch, scope), getState, extra);
  };
}

export default scopeThunk;
