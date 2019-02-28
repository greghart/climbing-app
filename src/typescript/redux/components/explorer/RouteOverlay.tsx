import * as React from 'react';

import OverlayDetail from './OverlayDetail';
import Route from '../../../models/Route';
import Crag from '../../../models/Crag';
import withRoute from '../routes/withRoute';

type NeededProps = 'id' | 'name' | 'gradeRaw' | 'coordinate';
interface Props {
  crag: Crag;
  route: Pick<Route, NeededProps>;
}

const RouteOverlayContent: React.FunctionComponent<Props> = (props) => {
  return (
    <React.Fragment>
      <h6>{props.route.gradeRaw}</h6>
    </React.Fragment>
  );
};

const RouteOverlay: React.FunctionComponent<Props> = (props) => {
  return (
    <OverlayDetail
      header={props.route.name}
      linkTo={`/routes/${props.route.id}`}
      content={<RouteOverlayContent {...props} />}
    />
  );
};

RouteOverlay.defaultProps = {
  route: {
    id: 1,
    name: 'Sample Route',
    gradeRaw: 'V7'
  }
};

const ConnectedRouteOverlay = withRoute(RouteOverlay);
export { ConnectedRouteOverlay };
export default RouteOverlay;
