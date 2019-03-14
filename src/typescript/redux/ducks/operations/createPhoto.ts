import { normalize } from 'normalizr';
import omit = require('lodash/omit');
import * as t from 'io-ts';

import { receiveEntities } from '../entities';
import { PhotoableSchema } from '../../normalizr';
import validate from './util/validate';
import getSwagger from './util/getSwagger';
import Photoable from '../../../models/Photoable';
import PhotoCodec from '../../../codecs/PhotoCodec';

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
              photos: [
                omit(photo, 'photoable'),
                ...photoable.photos,
              ],
            },
            PhotoableSchema,
          ),
        ),
      );
    });
  };
};
