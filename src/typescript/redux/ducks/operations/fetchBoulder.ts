import { BoulderSchema } from "../../normalizr.js";
import type { SwaggerAPI } from "./util/getSwagger.js";
import type { ArgumentTypes } from "../../../externals.js";
import fetchEntities from "./util/fetchEntities.js";

export default fetchEntities<
  ArgumentTypes<SwaggerAPI["boulders"]["getBoulder"]>
>((swagger, id, includeComments) => {
  return swagger.boulders.getBoulder(id, includeComments);
}, BoulderSchema);
