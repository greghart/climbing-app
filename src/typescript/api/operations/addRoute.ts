import myDataSource from "../../db/myDataSource.js";
import Boulder from "../../models/Boulder.js";
import Route from "../../models/Route.js";
import type { RoutePayload } from "../services/RoutesService.js";

const addRoute = (boulder: Boulder, data: RoutePayload) => {
  const route = new Route();
  Object.assign(route, data);
  route.boulder = boulder;
  return myDataSource.getRepository(Route).save(route);
};

export default addRoute;
