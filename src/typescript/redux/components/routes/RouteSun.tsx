import * as React from 'react';
import * as SunCalc from 'suncalc';
import * as Leaflet from 'leaflet';
import { Link } from 'react-router-dom';

import Route from '../../../models/Route';
import InlineMap from '../map/InlineMap';
import BoulderMap from '../boulders/BoulderMap';
import SunForm from '../sun/SunForm';
import SunLine from '../sun/SunLine';
import RouteMarkers from '../boulders/RouteMarkers';
import getNormalizedSunValue from '../sun/getNormalizedSunValue';
import DisplaySunValue from '../sun/DisplaySunValue';
import { ConnectedDisplaySunValueForRoute } from '../sun/DisplaySunValueForRoute';
// import RouteMap from './RouteMap';
// import RouteSunForm from './RouteSunForm';
// import RouteSunLine from './RouteSunLine';

interface Props {
  myRoute: Route;
}

const TimeEntry: React.SFC<{ label: string, value: Date }> = (props) => {
  return (
    <tr>
      <th>{props.label}</th>
      <td>{props.value.toLocaleTimeString()}</td>
    </tr>
  );
};
const RouteSun: React.SFC<Props> = (props) => {
  const supportsSun = (
    props.myRoute.coordinate && props.myRoute.boulder.coordinate
  );
  if (!supportsSun) {
    return (
      <p className="text-warning m-2">
        This myRoute doesn't have location data.
        Shade estimate is based on sun angle and location of myRoute on boulder.
        <Link to={`/myRoutes/${props.myRoute.id}/edit`}>
          <span> Set it now!</span>
        </Link>
      </p>
    );
  }
  const times = SunCalc.getTimes(
    new Date(),
    props.myRoute.coordinate.lat,
    props.myRoute.coordinate.lng,
  );

  return (
    <React.Fragment>
      <SunForm
        onSubmit={(...args) => {}}
        coordinate={props.myRoute.coordinate}
      />
      <p className="text-info">
        Given Hour Sun Status: <ConnectedDisplaySunValueForRoute route={props.myRoute} />
      </p>
      <InlineMap
        className="m-1"
        bounds={new Leaflet.LatLng(
          props.myRoute.coordinate.lat,
          props.myRoute.coordinate.lng
        ).toBounds(4)}
      >
        <RouteMarkers
          routes={[props.myRoute]}
        />
        <BoulderMap
          boulder={props.myRoute.boulder}
        />
        <SunLine coordinate={props.myRoute.coordinate} />
      </InlineMap>
      <h5>Important times</h5>
      <table>
        <tbody>
          <TimeEntry label="Sunrise" value={times.sunrise} />
          <TimeEntry label="Solar Noon" value={times.solarNoon} />
          <TimeEntry label="Sunset" value={times.sunset} />
          <TimeEntry label="Night" value={times.night} />
        </tbody>
      </table>
    </React.Fragment>
  );
};

export default RouteSun;
