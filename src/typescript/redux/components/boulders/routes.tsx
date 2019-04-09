import * as React from 'react';
import { RouteConfigComponentProps } from 'react-router-config';
import Boulder from '../../../models/Boulder';
import BoulderRoute from '../../routes/BoulderRoute';
import BoulderCommentsContainer from './BoulderCommentsContainer';
import BoulderNewCommentContainer from './BoulderNewCommentContainer';
import BoulderNewRouteContainer from './BoulderNewRouteContainer';
import BoulderEditContainer from './BoulderEditContainer';
import BoulderSun from './BoulderSun';
import BoulderLayoutOverview from './BoulderLayoutOverview';
import BoulderPhotosContainer from './BoulderPhotosContainer';
import BoulderNewPhotoContainer from './BoulderNewPhotoContainer';

interface BoulderParams {
  boulder: string;
}

type SubProps = {
  boulder: Boulder;
};

const routes = [
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
        path: '/boulders/:boulder/photos/new',
        component: BoulderNewPhotoContainer,
        key: 'boulder_photos_new',
      },
      {
        path: '/boulders/:boulder/photos',
        component: BoulderPhotosContainer,
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
];

export default routes;
