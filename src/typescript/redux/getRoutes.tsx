import * as React from 'react';
import SFC = React.SFC;
import { RouteConfig, RouteConfigComponentProps, renderRoutes } from 'react-router-config';

import CragRoute from './routes/CragRoute';
import AreasListRoute from './routes/AreasListRoute';
import ContainerRoute from './routes/ContainerRoute';
import SearchLayout from './components/search/SearchLayout';
import RouteRoute from './routes/RouteRoute';

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
          component: SearchLayout,
          key: 'search'
        },
        // Show Pages
        // TODO
        {
          path: '/areas/:id',
          component: SearchLayout,
          key: 'area'
        },
        // Show a boulder
        // TODO
        {
          path: '/boulders/:id',
          component: SearchLayout,
          key: 'boulder'
        },
        // Show a route
        // TODO
        {
          path: '/show/:crag/:area/:boulder/:route',
          component: RouteRoute,
          key: 'route'
        }
      ]
    }
  ];
}
