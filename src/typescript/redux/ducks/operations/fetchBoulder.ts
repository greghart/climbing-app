import { BoulderSchema } from "../../normalizr";
import type { SwaggerAPI } from "./util/getSwagger";
import type { ArgumentTypes } from "../../../externals";
import fetchEntities from "./util/fetchEntities";

export default fetchEntities<
  ArgumentTypes<SwaggerAPI["boulders"]["getBoulder"]>
>((swagger, id, includeComments) => {
  return swagger.boulders.getBoulder(id, includeComments);
}, BoulderSchema);
