/**
 * Line of the sun
 */
import * as React from "react";
import * as SunCalc from "suncalc";

import Arrow from "../map/Arrow.js";
import { latLngToMeters } from "../../../util/mapLib.js";
import Coordinate from "../../../models/Coordinate.js";
import { formValueSelector } from "redux-form";
import { connect } from "react-redux";
import type { State } from "../../reducer.js";

interface Props {
  // The coordinate to point at
  coordinate: Coordinate;
  hour: number;
}

const _SunLine: React.ComponentType<Props> = (props) => {
  const d = new Date();
  d.setHours(props.hour);
  const sunPosition = SunCalc.getPosition(
    d,
    props.coordinate.lat,
    props.coordinate.lng
  );
  // Suncalc gives azimuth based on 0 radians at the unit vector (0, -1) (ie. south)
  const unitVector = [
    Math.cos(sunPosition.azimuth + Math.PI),
    Math.sin(sunPosition.azimuth + Math.PI),
  ];
  // Direct sun ray at a point a couple meters off boulder
  const base: [number, number] = [
    props.coordinate.lat + latLngToMeters(unitVector[0]) * 1,
    props.coordinate.lng + latLngToMeters(unitVector[1]) * 1,
  ];
  const size = Math.max(6 * (sunPosition.altitude / 1.1), 1.5);
  const point: [number, number] = [
    base[0] + latLngToMeters(unitVector[0]) * size,
    base[1] + latLngToMeters(unitVector[1]) * size,
  ];
  return (
    <Arrow
      // ref={(polyline) => {
      //   if (!mapRef.current) {
      //     return;
      //   }
      //   const pixelCenter = mapRef.current.leafletElement.getPixelBounds().getCenter();
      // }}
      positions={[base, point]}
      color="yellow"
    />
  );
};

// Currently this component is mostly made to connect to sun form, so hook it up now
const selector = formValueSelector("sun-form");
const mapStateToProps = (state: State) => {
  return {
    hour: selector(state, "givenHour") / 4,
  };
};
const SunLine = connect(mapStateToProps)(_SunLine);

export default SunLine;
