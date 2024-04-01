import * as React from "react";
import type { SFC } from "react";
import type { RouteConfigComponentProps } from "react-router-config";

import CragLayout from "../components/crags/CragLayout";
import fetchCragContainer from "../components/crags/fetchCragContainer";

const CragLayoutContainer = fetchCragContainer(CragLayout);

interface CragParams {
  crag: string;
}

const CragRoute: SFC<RouteConfigComponentProps<CragParams>> = (props) => {
  console.warn("CragRoute", props);
  return <CragLayoutContainer cragId={props.match.params.crag} />;
};

export default CragRoute;
