import * as config from 'config';

/**
 * Get the Redis session prefix for current environment
 *
 * Note: Supports {NODE_ENV} macro replacement
 * Also note -- acts as API between Org Service and client that sets up session.
 * @memberof util/sessions
 */
function getKeyPrefix(prefix: string) {
  return prefix.replace(/\{NODE_ENV\}/g, process.env.NODE_ENV);
}

// Also export current app prefix
const appKeyPrefix = getKeyPrefix(config.get<string>('server.sessions.prefix'));

export default getKeyPrefix;
export { appKeyPrefix };
