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
        // Explorer -- map view of a crag w/ an optional area
        // Includes a sidebar list (for now -- TODO REMOVE)
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
        // Search page
        {
          path: '/search/:crag',
          component: SearchRoute,
          key: 'search'
        },
        // Show an area
        // TODO
        {
          path: '/areas/:id',
          component: SearchRoute,
          key: 'area'
        },
        // Show a boulder
        // TODO
        {
          path: '/boulders/:id',
          component: SearchRoute,
          key: 'boulder'
        },
        // Show a route
        // TODO
        {
          path: '/routes/:id',
          component: SearchRoute,
          key: 'route'
        }
      ]
    }
  ];
}
