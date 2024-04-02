import { normalize } from "normalizr";

import { receiveEntities } from "../entities.js";
import scopeThunker from "../util/scopeThunker.js";
import { CragSchema } from "../../normalizr.js";
import getSwagger from "./util/getSwagger.js";

export default scopeThunker((scope, id) => {
  return (dispatch) => {
    return getSwagger()
      .crags.exportCrag(id)
      .then((crag) => {
        return dispatch(receiveEntities(normalize(crag, CragSchema)));
      });
  };
});
