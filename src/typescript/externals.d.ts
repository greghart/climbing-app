import * as React from 'react';
import * as ThunkTypes from 'redux-thunk';
import * as Leaflet from 'leaflet';

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
type ExtractProps<TComponentOrTProps> = TComponentOrTProps extends React.ComponentType<infer TProps> ? TProps :
  TComponentOrTProps extends React.Component<infer TProps> ? TProps : TComponentOrTProps;

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

/**
 * MONKEY PATCHES AND FIXES
 */

/**
 * @todo Monkeypatch redux-form to fix https://github.com/DefinitelyTyped/DefinitelyTyped/issues/31215
 * @todo Monkeypatch typescript-rest to fix https://github.com/thiagobustamante/typescript-rest/issues/78
 * @todo Monkeypatch react-redux to fix https://github.com/DefinitelyTyped/DefinitelyTyped/issues/31363
 */

// Fix normalizr to reflect actual schema objects
declare module 'normalizr' {
  namespace schema {
    interface Entity {
      idAttribute: string;
      key: string;
      schema: {
        [index: string]: Entity
      } | [Entity]
    }
  }
}

// React-leaflet issues

// Missing some types for Tooltip
type MissingProps = {
  onOpen?: () => unknown;
  onClose?: () => unknown;
}

declare module "react-leaflet" {
  export interface TooltipProps extends Leaflet.TooltipOptions {
    children?: Children;
    onOpen?(): unknown;
    onClose?(): unknown;
  }
  // export class Tooltip<P extends TooltipProps = TooltipProps, E extends Leaflet.Tooltip = Leaflet.Tooltip> extends MapComponent<P, E> {
  //     onTooltipOpen(arg: { tooltip: E }): void;
  //     onTooltipClose(arg: { tooltip: E }): void;
  //     renderTooltipContent(): void;
  //     removeTooltipContent(): void;
  // }
}
