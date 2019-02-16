import * as React from 'react';
import * as SunCalc from 'suncalc';
import { Map } from 'react-leaflet';

import Boulder from '../../../models/Boulder';
import InlineMap from '../map/InlineMap';
import BoulderMap from './BoulderMap';
import { Polyline } from 'react-leaflet';

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
  const sunPosition = SunCalc.getPosition(
    new Date(),
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
  const point: [number, number] = [
    props.boulder.coordinate.lat + (unitVector[0] / 111111) * 6,
    props.boulder.coordinate.lng + (unitVector[1] / 111111) * 6
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
        <Polyline
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
            // polyline.leafletElement.addLatLng(
            //   mapRef.current.leafletElement.containerPointToLatLng([
            //     unitVector[1] * 20 + mapRef.current.leafletElement.getSize().y / 2,
            //     unitVector[0] * 20 + mapRef.current.leafletElement.getSize().x / 2,
            //   ])
            // )
          }}
          positions={[
            [props.boulder.coordinate.lat, props.boulder.coordinate.lng],
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
