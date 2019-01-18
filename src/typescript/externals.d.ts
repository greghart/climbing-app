import * as React from 'react';

// We attach various properties to window for the universal render
// Type them here
declare interface Window {
  // Preloaded State
  preloadedState: any;
  // Dev tools extension
  devToolsExtension: any;
}

type UnPromisify<T> = T extends Promise<infer U> ? U : T;
type UnPromisifiedObject<T> = {[k in keyof T]: UnPromisify<T[k]>}
