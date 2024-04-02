import { normalize } from "normalizr";

import { receiveEntities } from "../entities.js";
import scopeThunker from "../util/scopeThunker.js";
import { CragSchema } from "../../normalizr.js";
import getSwagger from "./util/getSwagger.js";

export default (id) => {
  return (dispatch) => {
    return getSwagger()
      .crags.getTrail(id)
      .then((crag) => {
        return dispatch(receiveEntities(normalize(crag, CragSchema)));
      });
  };
};
