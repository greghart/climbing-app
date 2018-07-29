import { LatLngTuple } from 'leaflet';

function isArray(coordinates: LatLngTuple | LatLngTuple[]): coordinates is LatLngTuple[] {
  return typeof (coordinates as LatLngTuple[])[0].length !== 'undefined';
}

/**
 * Basic helper since we sometimes have coordinates in lon lat for some reason
 */
function transformCoordinates(coordinates?: LatLngTuple | LatLngTuple[]): LatLngTuple[] {
  if (!coordinates) {
    return [];
  }
  if (isArray(coordinates)) {
    return coordinates.map((c) => {
      return ([parseFloat(c[1].toString()), parseFloat(c[0].toString())] as LatLngTuple);
    });
  }
  return [
    [parseFloat(coordinates[1].toString()), parseFloat(coordinates[0].toString())]
  ];
}

export default transformCoordinates;
