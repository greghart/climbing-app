import { normalize, Schema } from 'normalizr';
import * as fetch from 'isomorphic-fetch';
import omit = require('lodash/omit');

import { receiveEntities } from '../entities';
import scopeThunker from '../util/scopeThunker';
import { RouteSchema } from '../../normalizr';
import queryParams from './util/queryParams';

// TODO Refactor this to make adding API operations a breeze
export default scopeThunker(
  (options, scope) => {
    return (dispatch) => {
      console.log(options);
      return fetch(`/api/routes/${options.id}?${queryParams(omit(options, 'id'))}`)
      .then((response) => {
        return response.json();
      })
      .then((route) => {
        console.log(route);
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

