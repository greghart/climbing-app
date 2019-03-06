import * as SunCalc from 'suncalc';

import * as mapLib from '../../../util/mapLib';
import Coordinate from '../../../models/Coordinate';

/**
 * How much sun does some vector get
 * @param inputVector - Vector we are checking for sun angle
 * @param coordinate - Coordinate where we are checking
 * @param time - Time for which we are checking
 * @returns from 0 being not so much sun to 1 being lots of sun
 */
function getNormalizedSunValue(
  inputVector: mapLib.VectorTuple,
  coordinate: Coordinate,
  time: Date = new Date(),
) {
  const sunPosition = SunCalc.getPosition(
    time,
    coordinate.lat,
    coordinate.lng,
  );
  const altitudeValue = (
    sunPosition.altitude / (Math.PI / 2)
  );
  const azimuthUnitVector: mapLib.VectorTuple = [
    Math.cos(sunPosition.azimuth + Math.PI),
    Math.sin(sunPosition.azimuth + Math.PI),
  ];
  const inputUnitVector: mapLib.VectorTuple  = [
    inputVector[0] / mapLib.magnitude(inputVector),
    inputVector[1] / mapLib.magnitude(inputVector),
  ];
  const inputSunAngle = mapLib.getAngle(inputUnitVector, azimuthUnitVector);
  const angleValue = (1 - (inputSunAngle / 180));

  // The weighted values here could probably use some tweaking.
  // Direct low sun versus indirect high sun, hard to say what is best
  const normalizedSun = (
    .4 * altitudeValue +
    .6 * angleValue
  );
  console.log({
    normalizedSun,
    altitudeValue,
    angleValue,
    inputSunAngle
  });

  return normalizedSun;
}

export default getNormalizedSunValue;
