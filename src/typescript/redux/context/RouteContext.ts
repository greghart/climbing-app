import * as React from 'react';
import { RouteConfigComponentProps } from 'react-router-config';

/**
 * Context that keeps the current parent route config information.
 *
 * Will be overridden by any sub-routes that are setup using `renderRoutes`
 */
export default React.createContext<Pick<RouteConfigComponentProps, 'route' | 'location'>>(null);
