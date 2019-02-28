import * as React from 'react';
import SFC = React.SFC;
import { RouteConfigComponentProps, renderRoutes } from 'react-router-config';
import CragContainer from '../components/explorer/CragContainer';

interface CragParams {
  crag: string;
  area?: string;
}
const CragExplorerRoute: SFC<RouteConfigComponentProps<CragParams>> = (props) => {
  console.warn(props, 'CragRoute');
  return (
    <CragContainer
      cragId={props.match.params.crag}
      area={props.match.params.area}
      sidebarChildren={<span />}
    />
  );
};

export default CragExplorerRoute;
