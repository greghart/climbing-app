import * as React from 'react';
import SFC = React.SFC;
import { RouteConfigComponentProps } from 'react-router-config';

import AreaLayoutContainer from '../components/areas/AreaLayoutContainer';

interface AreaParams {
  area: string;
}

const AreaRoute: SFC<RouteConfigComponentProps<AreaParams>> = (props) => {
  return (
    <AreaLayoutContainer
      areaId={props.match.params.area}
      routerConfig={props.route}
      routerLocation={props.location}
    />
  );
};

export default AreaRoute;
