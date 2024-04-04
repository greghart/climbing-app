import { normalize } from "normalizr";
import { omit } from "lodash-es";
import * as t from "io-ts";

import { receiveEntities } from "../entities.js";
import { PhotoableSchema } from "../../normalizr.js";
import validate from "./util/validate.js";
import getSwagger from "./util/getSwagger.js";
import Photoable from "../../../models/Photoable.js";
import PhotoCodec from "../../../codecs/PhotoCodec.js";

export default (photoable: Photoable, data: unknown) => {
  return (dispatch) => {
    return validate(data || {}, PhotoCodec)
      .then((photoData) => {
        return getSwagger().photoables.addPhoto(
          photoable.id.toString(),
          // File types will naturally not line up here
          photoData.file as unknown as any,
          photoData.title,
          photoData.description
        );
      })
      .then((photo) => {
        // Receive the new photo, and add to photoable
        return dispatch(
          receiveEntities(
            normalize(
              {
                ...photoable,
                photos: [omit(photo, "photoable"), ...photoable.photos],
              },
              PhotoableSchema
            )
          )
        );
      });
  };
};
