import { LatLngTuple } from 'leaflet';

function isArray(coordinates: LatLngTuple | LatLngTuple[]): coordinates is LatLngTuple[] {
  return typeof (coordinates as LatLngTuple[])[0].length !== 'undefined';
}

/**
 * Basic helper since we sometimes have coordinates in lon lat for some reason
 */
function transformCoordinates (coordinates?: LatLngTuple | LatLngTuple[]): LatLngTuple[] {
  if (!coordinates) {
    return [];
  }
  if (isArray(coordinates)) {
    return coordinates.map((c) => {
      return ([c[1], c[0]] as LatLngTuple);
    });
  }
  return [
    [coordinates[1], coordinates[0]]
  ];
}

export default transformCoordinates;
