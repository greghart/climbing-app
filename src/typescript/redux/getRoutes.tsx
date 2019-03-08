import * as React from 'react';
import * as Leaflet from 'leaflet';
import { Omit } from 'utility-types/dist/mapped-types';
import { RouteConfig, RouteConfigComponentProps } from 'react-router-config';

/**
 * Top-level config based routing
 *
 * Sub-pages can store their own routes in a `routes` file by convention.
 * @todo set up router objects akin to express routers on the client
 */

import ContainerRoute from './routes/ContainerRoute';
import AnimationContainerRoute from './routes/AnimationContainerRoute';
// Explorer
import explorerRoutes from './components/explorer/routes';
// Crags
import cragRoutes from './components/crags/routes';
// Search
import SearchLayout from './components/search/SearchLayout';
// Area
import AreaRoute from './routes/AreaRoute';
import AreaCommentsContainer from './components/areas/AreaCommentsContainer';
import AreaNewCommentContainer from './components/areas/AreaNewCommentContainer';
import AreaNewBoulderContainer from './components/areas/AreaNewBoulderContainer';
import AreaEditContainer from './components/areas/AreaEditContainer';
import AreaLayoutOverview from './components/areas/AreaLayoutOverview';
// Route
import RouteRoute from './routes/RouteRoute';
import RouteLayoutOverview from './components/routes/RouteLayoutOverview';
import RouteLayoutPhotos from './components/routes/RouteLayoutPhotos';
import RouteCommentsContainer from './components/routes/RouteCommentsContainer';
import RouteNewCommentContainer from './components/routes/RouteNewCommentContainer';
import RouteEditContainer from './components/routes/RouteEditContainer';
import RouteSun from './components/routes/RouteSun';
// Boulder
import BoulderRoute from './routes/BoulderRoute';
import BoulderCommentsContainer from './components/boulders/BoulderCommentsContainer';
import BoulderNewCommentContainer from './components/boulders/BoulderNewCommentContainer';
import BoulderLayoutOverview from './components/boulders/BoulderLayoutOverview';
import BoulderNewRouteContainer from './components/boulders/BoulderNewRouteContainer';
import BoulderEditContainer from './components/boulders/BoulderEditContainer';
import BoulderSun from './components/boulders/BoulderSun';
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

        // Show Pages
        ...cragRoutes,
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
            {
              path: '/areas/:area/photos',
              component: RouteLayoutPhotos,
              key: 'area_photos',
            },
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
        {
          path: '/boulders/:boulder',
          component: BoulderRoute,
          key: 'boulder',
          routes: [
            {
              path: '/boulders/:boulder/comments',
              exact: true,
              component: BoulderCommentsContainer,
              key: 'boulder_comments',
            },
            {
              path: '/boulders/:boulder/comments/new',
              component: BoulderNewCommentContainer,
              key: 'boulder_comments_new',
            },
            {
              path: '/boulders/:boulder/photos',
              component: RouteLayoutPhotos,
              key: 'boulder_photos',
            },
            {
              path: '/boulders/:boulder/routes/new',
              component: BoulderNewRouteContainer,
              key: 'boulder_routes_new',
            },
            {
              path: '/boulders/:boulder/edit',
              component: BoulderEditContainer,
              key: 'boulder_edit',
            },
            {
              path: '/boulders/:boulder/sun',
              component: BoulderSun,
              key: 'boulder_sun',
            },
            // Default is overview
            {
              path: '/boulders/:boulder/(overview)?',
              component: BoulderLayoutOverview,
              key: 'boulder_overview',
            },
          ],
        },
        // Show a route
        {
          path: '/routes/:route',
          component: RouteRoute,
          key: 'route',
          routes: [
            {
              path: '/routes/:routes/comments',
              exact: true,
              component: RouteCommentsContainer,
              key: 'route_comments',
            },
            {
              path: '/routes/:routes/comments/new',
              component: RouteNewCommentContainer,
              key: 'route_comments_new',
            },
            {
              path: '/routes/:routes/photos',
              component: RouteLayoutPhotos,
              key: 'route_photos',
            },
            {
              path: '/routes/:routes/edit',
              component: RouteEditContainer,
              key: 'route_edit',
            },
            {
              path: '/routes/:routes/sun',
              component: RouteSun,
              key: 'route_sun',
            },
            // Default is overview
            {
              path: '/routes/:routes/(overview)?',
              component: RouteLayoutOverview,
              key: 'route_overview',
            },
          ],
        },
      ],
    },
  ]);
}
