import { normalize, Schema } from 'normalizr';
import * as fetch from 'isomorphic-fetch';
import omit = require('lodash/omit');

import { receiveEntities } from '../entities';
import scopeThunker from '../util/scopeThunker';
import { RouteSchema } from '../../normalizr';
import queryParams from './util/queryParams';
import getSwagger from './util/getSwagger';

console.warn(getSwagger(), 'swagger');
// TODO Refactor this to make adding API operations a breeze
export default scopeThunker(
  (options, scope) => {
    return (dispatch) => {
      // So close! We can generate the `getRoute` API of the _service itself_, but
      // _not_ adapt it to the format swagger expects (which would be {id, includeComments})
      // Fuuuuuck

      // getSwagger().routes.getRoute(options.id, options.includeComments);
      return fetch(`/api/routes/${options.id}?${queryParams(omit(options, 'id'))}`)
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
  }
);

