import { normalize } from "normalizr";
import { omit } from "lodash";

import { receiveEntities } from "../entities.js";
import { CragSchema } from "../../normalizr.js";
import validate from "./util/validate.js";
import getSwagger from "./util/getSwagger.js";
import Crag from "../../../models/Crag.js";
import AreaCodec from "../../../codecs/AreaCodec.js";

export default (crag: Crag, data: { [index: string]: any }) => {
  return (dispatch) => {
    console.warn(data, "createArea");
    return validate(data, AreaCodec)
      .then((areaData) => {
        return getSwagger().crags.addArea(crag.id.toString(), areaData);
      })
      .then((area) => {
        // Receive the new area, and add to crag
        return dispatch(
          receiveEntities(
            normalize(
              {
                ...crag,
                areas: [omit(area, "crag"), ...crag.areas],
              },
              CragSchema
            )
          )
        );
      });
  };
};
