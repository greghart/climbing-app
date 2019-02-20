import * as React from 'react';
import SFC = React.SFC;
import { RouteConfigComponentProps } from 'react-router-config';

import AreaLayout from '../components/areas/AreaLayout';
import withArea from '../components/areas/withArea';
const AreaLayoutContainer = withArea(AreaLayout);

interface AreaParams {
  area: string;
}

const AreaRoute: SFC<RouteConfigComponentProps<AreaParams>> = (props) => {
  return (
    <AreaLayoutContainer
      areaId={props.match.params.area}
    />
  );
};

export default AreaRoute;
