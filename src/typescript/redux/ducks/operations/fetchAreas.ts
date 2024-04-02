import { AreaSchema } from "../../normalizr.js";
import type { SwaggerAPI } from "./util/getSwagger.js";
import type { ArgumentTypes } from "../../../externals.js";
import fetchEntities from "./util/fetchEntities.js";

export default fetchEntities<ArgumentTypes<SwaggerAPI["areas"]["getAreas"]>>(
  (swagger, ids, includeComments) => {
    return swagger.areas.getAreas(ids, includeComments);
  },
  [AreaSchema]
);
