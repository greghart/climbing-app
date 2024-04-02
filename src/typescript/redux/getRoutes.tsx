import * as React from "react";
import { lazy } from "react-imported-component";

/**
 * Top-level config based routing
 *
 * Sub-pages can store their own routes in a `routes` file by convention.
 * @todo set up router objects akin to express routers on the client
 */
// tslint:disable:space-in-parens

import ContainerRoute from "./routes/ContainerRoute.js";
import AnimationContainerRoute from "./routes/AnimationContainerRoute.js";
// Explorer
import explorerRoutes from "./components/explorer/routes.js";
// Crags
const CragContainer = lazy(
  () =>
    import(/* webpackChunkName: "Crags" */ "./components/crags/SplitRoute.js")
);
// Search
import SearchLayout from "./components/search/SearchLayout.js";
// Area
import AreaRoute from "./routes/AreaRoute.js";
import AreaCommentsContainer from "./components/areas/AreaCommentsContainer.js";
import AreaNewCommentContainer from "./components/areas/AreaNewCommentContainer.js";
import AreaNewBoulderContainer from "./components/areas/AreaNewBoulderContainer.js";
import AreaEditContainer from "./components/areas/AreaEditContainer.js";
const AreaLayoutOverview = lazy(
  () => import("./components/areas/AreaLayoutOverview.js")
);
// Route
import routeRoutes from "./components/routes/routes.js";
// Boulder
import boulderRoutes from "./components/boulders/routes.js";
import type { MyRouteConfig } from "./routes/MyRouteConfig.js";
import wrapAllRoutes from "./routes/wrapAllRoutes.js";

export default function getRoutes(): MyRouteConfig[] {
  return wrapAllRoutes([
    {
      path: "*",
      component: ContainerRoute,
      routes: [
        ...explorerRoutes,
        // Search page
        {
          path: "/search/:crag",
          component: SearchLayout,
          key: "search",
        },
        {
          path: "/crags/:crag",
          component: CragContainer,
        },
        // Show an area
        {
          path: "/areas/:area",
          component: AreaRoute,
          key: "area",
          routes: [
            {
              path: "/areas/:area/comments",
              exact: true,
              component: AreaCommentsContainer,
              key: "area_comments",
            },
            {
              path: "/areas/:area/comments/new",
              component: AreaNewCommentContainer,
              key: "area_comments_new",
            },
            // {
            //   path: '/areas/:area/photos',
            //   component: RoutePhotosContainer,
            //   key: 'area_photos',
            // },
            {
              path: "/areas/:area/boulders/new",
              component: AreaNewBoulderContainer,
              key: "area_boulders_new",
            },
            {
              path: "/areas/:area/edit",
              component: AreaEditContainer,
              key: "area_edit",
            },
            // Default is overview
            {
              path: "/areas/:area/(overview)?",
              component: AreaLayoutOverview,
              key: "area_overview",
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
