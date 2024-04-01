import * as React from "react";
import type { SFC } from "react";
import type { RouteConfigComponentProps } from "react-router-config";

import RouteLayoutContainer from "../components/routes/RouteLayoutContainer";

interface RouteParams {
  route: string;
}

const RouteRoute: SFC<RouteConfigComponentProps<RouteParams>> = (props) => {
  return <RouteLayoutContainer routeId={props.match.params.route} />;
};

export default RouteRoute;
