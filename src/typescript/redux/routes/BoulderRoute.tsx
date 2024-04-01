import * as React from "react";
import type { SFC } from "react";
import type { RouteConfigComponentProps } from "react-router-config";

import BoulderLayoutContainer from "../components/boulders/BoulderLayoutContainer";

interface BoulderParams {
  boulder: string;
}

const BoulderRoute: SFC<RouteConfigComponentProps<BoulderParams>> = (props) => {
  return <BoulderLayoutContainer boulderId={props.match.params.boulder} />;
};

export default BoulderRoute;
