import * as React from 'react';
import * as ThunkTypes from 'redux-thunk';

/**
 * WINDOW
 */
// We attach various properties to window for the universal render
// Type them here
declare interface Window {
  // Preloaded State
  preloadedState: any;
  // Dev tools extension
  devToolsExtension: any;
}

/**
 * UTILS
 */
type UnPromisify<T> = T extends Promise<infer U> ? U : T;
type UnPromisifiedObject<T> = {[k in keyof T]: UnPromisify<T[k]>}
type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never;
type ExtractProps<TComponentOrTProps> = TComponentOrTProps extends React.ComponentType<infer TProps> ? TProps : TComponentOrTProps;

/**
 * REDUX
 */
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
