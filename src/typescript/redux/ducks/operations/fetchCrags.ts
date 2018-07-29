import { normalize, Schema } from 'normalizr';
import * as fetch from 'isomorphic-fetch';

import { receiveEntities } from '../entities';
import scopeThunker from '../util/scopeThunker';
import { CragSchema } from '../../normalizr';

export default scopeThunker(
  (options, scope) => {
    return (dispatch) => {
      return fetch('/crags')
      .then((response) => {
        return response.json();
      })
      .then((crags) => {
        console.log(
          {
            crags
          },
          'huzzah'
        );
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
    // 'singleton-fetch'
  }
);
