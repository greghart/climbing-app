import { normalize, Schema } from 'normalizr';

import { receiveEntities } from '../entities';
import scopeThunker from '../util/scopeThunker';
import { RouteSchema } from '../../normalizr';
import getSwagger, { SwaggerAPI } from './util/getSwagger';
import { ArgumentTypes } from '../../../externals';

// TODO Refactor this to make adding API operations a breeze
export default scopeThunker<ArgumentTypes<SwaggerAPI['routes']['getRoute']>>(
  (id, includeComments) => {
    return (dispatch) => {
      getSwagger().routes.getRoute(id, includeComments)
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

