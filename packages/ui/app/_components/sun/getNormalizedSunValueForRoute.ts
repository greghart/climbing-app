import { Route } from "models";
import getNormalizedSunValue from "./getNormalizedSunValue";

/**
 * @returns -1 if the route doesn't have enough info
 */
function getNormalizedSunValueForRoute(route: Route, time?: Date) {
  if (!(route.coordinates && route.boulder && route.boulder.coordinates)) {
    return -1;
  }
  return getNormalizedSunValue(
    [
      route.coordinates.lat - route.boulder.coordinates.lat,
      route.coordinates.lng - route.boulder.coordinates.lng,
    ],
    route.coordinates,
    time
  );
}

export default getNormalizedSunValueForRoute;
