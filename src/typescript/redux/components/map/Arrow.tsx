import * as React from 'react';
import { Polyline } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { Omit } from 'utility-types/dist/mapped-types';

import { ExtractProps } from '../../../externals';
import * as mapLib from '../../../util/mapLib';

/**
 * A polyline with a little arrow head at the top
 */
type Props = Omit<ExtractProps<Polyline>, 'positions'> & {
  // The angle of the arrow to make with the vector
  arrowAngle?: number,
  // The size of the arrow as a ratio of the last line
  arrowSize?: number,
  positions: LatLngExpression[],
};

const Arrow = React.forwardRef<Polyline, Props>((props, ref) => {
  // The vector to set an arrow on should be the last vector
  const pointB = mapLib.normalizeLatLng(
    props.positions[props.positions.length - 2],
  );
  const pointA = mapLib.normalizeLatLng(
    props.positions[props.positions.length - 1],
  );
  const baseVector: [number, number] = [
    pointA[0] - pointB[0],
    pointA[1] - pointB[1],
  ];
  // First make a unit vector
  const baseMagnitude = mapLib.magnitude(baseVector);
  const unitVector: [number, number]  = [
    baseVector[0] / mapLib.magnitude(baseVector),
    baseVector[1] / mapLib.magnitude(baseVector),
  ];
  // Now make two vectors -- one at a 45 degree angle from the unit vector
  const vectorA = mapLib.rotate(unitVector, mapLib.degreesToRads(props.arrowAngle));
  const vectorB = mapLib.rotate(unitVector, mapLib.degreesToRads(-props.arrowAngle));

  // Convert to new polylines
  const lineA = [
    pointB,
    [
      pointB[0] + vectorA[0] * baseMagnitude * props.arrowSize,
      pointB[1] + vectorA[1] * baseMagnitude * props.arrowSize,
    ],
  ] as LatLngExpression[];
  const lineB = [
    pointB,
    [
      pointB[0] + vectorB[0] * baseMagnitude * props.arrowSize,
      pointB[1] + vectorB[1] * baseMagnitude * props.arrowSize,
    ],
  ] as LatLngExpression[];

  console.warn({
    lineA,
    lineB,
    positions: props.positions,
  });

  return (
    <React.Fragment>
      <Polyline
        {...props}
        ref={ref}
      />
      <Polyline
        {...props}
        positions={lineA}
      />
      <Polyline
        {...props}
        positions={lineB}
      />
    </React.Fragment>
  );
});
Arrow.defaultProps = {
  arrowAngle: 45,
  arrowSize: .2,
};

export default Arrow;
