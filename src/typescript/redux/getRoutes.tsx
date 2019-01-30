import * as React from 'react';
import { RouteConfig } from 'react-router-config';

// Explorer
import CragRoute from './routes/CragRoute';
import AreasListRoute from './routes/AreasListRoute';
import ContainerRoute from './routes/ContainerRoute';
// Search
import SearchLayout from './components/search/SearchLayout';
// Show Route
import RouteRoute from './routes/RouteRoute';
import RouteLayoutOverview from './components/routes/RouteLayoutOverview';
import RouteLayoutPhotos from './components/routes/RouteLayoutPhotos';
import RouteCommentsContainer from './components/routes/RouteCommentsContainer';
import RouteNewCommentContainer from './components/routes/RouteNewCommentContainer';
// Show Boulder
import BoulderRoute from './routes/BoulderRoute';
import BoulderCommentsContainer from './components/boulders/BoulderCommentsContainer';
import BoulderNewCommentContainer from './components/boulders/BoulderNewCommentContainer';
import BoulderLayoutOverview from './components/boulders/BoulderLayoutOverview';

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
          path: '/boulders/:boulder',
          component: BoulderRoute,
          key: 'boulder',
          routes: [
            {
              path: '/boulders/:boulder/comments',
              exact: true,
              component: BoulderCommentsContainer,
              key: 'boulder_comments'
            },
            {
              path: '/boulders/:boulder/comments/new',
              component: BoulderNewCommentContainer,
              key: 'boulder_comments_new'
            },
            {
              path: '/boulders/:boulder/photos',
              component: RouteLayoutPhotos,
              key: 'boulder_photos'
            },
            // Default is overview
            {
              path: '/boulders/:boulder/(overview)?',
              component: BoulderLayoutOverview,
              key: 'boulder_overview'
            }
          ]
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
              key: 'route_comments'
            },
            {
              path: '/routes/:routes/comments/new',
              component: RouteNewCommentContainer,
              key: 'route_comments_new'
            },
            {
              path: '/routes/:routes/photos',
              component: RouteLayoutPhotos,
              key: 'route_photos'
            },
            // Default is overview
            {
              path: '/routes/:routes/(overview)?',
              component: RouteLayoutOverview,
              key: 'route_overview'
            }
          ]
        }
      ]
    }
  ];
}
