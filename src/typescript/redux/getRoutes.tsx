import * as React from 'react';
import * as Leaflet from 'leaflet';
import { lazy } from 'react-imported-component';
import { Omit } from 'utility-types/dist/mapped-types';
import { RouteConfig, RouteConfigComponentProps } from 'react-router-config';

/**
 * Top-level config based routing
 *
 * Sub-pages can store their own routes in a `routes` file by convention.
 * @todo set up router objects akin to express routers on the client
 */
// tslint:disable:space-in-parens

import ContainerRoute from './routes/ContainerRoute';
import AnimationContainerRoute from './routes/AnimationContainerRoute';
// Explorer
import explorerRoutes from './components/explorer/routes';
// Crags
const CragContainer = lazy(
  () => import(/* webpackChunkName: "Crags" */'./components/crags/SplitRoute')
);
// Search
import SearchLayout from './components/search/SearchLayout';
// Area
import AreaRoute from './routes/AreaRoute';
import AreaCommentsContainer from './components/areas/AreaCommentsContainer';
import AreaNewCommentContainer from './components/areas/AreaNewCommentContainer';
import AreaNewBoulderContainer from './components/areas/AreaNewBoulderContainer';
import AreaEditContainer from './components/areas/AreaEditContainer';
const AreaLayoutOverview = lazy(() => import('./components/areas/AreaLayoutOverview'));
// Route
import routeRoutes from './components/routes/routes';
// Boulder
import boulderRoutes from './components/boulders/routes';
import provideRoute from './routes/provideRoute';

type MyRouteConfig = Omit<RouteConfig, 'routes'> & {
  // We can key a route for animation purposes
  key?: string;
  routes?: MyRouteConfig[];
  // Explorer components can setup a map component and a detail component
  mapComponent?: React.ComponentType<RouteConfigComponentProps<any> & { map: Leaflet.Map }>;
};
export { MyRouteConfig };

function wrapAllRoutes(routeConfig: MyRouteConfig[]) {
  return routeConfig.map((thisConfig) => {
    // We know that every component will be passed the route info by react-router
    thisConfig.component = provideRoute(thisConfig.component as any);
    if (thisConfig.routes) {
      thisConfig.routes = wrapAllRoutes(thisConfig.routes);
    }
    return thisConfig;
  });
}

export default function getRoutes(): MyRouteConfig[] {
  return wrapAllRoutes([
    {
      path: '*',
      component: ContainerRoute,
      routes: [
        ...explorerRoutes,
        // Search page
        {
          path: '/search/:crag',
          component: SearchLayout,
          key: 'search',
        },
        {
          path: '/crags/:crag',
          component: CragContainer
        },
        // Show an area
        {
          path: '/areas/:area',
          component: AreaRoute,
          key: 'area',
          routes: [
            {
              path: '/areas/:area/comments',
              exact: true,
              component: AreaCommentsContainer,
              key: 'area_comments',
            },
            {
              path: '/areas/:area/comments/new',
              component: AreaNewCommentContainer,
              key: 'area_comments_new',
            },
            // {
            //   path: '/areas/:area/photos',
            //   component: RoutePhotosContainer,
            //   key: 'area_photos',
            // },
            {
              path: '/areas/:area/boulders/new',
              component: AreaNewBoulderContainer,
              key: 'area_boulders_new',
            },
            {
              path: '/areas/:area/edit',
              component: AreaEditContainer,
              key: 'area_edit',
            },
            // Default is overview
            {
              path: '/areas/:area/(overview)?',
              component: AreaLayoutOverview,
              key: 'area_overview',
            },
          ],
        },
        // Show a boulder
        ...boulderRoutes,
        // Show a route
        ...routeRoutes,
      ],
    },
  ]);
}
