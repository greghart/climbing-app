import config from 'config';

/**
 * Get the Redis session prefix for current environment
 *
 * Note: Supports {NODE_ENV} macro replacement
 * @memberof util/sessions
 */
function getKeyPrefix(prefix: string) {
  return prefix.replace(/\{NODE_ENV\}/g, process.env.NODE_ENV);
}

// Also export current app prefix
const appKeyPrefix = getKeyPrefix(config.get<string>('sessions.prefix'));

export default getKeyPrefix;
export { appKeyPrefix };
