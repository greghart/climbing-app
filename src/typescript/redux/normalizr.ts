/**
 * Normalizr schema
 *
 * Currently just setup in one file for simplicity starting out
 */
import { schema } from 'normalizr';

export const CragSchema = new schema.Entity('crags', undefined, {
  idAttribute: 'name'
});
export const AreaSchema = new schema.Entity('areas');
export const BoulderSchema = new schema.Entity('boulders');
export const RouteSchema = new schema.Entity('routes');

// Setup all associations
CragSchema.define({
  areas: [AreaSchema]
});

AreaSchema.define({
  crag: CragSchema,
  boulders: [BoulderSchema]
});

BoulderSchema.define({
  area: AreaSchema,
  routes: [RouteSchema]
});

RouteSchema.define({
  boulder: BoulderSchema
});
