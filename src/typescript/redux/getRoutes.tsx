import * as React from 'react';
import { RouteConfig } from 'react-router-config';

// Import all containers here
import Tram from './containers/Tram';

/**
 * App encapsulates the full routes markup that our app consists of
 */
export default function getRoutes(): RouteConfig[] {
  return [
    {
      path: '/',
      component: Tram
    }
  ];
}
