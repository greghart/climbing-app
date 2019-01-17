import * as React from 'react';
import SFC = React.SFC;
import { RouteConfigComponentProps, renderRoutes } from "react-router-config";
import CragContainer from "../components/explorer/CragContainer";

interface CragParams {
  crag: string;
  area?: string;
}
const CragRoute: SFC<RouteConfigComponentProps<CragParams>> = (props) => {
  console.warn(props, 'CragRoute');
  return (
    <CragContainer
      cragId={props.match.params.crag}
      area={props.match.params.area}
      sidebarChildren={renderRoutes(props.route.routes)}
    />
  );
};

export default CragRoute;
