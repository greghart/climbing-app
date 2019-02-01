import { normalize } from 'normalizr';
import omit = require('lodash/omit');

import { receiveEntities } from '../entities';
import { AreaSchema } from '../../normalizr';
import validate from './util/validate';
import getSwagger from './util/getSwagger';
import Area from '../../../models/Area';
import BoulderType from './types/boulder';

export default (area: Area, data: { [index: string]: any }) => {
  return (dispatch) => {
    console.warn(data, 'createBoulder');
    return validate(data, BoulderType)
    .then((boulderData) => {
      return getSwagger().areas.addBoulder(
        area.id.toString(),
        boulderData
      );
    })
    .then((boulder) => {
      // Receive the new boulder, and add to area
      return dispatch(
        receiveEntities(
          normalize(
            {
              ...area,
              boulders: [
                omit(boulder, 'area'),
                ...area.boulders
              ]
            },
            AreaSchema,
          )
        )
      )
    })
  };
};


