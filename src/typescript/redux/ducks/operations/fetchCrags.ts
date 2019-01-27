import { normalize } from 'normalizr';

import { receiveEntities } from '../entities';
import scopeThunker from '../util/scopeThunker';
import { CragSchema } from '../../normalizr';
import getSwagger from './util/getSwagger';

export default scopeThunker(
  (options, scope) => {
    return (dispatch) => {
      return getSwagger().crags.getCrags()
      .then((crags) => {
        return dispatch(
          receiveEntities(
            normalize(
              crags,
              [CragSchema]
            )
          )
        );
      });
    };
  }
);
