import { normalize, schema } from 'normalizr';
import * as Bluebird from 'bluebird';

import { receiveEntities } from '../../entities';
import scopeThunker from '../../util/scopeThunker';
import getSwagger, { SwaggerAPI } from '../util/getSwagger';

/**
 * Default workflow for fetching some entity or entities from our API
 *
 * Handles:
 *  * Scoped dispatching
 *  * Receiving entities based on a schema
 */
function fetchEntities<ArgTypes extends any[]>(
  get: (swagger: SwaggerAPI, ...args: ArgTypes) => any,
  schema: schema.Entity | [schema.Entity],
) {
  return scopeThunker<ArgTypes>(
    (scope, ...args) => {
      return (dispatch) => {
        Bluebird.resolve(get(getSwagger(), ...args))
        .then((data) => {
          return dispatch(
            receiveEntities(
              normalize(
                data,
                schema,
              ),
            ),
          );
        });
      };
    },
  );
}

export default fetchEntities;
