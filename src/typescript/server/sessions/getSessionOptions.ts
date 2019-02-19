import * as session from 'express-session';
import * as config from 'config';
import * as connectRedis from 'connect-redis';
const RedisStore = connectRedis(session);

import getCookieOptions from './getCookieOptions';
import { appKeyPrefix } from './getKeyPrefix';
import isLocal from '../../util/isLocal';

/**
 * Get the options to use for sessions in app
 *
 * Isolates what we actually have configurable
 * @param Whether app is running locally.
 * @param Secret to use for signing session
 * @param
 * @param
 */
function getSessionOptions(
  isLocal: boolean,
  sessionSecret: string,
  redisHost: string,
  redisPort: number,
) {
  return {
    name: appKeyPrefix,
    secret: sessionSecret,
    proxy: true,
    saveUninitialized: false,
    resave: false,
    cookie: getCookieOptions({
      isLocal,
      browserSession: true,
    }),
    store: new RedisStore({
      host: redisHost,
      port: redisPort,
      ttl: 60 * 60 * 24 * 30, // Browser sessions are maintained for 30 days
      prefix: `${appKeyPrefix}|`,
    }),
  };
}

const appSessionOptions = getSessionOptions(
  isLocal(),
  config.get<string>('server.cookies.secret'),
  config.get<string>('server.redis.host'),
  config.get<number>('server.redis.port'),
);

export { appSessionOptions };
export default getSessionOptions;
