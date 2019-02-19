import * as ReduxActions from 'redux-actions';

/**
 * Compose an action object to be scoped
 *
 * @param {object} - An action object to add scope to
 * @param {array} - Array of scopes to add
 * @returns {function} a new thunk which wraps dispatch in given scope
 */
export default <Payload>(
  action: ReduxActions.Action<Payload>,
  scope: string,
): ReduxActions.Action<Payload> & { scope: string } => {
  return {
    ...action,
    // Concat existing scope if any
    scope: ((action as any).scope || '') + scope,
  };
};
