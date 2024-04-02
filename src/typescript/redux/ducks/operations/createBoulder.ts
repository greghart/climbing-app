import { normalize } from "normalizr";
import { omit } from "lodash";

import { receiveEntities } from "../entities.js";
import { AreaSchema } from "../../normalizr.js";
import validate from "./util/validate.js";
import getSwagger from "./util/getSwagger.js";
import Area from "../../../models/Area.js";
import BoulderCodec from "../../../codecs/BoulderCodec.js";

export default (area: Area, data: { [index: string]: any }) => {
  return (dispatch) => {
    console.warn(data, "createBoulder");
    return validate(data, BoulderCodec)
      .then((boulderData) => {
        return getSwagger().areas.addBoulder(area.id.toString(), boulderData);
      })
      .then((boulder) => {
        // Receive the new boulder, and add to area
        return dispatch(
          receiveEntities(
            normalize(
              {
                ...area,
                boulders: [omit(boulder, "area"), ...area.boulders],
              },
              AreaSchema
            )
          )
        );
      });
  };
};
