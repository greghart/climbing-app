// Browser polyfill, specifically for leaflet to not throw when we import it
function browserPolyfill() {
  (global as any).window = {
    screen: {
      deviceXDPI: 1,
      logicalXDPI: 1
    }
  };
  (global as any).document = {
    documentElement: {
      style: {}
    },
    createElement: () => {
      return {};
    }
  };
  (global as any).navigator = {
    userAgent: 'Node.js',
    platform: 'Node.js'
  };
}

// While we're at it, let's make React.Suspense not throw also!
const React = require('react');
React.Suspense = ({ children }) => children;

export default browserPolyfill;
