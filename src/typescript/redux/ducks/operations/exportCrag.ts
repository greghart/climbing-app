import { normalize } from 'normalizr';

import { receiveEntities } from '../entities';
import scopeThunker from '../util/scopeThunker';
import { CragSchema } from '../../normalizr';
import getSwagger from './util/getSwagger';

export default scopeThunker(
  (scope, id) => {
    return (dispatch) => {
      return getSwagger().crags.exportCrag(id)
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
  },
);
