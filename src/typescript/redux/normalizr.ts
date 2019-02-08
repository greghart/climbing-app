/**
 * Normalizr schema
 *
 * Currently just setup in one file for simplicity starting out
 */
import { schema } from 'normalizr';

export const CragSchema = new schema.Entity('crags');
export const AreaSchema = new schema.Entity('areas');
export const BoulderSchema = new schema.Entity('boulders');
export const RouteSchema = new schema.Entity('routes');
export const CommentableSchema = new schema.Entity('commentables');
export const CommentSchema = new schema.Entity('comments');
export const PolygonSchema = new schema.Entity('polygons');

// Setup all associations
CragSchema.define({
  areas: [AreaSchema],
  commentable: CommentableSchema
});

AreaSchema.define({
  crag: CragSchema,
  boulders: [BoulderSchema],
  commentable: CommentableSchema,
  polygon: PolygonSchema
});

BoulderSchema.define({
  area: AreaSchema,
  routes: [RouteSchema],
  commentable: CommentableSchema
});

RouteSchema.define({
  boulder: BoulderSchema,
  commentable: CommentableSchema
});

CommentableSchema.define({
  comments: [CommentSchema]
})

CommentSchema.define({
  commentable: CommentableSchema
});
