import * as React from "react";
import Crag from "../../../models/Crag.js";
import CragRoute from "../../routes/CragRoute.js";
// import CragCommentsContainer from './CragCommentsContainer.js';
// tslint:disable:space-in-parens
import CragCommentsContainer from "./CragCommentsContainer.js";
import CragNewCommentContainer from "./CragNewCommentContainer.js";
import CragEditContainer from "./CragEditContainer.js";
import CragLayoutOverview from "./CragLayoutOverview.js";
import CragNewAreaContainer from "./CragNewAreaContainer.js";
import CragTrailContainer from "./CragTrailContainer.js";

type SubProps = {
  crag: Crag;
};

const routes = [
  // Show a crag
  {
    path: "/crags/:crag",
    component: CragRoute,
    key: "crag_show",
    routes: [
      {
        path: "/crags/:crag/comments",
        exact: true,
        component: CragCommentsContainer,
        key: "crag_comments",
      },
      {
        path: "/crags/:crag/comments/new",
        component: CragNewCommentContainer,
        key: "crag_comments_new",
      },
      // {
      //   path: '/crags/:crag/photos',
      //   component: RouteLayoutPhotos,
      //   key: 'crag_photos'
      // },
      {
        path: "/crags/:crag/areas/new",
        component: CragNewAreaContainer,
        key: "crag_areas_new",
      },
      {
        path: "/crags/:crag/trail/new",
        component: CragTrailContainer,
        key: "crag_trail_new",
      },
      {
        path: "/crags/:crag/edit",
        component: CragEditContainer,
        key: "crag_edit",
      },
      // Default is overview
      {
        path: "/crags/:crag/(overview)?",
        component: CragLayoutOverview,
        key: "crag_overview",
      },
    ],
  },
];

export default routes;
