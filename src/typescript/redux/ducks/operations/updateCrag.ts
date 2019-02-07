import { normalize } from 'normalizr';

import { receiveEntities } from '../entities';
import { CragSchema } from '../../normalizr';
import validate from './util/validate';
import getSwagger from './util/getSwagger';
import Crag from '../../../models/Crag';
import CragCodec from '../../../codecs/CragCodec';

export default (crag: Crag, data: { [index: string]: any }) => {
  return (dispatch) => {
    return validate(data, CragCodec)
    .then((cragData) => {
      return getSwagger().crags.updateCrag(
        crag.id.toString(),
        cragData
      );
    })
    .then((crag) => {
      // Receive the updated crag
      return dispatch(
        receiveEntities(
          normalize(
            crag,
            CragSchema
          )
        )
      )
    })
  };
};



