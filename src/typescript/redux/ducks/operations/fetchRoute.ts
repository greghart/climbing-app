import { normalize, Schema } from 'normalizr';
import * as fetch from 'isomorphic-fetch';

import { receiveEntities } from '../entities';
import scopeThunker from '../util/scopeThunker';
import { RouteSchema } from '../../normalizr';

// TODO Refactor this to make adding API operations a breeze
export default scopeThunker(
  (options, scope) => {
    return (dispatch) => {
      return fetch(`/api/route/${options.id}`)
      .then((response) => {
        return response.json();
      })
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
    // 'singleton-fetch'
  }
);

