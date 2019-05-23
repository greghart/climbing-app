import * as React from 'react';
import * as SunCalc from 'suncalc';
import * as Leaflet from 'leaflet';
import { Map } from 'react-leaflet';
import { Link } from 'react-router-dom';

import Boulder from '../../../models/Boulder';
import InlineMap from '../map/InlineMap';
import BoulderMap from './BoulderMap';
import SunForm from '../sun/SunForm';
import SunLine from '../sun/SunLine';

interface Props {
  boulder: Boulder;
}

const TimeEntry: React.SFC<{ label: string, value: Date }> = (props) => {
  return (
    <tr>
      <th>{props.label}</th>
      <td>{props.value.toLocaleTimeString()}</td>
    </tr>
  );
};
const BoulderSun: React.SFC<Props> = (props) => {
  if (!props.boulder.coordinate) {
    return (
      <p className="text-warning">
        This boulder doesn't have location data.
        <Link to={`/boulders/${props.boulder.id}/edit`}>
          Set it now!
        </Link>
      </p>
    );
  }
  const times = SunCalc.getTimes(
    new Date(),
    props.boulder.coordinate.lat,
    props.boulder.coordinate.lng,
  );

  // Need refs to do some x/y conversions
  const mapRef = React.createRef<Map>();

  return (
    <React.Fragment>
      <SunForm
        onSubmit={(...args) => {}}
        coordinate={props.boulder.coordinate}
      />
      <InlineMap
        className="m-1"
        boundsCoordinates={props.boulder.polygon &&
          props.boulder.polygon.coordinates
        }
        bounds={new Leaflet.LatLng(
          props.boulder.coordinate.lat,
          props.boulder.coordinate.lng
        ).toBounds(3)}
        ref={mapRef}
      >
        <BoulderMap
          boulder={props.boulder}
        />
        <SunLine coordinate={props.boulder.coordinate} />
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

export default BoulderSun;
