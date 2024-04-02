import { normalize } from "normalizr";

import { receiveEntities } from "../entities.js";
import { CragSchema } from "../../normalizr.js";
import validate from "./util/validate.js";
import getSwagger from "./util/getSwagger.js";
import Crag from "../../../models/Crag.js";
import CragCodec from "../../../codecs/CragCodec.js";

export default (crag: Crag, data: { [index: string]: any }) => {
  return (dispatch) => {
    return validate(data, CragCodec)
      .then((cragData) => {
        return getSwagger().crags.updateCrag(crag.id.toString(), cragData);
      })
      .then((crag) => {
        // Receive the updated crag
        return dispatch(receiveEntities(normalize(crag, CragSchema)));
      });
  };
};
