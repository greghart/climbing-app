import { Omit } from 'utility-types/dist/mapped-types';
import { RouteConfig } from 'react-router-config';

// Explorer
import CragExplorerRoute from './routes/CragExplorerRoute';
import AreasListRoute from './routes/AreasListRoute';
import ContainerRoute from './routes/ContainerRoute';
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
// Boulder
import BoulderRoute from './routes/BoulderRoute';
import BoulderCommentsContainer from './components/boulders/BoulderCommentsContainer';
import BoulderNewCommentContainer from './components/boulders/BoulderNewCommentContainer';
import BoulderLayoutOverview from './components/boulders/BoulderLayoutOverview';
import BoulderNewRouteContainer from './components/boulders/BoulderNewRouteContainer';
import BoulderEditContainer from './components/boulders/BoulderEditContainer';
import BoulderSun from './components/boulders/BoulderSun';
// Crags
import CragRoute from './routes/CragRoute';
import CragCommentsContainer from './components/crags/CragCommentsContainer';
import CragNewCommentContainer from './components/crags/CragNewCommentContainer';
import CragEditContainer from './components/crags/CragEditContainer';
import CragLayoutOverview from './components/crags/CragLayoutOverview';
import CragNewAreaContainer from './components/crags/CragNewAreaContainer';
import provideRoute from './routes/provideRoute';

type MyRouteConfig = Omit<RouteConfig, 'routes'> & {
  // We can key a route for animation purposes
  key?: string;
  routes?: MyRouteConfig[];
};

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

        // Explorer -- map view of a crag w/ an optional area
        // Includes a sidebar list (for now -- TODO REMOVE)
        {
          path: '/explorer/:crag/:area?',
          component: CragExplorerRoute,
          key: 'explorer',
          routes: [
            {
              path: '/explorer/:crag/:area',
              component: AreasListRoute,
              key: 'explorer',
            },
          ],
        },

        // Search page
        {
          path: '/search/:crag',
          component: SearchLayout,
          key: 'search',
        },

        // Show Pages
        // Show a crag
        {
          path: '/crags/:crag',
          component: CragRoute,
          key: 'crag_show',
          routes: [
            {
              path: '/crags/:crag/comments',
              exact: true,
              component: CragCommentsContainer,
              key: 'crag_comments',
            },
            {
              path: '/crags/:crag/comments/new',
              component: CragNewCommentContainer,
              key: 'crag_comments_new',
            },
            // {
            //   path: '/crags/:crag/photos',
            //   component: RouteLayoutPhotos,
            //   key: 'crag_photos'
            // },
            {
              path: '/crags/:crag/areas/new',
              component: CragNewAreaContainer,
              key: 'crag_areas_new',
            },
            {
              path: '/crags/:crag/edit',
              component: CragEditContainer,
              key: 'crag_edit',
            },
            // Default is overview
            {
              path: '/crags/:crag/(overview)?',
              component: CragLayoutOverview,
              key: 'crag_overview',
            },
          ],
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
