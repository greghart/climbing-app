import isFunction from "lodash/isFunction";
import scopeObject from "./scopeObject";

import * as ThunkTypes from "redux-thunk";
import type { ActionOrThunk } from "../../../externals";

// Type guard for Thunks
const isThunk = (
  action: ActionOrThunk<any>
): action is ThunkTypes.ThunkAction<any, any, any, any> => {
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
export default (
  dispatch: ThunkTypes.ThunkDispatch<any, any, any>,
  scope: string
) => {
  const newDispatcher: ThunkTypes.ThunkDispatch<any, any, any> = <Payload>(
    action: ActionOrThunk<Payload>
  ) => {
    // We dont support nested scoping dispatches, so dont try to.
    if (isThunk(action)) {
      return dispatch(action);
    }
    return dispatch(scopeObject(action, scope));
  };
  return newDispatcher;
};
