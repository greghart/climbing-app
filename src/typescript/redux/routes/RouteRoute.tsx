import * as React from 'react';
import SFC = React.SFC;
import { RouteConfigComponentProps } from "react-router-config";

import RouteLayoutContainer from '../components/routes/RouteLayoutContainer';

interface RouteParams {
  crag: string;
  area: string;
  boulder: string;
  route: string;
}

const RouteRoute: SFC<RouteConfigComponentProps<RouteParams>> = (props) => {
  return (
    <RouteLayoutContainer
      cragId={props.match.params.crag}
      areaId={props.match.params.area}
      boulderId={props.match.params.boulder}
      routeId={props.match.params.route}
    />
  );
};

export default RouteRoute;


