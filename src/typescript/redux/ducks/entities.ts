import { createAction } from 'redux-actions';
import { normalize, Schema } from 'normalizr';
import mergeWith = require('lodash/mergeWith');
import isArray = require('lodash/isArray');
import * as _debug from 'debug';
const debug = _debug('climbing-app:redux:ducks:entities');

const initialState = {
  crags: {},
  areas: {},
  boulders: {},
  routes: {},
};

type EntityMap = {
  [id: string]: { [index: string]: any };
};
export type State = { [index: string]: EntityMap };
export type Payload = {
  entities: any[];
  schema: Schema;
};

/** Actions */

export interface EntitiesActionPayload {
  entities: {
    [entityType: string]: object;
  };
}
// Load entities for given schema
export const addEntities = createAction<Payload>('climbing-app/entities/ADD_ENTITIES');
// Request entities called with any options
export const requestEntities = createAction<any>('ENTITIES_REQUEST');
export const receiveEntities = createAction<EntitiesActionPayload>('ENTITIES_SUCCESS');
export const failedEntities = createAction<null | Error>('ENTITIES_FAILURE');

/** Reducer */
/**
 * Customizer for merging of entities
 *
 * Only real change is that we want an empty array to override existing arrays.
 */
const customizer = (objValue: any, srcValue: any) => {
  if (isArray(objValue)) {
    return srcValue || objValue;
  }
  return undefined;
};

/**
 * Basic workflow of entities is that _any_ action can add entities in its' payload.
 *
 * We also allow specific actions to more directly load entities into state.
 **/
export default (state: any = initialState, { type, payload }: ReduxActions.Action<any>) => {
  if (type === addEntities.toString()) {
    const { entities, schema } = (payload as Payload);
    return mergeWith(
      {},
      state,
      normalize(entities, schema).entities,
      customizer
    );
  }
  // Any action with payload.entities gets handled here.
  // Assumes normalization has occurred on the 'entities' collection
  if (payload && payload.entities) {
    debug(payload.entities, 'merging with entities');
    return mergeWith(
      {},
      state,
      payload.entities,
      customizer
    );
  }

  return state;
};
