import * as React from "react";
import type { SFC } from "react";
import type { RouteConfigComponentProps } from "react-router-config";

import CragLayout from "../components/crags/CragLayout.js";
import fetchCragContainer from "../components/crags/fetchCragContainer.js";

const CragLayoutContainer = fetchCragContainer(CragLayout);

interface CragParams {
  crag: string;
}

const CragRoute: SFC<RouteConfigComponentProps<CragParams>> = (props) => {
  console.warn("CragRoute", props);
  return <CragLayoutContainer cragId={props.match.params.crag} />;
};

export default CragRoute;
