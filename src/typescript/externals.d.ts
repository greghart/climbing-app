import * as React from 'react';

// We attach various properties to window for the universal render
// Type them here
declare interface Window {
  // Preloaded State
  preloadedState: any;
  // Dev tools extension
  devToolsExtension: any;
}
