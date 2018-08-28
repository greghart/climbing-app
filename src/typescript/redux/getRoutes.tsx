import * as React from 'react';
import SFC = React.SFC;
import { RouteConfig, RouteConfigComponentProps, renderRoutes } from 'react-router-config';

import CragRoute from './routes/CragRoute';
import AreasListRoute from './routes/AreasListRoute';
import SearchRoute from './routes/SearchRoute';
import ContainerRoute from './routes/ContainerRoute';

export default function getRoutes(): (RouteConfig | any)[] {
  return [
    {
      path: '*',
      component: ContainerRoute,
      routes: [
        {
          path: '/explorer/:crag/:area?',
          component: CragRoute,
          key: 'explorer',
          routes: [
            {
              path: '/explorer/:crag/:area',
              component: AreasListRoute,
              key: 'explorer'
            }
          ],
        },
        {
          path: '/search/:crag',
          component: SearchRoute,
          key: 'search'
        }
      ]
    }
  ];
}
