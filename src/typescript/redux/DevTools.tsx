import * as React from 'react';
import { createDevTools } from 'redux-devtools';

// Monitors are separate packages, and you can make a custom one
const LogMonitor = require('redux-devtools-log-monitor').default;
const DockMonitor = require('redux-devtools-dock-monitor').default;
const SliderMonitor = require('redux-slider-monitor').default;

// createDevTools takes a monitor and produces a DevTools component
export default createDevTools(
  <DockMonitor toggleVisibilityKey="ctrl-h"
               changePositionKey="ctrl-q"
               changeMonitorKey="ctrl-m">
    <LogMonitor theme="nicinabox" />
    <SliderMonitor keyboardEnabled />
  </DockMonitor>
);
