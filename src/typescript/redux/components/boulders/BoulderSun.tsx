import * as React from 'react';
import * as SunCalc from 'suncalc';
import { Polyline, Map } from 'react-leaflet';

import Boulder from '../../../models/Boulder';
import InlineMap from '../map/InlineMap';
import BoulderMap from './BoulderMap';
import { latLngToMeters } from '../../../util/mapLib';
import Arrow from '../map/Arrow';

interface Props {
  boulder: Boulder;
}

const TimeEntry: React.SFC<{ label: string, value: Date }> = (props) => {
  return (
    <tr>
      <th>{props.label}</th>
      <td>{props.value.toLocaleTimeString()}</td>
    </tr>
  )
}
const BoulderSun: React.SFC<Props> = (props) => {
  const d = new Date()
  const sunPosition = SunCalc.getPosition(
    d,
    props.boulder.coordinate.lat,
    props.boulder.coordinate.lng
  )
  const times = SunCalc.getTimes(
    new Date(),
    props.boulder.coordinate.lat,
    props.boulder.coordinate.lng
  );

  // Suncalc gives azimuth based on 0 radians at the unit vector (0, -1) (ie. south)
  const unitVector = [
    Math.cos(sunPosition.azimuth + Math.PI),
    Math.sin(sunPosition.azimuth + Math.PI),
  ]
  // Direct sun ray at a point a couple meters off boulder
  const base: [number, number] = [
    props.boulder.coordinate.lat + latLngToMeters(unitVector[0]) * 2,
    props.boulder.coordinate.lng + latLngToMeters(unitVector[1]) * 2
  ];
  const point: [number, number] = [
    base[0] + latLngToMeters(unitVector[0]) * 6,
    base[1] + latLngToMeters(unitVector[1]) * 6
  ];

  // Need refs to do some x/y conversions
  const mapRef = React.createRef<Map>()

  return (
    <React.Fragment>
      <InlineMap
        className="m-1"
        boundsCoordinates={props.boulder.polygon.coordinates}
        ref={mapRef}
      >
        <BoulderMap
          boulder={props.boulder}
        />
        <Arrow
          key="sun-line"
          ref={(polyline) => {
            if (!mapRef.current) {
              return;
            }
            const pixelCenter = mapRef.current.leafletElement.getPixelBounds().getCenter();
            console.log({
              pixelOrigin: mapRef.current.leafletElement.getPixelOrigin(),
              pixelCenter,
              size: mapRef.current.leafletElement.getSize(),
              unitVector
            })
          }}
          positions={[
            base,
            point,
          ]}
          color="yellow"
        />
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
  )
}

export default BoulderSun;
