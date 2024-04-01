import * as React from "react";
import type { SFC } from "react";
import type { RouteConfigComponentProps } from "react-router-config";

import AreaLayout from "../components/areas/AreaLayout";
import withArea from "../components/areas/withArea";
import type { Fetchable } from "../../server/fetchDataForMatches";
import fetchAreas from "../ducks/operations/fetchAreas";
const AreaLayoutContainer = withArea(AreaLayout);

interface AreaParams {
  area: string;
}

const AreaRoute: SFC<RouteConfigComponentProps<AreaParams>> = (props) => {
  return <AreaLayoutContainer areaId={props.match.params.area} />;
};
(AreaRoute as Fetchable<AreaParams>).fetch = (context) => {
  return context.store.dispatch(
    fetchAreas("singleton-fetch")(context.params.area)
  );
};

export default AreaRoute;
