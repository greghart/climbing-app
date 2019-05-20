import { normalize, schema } from 'normalizr';
import Bluebird from 'bluebird';

import { receiveEntities } from '../../entities';
import scopeThunker from '../../util/scopeThunker';
import getSwagger from '../util/getSwagger';
import { APIClientInterface } from '../../../../api/clients/getSwaggerClient';

/**
 * Default workflow for fetching some entity or entities from our API
 *
 * Handles:
 *  * Scoped dispatching
 *  * Receiving entities based on a schema
 */
function fetchEntities<ArgTypes extends any[]>(
  get: (swagger: APIClientInterface, ...args: ArgTypes) => any,
  schema: schema.Entity | [schema.Entity],
) {
  return scopeThunker<ArgTypes>(
    (scope, ...args) => {
      return (dispatch) => {
        return Bluebird.resolve(get(getSwagger(), ...args))
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
