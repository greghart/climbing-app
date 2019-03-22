import * as React from 'react';
import { RouteConfigComponentProps } from 'react-router-config';

import Route from '../../../models/Route';
import RouteLayoutOverview from './RouteLayoutOverview';
import RoutePhotosContainer from './RoutePhotosContainer';
import RouteCommentsContainer from './RouteCommentsContainer';
import RouteNewCommentContainer from './RouteNewCommentContainer';
import RouteEditContainer from './RouteEditContainer';
import RouteSun from './RouteSun';
import RouteNewPhotoContainer from './RouteNewPhotoContainer';
import RouteLayoutContainer from './RouteLayoutContainer';

interface RouteParams {
  route: string;
}

const RouteRoute: React.ComponentType<RouteConfigComponentProps<RouteParams>> = (props) => {
  return (
    <RouteLayoutContainer routeId={props.match.params.route} />
  );
};

type SubProps = {
  // Use `myRoute` to avoid react-router collisions.
  // Avoidable through other ways, but this is easier.
  myRoute: Route;
};

const routes = [
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
        path: '/routes/:routes/photos/new',
        component: RouteNewPhotoContainer,
        key: 'route_photos_new',
      },
      {
        path: '/routes/:routes/photos',
        component: RoutePhotosContainer,
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
  }
];

export default routes;
