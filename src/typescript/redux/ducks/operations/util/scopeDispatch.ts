import isFunction = require('lodash/isFunction');
import scopeObject from './scopeObject';

import * as ReduxTypes from 'redux';
import * as ReduxActions from 'redux-actions';
import * as ThunkTypes from 'redux-thunk';

type ActionOrThunk<Payload> = (
  ReduxActions.Action<Payload> |
  ThunkTypes.ThunkAction<any, any, any>
);

declare module 'redux' {
  /* tslint:disable:callable-types */
  export interface Dispatch<S> {
    <Payload>(
      action: ActionOrThunk<Payload>
    ): Payload & { scope: string };
  }
  /* tslint:enable:callable-types */
}

// Type guard for Thunks
const isThunk = (
  action: ActionOrThunk<any>
): action is ThunkTypes.ThunkAction<any, any, any> => {
  return isFunction(action);
};

/**
 * Compose dispatcher with scope
 * Only supports dispatching basic action objects, otherwise delegates down
 *
 * @param {function} - Redux dispatch function
 * @param {Scope} - Scope to dispatch actions under
 * @returns {function} new dispatcher which dispatches action under given scope
 */
export default (dispatch: ReduxTypes.Dispatch<any>, scope: string) => {
  const newDispatcher: ReduxTypes.Dispatch<any> = <Payload>(
    action: ActionOrThunk<Payload>
  ) => {
    // We dont support nested scoping dispatches, so dont try to.
    if (isThunk(action)) {
      return dispatch(action);
    }
    return dispatch(
      scopeObject(action, scope)
    );
  };
  return newDispatcher;
};
