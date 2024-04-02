import * as React from "react";
import type { SFC } from "react";
import type { RouteConfigComponentProps } from "react-router-config";
import CragContainer from "../components/explorer/CragContainer.js";

interface CragParams {
  crag: string;
  area?: string;
}
const CragExplorerRoute: SFC<RouteConfigComponentProps<CragParams>> = (
  props
) => {
  console.warn(props, "CragRoute");
  return (
    <CragContainer
      cragId={props.match.params.crag}
      area={props.match.params.area}
      sidebarChildren={<span />}
    />
  );
};

export default CragExplorerRoute;
