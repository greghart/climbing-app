import originalDebug from 'debug';

/**
 * `climbing-app` specific debug
 *
 * Leave an underscore since we always want to extend it,
 * and it makes it easier to import.
 * Replaces slashes with colons. This is so we can use our VS Code snippet
 * (which will include slashes as part of path) but still get proper output
 */
const _debug = originalDebug('climbing-app');
const originalExtend = _debug.extend;
_debug.extend = (namespace: string, delimiter: string) => {
  return originalExtend.call(_debug, namespace.replace(/\//g, ':'), delimiter);
};

export default _debug;
