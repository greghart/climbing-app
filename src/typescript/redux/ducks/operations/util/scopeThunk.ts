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
function scopeThunk<R, S, E>(
  thunk: ThunkTypes.ThunkAction<R, S, E>,
  scope: string
) {
  return (dispatch: ReduxTypes.Dispatch<S>, getState: () => S, extra: E): R => {
    return thunk(scopeDispatch(dispatch, scope), getState, extra);
  };
};

export default scopeThunk;
