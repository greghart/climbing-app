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

export default browserPolyfill;
