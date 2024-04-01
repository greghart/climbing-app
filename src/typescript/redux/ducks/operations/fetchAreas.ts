import { AreaSchema } from "../../normalizr";
import type { SwaggerAPI } from "./util/getSwagger";
import type { ArgumentTypes } from "../../../externals";
import fetchEntities from "./util/fetchEntities";

export default fetchEntities<ArgumentTypes<SwaggerAPI["areas"]["getAreas"]>>(
  (swagger, ids, includeComments) => {
    return swagger.areas.getAreas(ids, includeComments);
  },
  [AreaSchema]
);
