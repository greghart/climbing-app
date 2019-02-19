import * as React from 'react';
import { Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';

import Route from '../../../models/Route';
import ConfirmedCircle from '../tracer/ConfirmedCircle';

/**
 * Assumes we have a route with a coordinate, otherwise renders nothing
 */
interface Props {
  route: Route;
}

const ClickableRouteIcon: React.ComponentType<Props> = (props) => {
  const r = props.route;
  if (!r.coordinate) {
    return;
  }
  return (
    <ConfirmedCircle
      center={[r.coordinate.lat, r.coordinate.lng]}
      radius={.2}
    >
      <Popup direction="center" closeButton={false}>
        <Link to={`/routes/${r.id}`} >
          {r.name} ({r.gradeRaw})
        </Link>
      </Popup>
    </ConfirmedCircle>
  );

};
export default ClickableRouteIcon;
