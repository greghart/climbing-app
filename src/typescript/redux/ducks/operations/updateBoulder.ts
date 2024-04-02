import { normalize } from "normalizr";

import { receiveEntities } from "../entities.js";
import { BoulderSchema } from "../../normalizr.js";
import validate from "./util/validate.js";
import getSwagger from "./util/getSwagger.js";
import Boulder from "../../../models/Boulder.js";
import BoulderCodec from "../../../codecs/BoulderCodec.js";

export default (boulder: Boulder, data: { [index: string]: any }) => {
  return (dispatch) => {
    return validate(data, BoulderCodec)
      .then((boulderData) => {
        return getSwagger().boulders.updateBoulder(
          boulder.id.toString(),
          boulderData
        );
      })
      .then((boulder) => {
        // Receive the updated boulder
        return dispatch(receiveEntities(normalize(boulder, BoulderSchema)));
      });
  };
};
