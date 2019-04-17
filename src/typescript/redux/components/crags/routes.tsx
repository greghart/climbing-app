import * as React from 'react';
import Crag from '../../../models/Crag';
import CragRoute from '../../routes/CragRoute';
// import CragCommentsContainer from './CragCommentsContainer';
// tslint:disable:space-in-parens
const CragCommentsContainer = React.lazy(() =>
  import(/* webpackChunkName: "CragComment" */'./CragCommentsContainer')
);
const CragNewCommentContainer = React.lazy(() =>
  import(/* webpackChunkName: "CragComment" */'./CragNewCommentContainer')
);
const CragEditContainer = React.lazy(() =>
  import(/* webpackChunkName: "CragComment" */'./CragEditContainer')
);
const CragLayoutOverview = React.lazy(() =>
  import(/* webpackChunkName: "CragComment" */'./CragLayoutOverview')
);
const CragNewAreaContainer = React.lazy(() =>
  import(/* webpackChunkName: "CragComment" */'./CragNewAreaContainer')
);
const CragTrailContainer = React.lazy(() =>
  import(/* webpackChunkName: "CragComment" */'./CragTrailContainer')
);

type SubProps = {
  crag: Crag;
};

const routes = [
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
        path: '/crags/:crag/trail/new',
        component: CragTrailContainer,
        key: 'crag_trail_new',
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
  }
];

export default routes;
