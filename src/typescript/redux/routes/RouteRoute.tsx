import * as React from 'react';
import SFC = React.SFC;
import { RouteConfigComponentProps } from "react-router-config";

import RouteLayoutContainer from '../components/routes/RouteLayoutContainer';

interface RouteParams {
  route: string;
}

const RouteRoute: SFC<RouteConfigComponentProps<RouteParams>> = (props) => {
  return (
    <RouteLayoutContainer
      routeId={props.match.params.route}
      routerConfig={props.route}
      routerLocation={props.location}
    />
  );
};

export default RouteRoute;


