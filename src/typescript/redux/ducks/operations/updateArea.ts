import { normalize } from "normalizr";

import { receiveEntities } from "../entities.js";
import { AreaSchema } from "../../normalizr.js";
import validate from "./util/validate.js";
import getSwagger from "./util/getSwagger.js";
import Area from "../../../models/Area.js";
import AreaCodec from "../../../codecs/AreaCodec.js";

export default (area: Area, data: { [index: string]: any }) => {
  return (dispatch) => {
    return validate(data, AreaCodec)
      .then((areaData) => {
        return getSwagger().areas.updateArea(area.id.toString(), areaData);
      })
      .then((area) => {
        // Receive the updated area
        return dispatch(receiveEntities(normalize(area, AreaSchema)));
      });
  };
};
