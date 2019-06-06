const test = require('debug');
import originalDebug from 'debug';

/**
 * `climbing-app` specific debug
 *
 * Leave an underscore since we always want to extend it,
 * and it makes it easier to import.
 * Replaces slashes with colons. This is so we can use our VS Code snippet
 * (which will include slashes as part of path) but still get proper output
 * @example
 * import _debug from './debug';
 * const debug = _debug.extend('server/foo/bar');
 * debug('this is a test'); // Write will under `climbing-app:server:foo:bar`
 */
const _debug = originalDebug('climbing-app');
const originalExtend = _debug.extend;
_debug.extend = (namespace: string, delimiter: string) => {
  return originalExtend.call(_debug, namespace.replace(/\//g, ':'), delimiter);
};

export default _debug;
