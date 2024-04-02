import { RouteSchema } from "../../normalizr.js";
import type { SwaggerAPI } from "./util/getSwagger.js";
import type { ArgumentTypes } from "../../../externals.js";
import fetchEntities from "./util/fetchEntities.js";

export default fetchEntities<ArgumentTypes<SwaggerAPI["routes"]["getRoute"]>>(
  (swagger, id, includeComments) => {
    return swagger.routes.getRoute(id, includeComments);
  },
  RouteSchema
);
