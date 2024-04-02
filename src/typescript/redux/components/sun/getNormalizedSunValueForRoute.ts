import getNormalizedSunValue from "./getNormalizedSunValue.js";
import Route from "../../../models/Route.js";

/**
 * @returns -1 if the route doesn't have enough info
 */
function getNormalizedSunValueForRoute(route: Route, time?: Date) {
  if (!(route.coordinate && route.boulder && route.boulder.coordinate)) {
    return -1;
  }
  return getNormalizedSunValue(
    [
      route.coordinate.lat - route.boulder.coordinate.lat,
      route.coordinate.lng - route.boulder.coordinate.lng,
    ],
    route.coordinate,
    time
  );
}

export default getNormalizedSunValueForRoute;
