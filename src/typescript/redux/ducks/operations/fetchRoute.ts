import { normalize, Schema } from 'normalizr';

import { receiveEntities } from '../entities';
import scopeThunker from '../util/scopeThunker';
import { RouteSchema } from '../../normalizr';
import getSwagger from './util/getSwagger';

// TODO Refactor this to make adding API operations a breeze
export default scopeThunker(
  (options, scope) => {
    return (dispatch) => {
      getSwagger().routes.getRoute(options.id, options.includeComments)
      .then((route) => {
        return dispatch(
          receiveEntities(
            normalize(
              route,
              RouteSchema
            )
          )
        );
      });
    };
  }
);

