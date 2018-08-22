import * as React from 'react';
import SFC = React.SFC;
import { RouteConfig } from 'react-router-config';

import CragRoute from './routes/CragRoute';
import AreasListRoute from './routes/AreasListRoute';

export default function getRoutes(): RouteConfig[] {
  return [
    {
      path: '/explorer/:crag/:area?',
      component: CragRoute,
      routes: [
        {
          path: '/explorer/:crag/:area',
          component: AreasListRoute
        }
      ]
    }
  ];
}
