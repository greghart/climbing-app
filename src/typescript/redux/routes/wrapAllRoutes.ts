import type { MyRouteConfig } from "./MyRouteConfig.js";
import provideRoute from "./provideRoute.js";

/**
 * Helper to wrap a list of routes in route providers
 */
function wrapAllRoutes(routeConfig: MyRouteConfig[]) {
  return routeConfig.map((thisConfig) => {
    // We know that every component will be passed the route info by react-router
    thisConfig.component = provideRoute(thisConfig.component as any);
    if (thisConfig.routes) {
      thisConfig.routes = wrapAllRoutes(thisConfig.routes);
    }
    return thisConfig;
  });
}

export default wrapAllRoutes;
