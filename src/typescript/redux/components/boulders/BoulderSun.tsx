import * as React from 'react';
import * as SunCalc from 'suncalc';
import * as Leaflet from 'leaflet';
import { Map } from 'react-leaflet';

import Boulder from '../../../models/Boulder';
import InlineMap from '../map/InlineMap';
import BoulderMap from './BoulderMap';
import BoulderSunForm from './BoulderSunForm';
import BoulderSunLine from './BoulderSunLine';

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
      <BoulderSunForm
        onSubmit={(...args) => console.log(args) }
        boulder={props.boulder}
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
        <BoulderSunLine coordinate={props.boulder.coordinate} />
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
