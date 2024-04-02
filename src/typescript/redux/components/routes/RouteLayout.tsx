import * as React from "react";

import Route from "../../../models/Route.js";
import RouteBreadcrumbs from "./RouteBreadcrumbs.js";
import ShowLayout from "../show/ShowLayout.js";

type Props = {
  route: Route;
};

// TODO Reverse router
const exploreRoute = (route: Route) => {
  return `/explorer/${[
    route.boulder.area.crag.id,
    route.boulder.area.id,
    route.boulder.id,
    route.id,
  ].join("/")}`;
};
const RouteLayout: React.SFC<Props> = (props) => {
  console.warn({ props });
  return (
    <ShowLayout
      {...props}
      headerProps={{
        title: <RouteBreadcrumbs route={props.route} />,
        linkTo: exploreRoute(props.route),
      }}
      tabsProps={{
        routeBase: "routes",
        entity: props.route,
      }}
      extraProps={{
        myRoute: props.route,
      }}
    />
  );
};
RouteLayout.defaultProps = {
  route: {
    id: 1,
    name: "Test Route",
    gradeRaw: "v12",
    boulder: {
      name: "EZ Boulder",
      area: {
        name: "TramWay",
      },
    },
  } as any,
};

export default RouteLayout;
