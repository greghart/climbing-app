import { normalize } from 'normalizr';

import { receiveEntities } from '../entities';
import { BoulderSchema } from '../../normalizr';
import validate from './util/validate';
import getSwagger from './util/getSwagger';
import Boulder from '../../../models/Boulder';
import BoulderType from './types/boulder';

export default (boulder: Boulder, data: { [index: string]: any }) => {
  return (dispatch) => {
    return validate(data, BoulderType)
    .then((boulderData) => {
      return getSwagger().boulders.updateBoulder(
        boulder.id.toString(),
        boulderData
      );
    })
    .then((boulder) => {
      // Receive the updated boulder
      return dispatch(
        receiveEntities(
          normalize(
            boulder,
            BoulderSchema
          )
        )
      )
    })
  };
};

