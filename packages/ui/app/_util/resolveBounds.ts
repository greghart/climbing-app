import * as Leaflet from "leaflet";
import { IBounds, ICoordinateLiteral } from "models";

function resolveBounds(
  bounds: IBounds | undefined,
  center: ICoordinateLiteral | undefined
): Leaflet.LatLngBounds | void {
  if (bounds) {
    return Leaflet.latLngBounds(
      Leaflet.latLng(bounds.topLeft),
      Leaflet.latLng(bounds.bottomRight)
    );
  } else if (center) {
    return new Leaflet.LatLng(center.lat, center.lng).toBounds(8000);
  }
}

export default resolveBounds;
