import * as React from 'react';
import { RouteConfigComponentProps } from 'react-router-config';

/**
 * Context that keeps the current parent route config information.
 *
 * Note this is specifically for react-router-config, so we can keep track of sub routes.
 */
export default React.createContext<Pick<RouteConfigComponentProps, 'route' | 'location'>>(null);
