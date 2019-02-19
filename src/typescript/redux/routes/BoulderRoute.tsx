import * as React from 'react';
import SFC = React.SFC;
import { RouteConfigComponentProps } from 'react-router-config';

import BoulderLayoutContainer from '../components/boulders/BoulderLayoutContainer';

interface BoulderParams {
  boulder: string;
}

const BoulderRoute: SFC<RouteConfigComponentProps<BoulderParams>> = (props) => {
  return (
    <BoulderLayoutContainer
      boulderId={props.match.params.boulder}
      routerConfig={props.route}
      routerLocation={props.location}
    />
  );
};

export default BoulderRoute;
