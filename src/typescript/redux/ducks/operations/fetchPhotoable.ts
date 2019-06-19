import Bluebird from 'bluebird';
import { normalize, Schema } from 'normalizr';

import { BoulderSchema, RouteSchema, AreaSchema, CragSchema } from '../../normalizr';
import getSwagger, { SwaggerAPI } from './util/getSwagger';
import Photoable from '../../../models/Photoable';
import { receiveEntities } from '../entities';

type PhotoableFetchers = keyof SwaggerAPI['photoables'];
const getFetchPhotoable = (schema: Schema, api: PhotoableFetchers) => {
  return (entity: { id: string | number, photoable?: Photoable }) => {
    return (dispatch) => {
      Bluebird.resolve(getSwagger().photoables[api](entity.id.toString()))
      .then((photoable) => {
        entity.photoable = photoable;
        return dispatch(
          receiveEntities(
            normalize(
              entity,
              schema,
            ),
          ),
        );
      });
    };
  };
};

// const fetchPhotoableForCrag = getFetchPhotoable(CragSchema, 'photoableForCrag');
// const fetchPhotoableForArea = getFetchPhotoable(AreaSchema, 'photoableForArea');
const fetchPhotoableForBoulder = getFetchPhotoable(BoulderSchema, 'photoableForBoulder');
const fetchPhotoableForRoute = getFetchPhotoable(RouteSchema, 'photoableForRoute');

export {
  // fetchPhotoableForCrag,
  // fetchPhotoableForArea,
  fetchPhotoableForBoulder,
  fetchPhotoableForRoute,
};
