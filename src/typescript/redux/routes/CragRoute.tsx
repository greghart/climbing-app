import * as React from 'react';
import SFC = React.SFC;
import { RouteConfigComponentProps } from 'react-router-config';

import CragLayout from '../components/crags/CragLayout';
import fetchCragContainer from '../components/crags/fetchCragContainer';

const CragLayoutContainer = fetchCragContainer(CragLayout);

interface CragParams {
  crag: string;
}

const CragRoute: SFC<RouteConfigComponentProps<CragParams>> = (props) => {
  return (
    <CragLayoutContainer
      cragId={props.match.params.crag}
      routerConfig={props.route}
      routerLocation={props.location}
    />
  );
};

export default CragRoute;
