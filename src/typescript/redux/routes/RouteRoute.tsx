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
      crag={props.match.params.crag}
      area={props.match.params.area}
      boulder={props.match.params.boulder}
      route={props.match.params.route}
    />
  );
};

export default RouteRoute;


