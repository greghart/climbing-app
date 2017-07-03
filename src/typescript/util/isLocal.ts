/**
 * Whether app is currently running 'locally'
 *
 * Dictates a lot of functionality -- we can guess it based on platform or
 * env variables
 */
function isLocal() {
  return process.env.IS_LOCAL === 'true' || process.platform === 'darwin';
}

export default isLocal;
