import { normalize } from 'normalizr';

import { receiveEntities } from '../entities';
import scopeThunker from '../util/scopeThunker';
import { CragSchema } from '../../normalizr';
import getSwagger from './util/getSwagger';

export default (id) => {
  return (dispatch) => {
    return getSwagger().crags.getTrail(id)
    .then((crag) => {
      return dispatch(
        receiveEntities(
          normalize(
            crag,
            CragSchema,
          ),
        ),
      );
    });
  };
};
