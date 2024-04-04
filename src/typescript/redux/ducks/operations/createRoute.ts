import { normalize } from "normalizr";
import { omit } from "lodash-es";

import { receiveEntities } from "../entities.js";
import { BoulderSchema } from "../../normalizr.js";
import validate from "./util/validate.js";
import getSwagger from "./util/getSwagger.js";
import Boulder from "../../../models/Boulder.js";
import RouteCodec from "../../../codecs/RouteCodec.js";

export default (boulder: Boulder, data: { [index: string]: any }) => {
  return (dispatch) => {
    return validate(data, RouteCodec)
      .then((routeData) => {
        return getSwagger().boulders.addRoute(boulder.id.toString(), routeData);
      })
      .then((route) => {
        // Receive the new route, and add to boulder
        return dispatch(
          receiveEntities(
            normalize(
              {
                ...boulder,
                routes: [omit(route, "boulder"), ...boulder.routes],
              },
              BoulderSchema
            )
          )
        );
      });
  };
};
