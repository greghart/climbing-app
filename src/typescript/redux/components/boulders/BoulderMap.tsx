/**
 * An interactive map diagram of a boulder
 *
 * Includes:
 *   * Boulder polygon, if any
 *   * Route markers with popup/links
 */
import * as React from 'react';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import Boulder from '../../../models/Boulder';
import Route from '../../../models/Route';
import MyPolygon from '../map/MyPolygon';
import ClickableRouteIcon from './ClickableRouteIcon';

interface Props {
  boulder: Boulder;
  onClickRoute?: (route: Route) => unknown;
}

const BoulderMap: React.ComponentType<Props> = (props) => {
  return (
    <React.Fragment>
      <MyPolygon positions={props.boulder.polygon.coordinates} />
      {props.boulder.routes.map((r) => <ClickableRouteIcon key={`route-${r.id}`} route={r} />)}
    </React.Fragment>
  );
}
BoulderMap.defaultProps = {
  onClickRoute: () => {}
};

const mapDispatchToProps = (dispatch) => {
  return {
    onClickRoute: (r: Route) => {
      return dispatch(push(`/routes/${r.id}`));
    }
  };
};

export default connect<void, ReturnType<typeof mapDispatchToProps>, any>(
  undefined,
  mapDispatchToProps
)(BoulderMap);

