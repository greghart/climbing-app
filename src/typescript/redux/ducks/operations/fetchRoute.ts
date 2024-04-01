import { RouteSchema } from "../../normalizr";
import type { SwaggerAPI } from "./util/getSwagger";
import type { ArgumentTypes } from "../../../externals";
import fetchEntities from "./util/fetchEntities";

export default fetchEntities<ArgumentTypes<SwaggerAPI["routes"]["getRoute"]>>(
  (swagger, id, includeComments) => {
    return swagger.routes.getRoute(id, includeComments);
  },
  RouteSchema
);
