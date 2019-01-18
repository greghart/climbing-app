import * as React from 'react';
import SFC = React.SFC;
import { RouteConfig, RouteConfigComponentProps, renderRoutes } from 'react-router-config';

import CragRoute from './routes/CragRoute';
import AreasListRoute from './routes/AreasListRoute';
import ContainerRoute from './routes/ContainerRoute';
import SearchLayout from './components/search/SearchLayout';
import RouteRoute from './routes/RouteRoute';
import RouteLayoutOverview from './components/routes/RouteLayoutOverview';
import RouteLayoutPhotos from './components/routes/RouteLayoutPhotos';
import RouteCommentsContainer from './components/routes/RouteCommentsContainer';

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
        {
          path: '/route/:route',
          component: RouteRoute,
          key: 'route',
          routes: [
            {
              path: '/route/:route/comments',
              component: RouteCommentsContainer,
              key: 'route_comments'
            },
            {
              path: '/route/:route/photos',
              component: RouteLayoutPhotos,
              key: 'route_photos'
            },
            // Default is overview
            {
              path: '/route/:route/(overview)?',
              component: RouteLayoutOverview,
              key: 'route_overview'
            }
          ]
        }
      ]
    }
  ];
}
