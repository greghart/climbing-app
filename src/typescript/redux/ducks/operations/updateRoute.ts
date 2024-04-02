import { normalize } from "normalizr";

import { receiveEntities } from "../entities.js";
import { RouteSchema } from "../../normalizr.js";
import validate from "./util/validate.js";
import getSwagger from "./util/getSwagger.js";
import Route from "../../../models/Route.js";
import RouteCodec from "../../../codecs/RouteCodec.js";

export default (route: Route, data: { [index: string]: any }) => {
  return (dispatch) => {
    console.warn(route, data, "updateRoute");
    return validate(data, RouteCodec)
      .then((routeData) => {
        return getSwagger().routes.updateRoute(route.id.toString(), routeData);
      })
      .then((route) => {
        // Receive the updated route
        return dispatch(receiveEntities(normalize(route, RouteSchema)));
      });
  };
};
