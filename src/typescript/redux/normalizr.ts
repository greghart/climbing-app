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
export const PhotoableSchema = new schema.Entity('photoables');
export const PhotoSchema = new schema.Entity('photos');
export const PolygonSchema = new schema.Entity('polygons');
export const TrailSchema = new schema.Entity('trails');
export const TrailNodeSchema = new schema.Entity('trail_nodes');
export const TrailEdgeSchema = new schema.Entity('trail_edges');
export const BoundsSchema = new schema.Entity('bounds');

// Setup all associations
CragSchema.define({
  areas: [AreaSchema],
  commentable: CommentableSchema,
  trail: TrailSchema
});

TrailSchema.define({
  nodes: [TrailNodeSchema],
});

TrailNodeSchema.define({
  edges: [TrailEdgeSchema]
});

AreaSchema.define({
  crag: CragSchema,
  boulders: [BoulderSchema],
  commentable: CommentableSchema,
  polygon: PolygonSchema,
});

BoulderSchema.define({
  area: AreaSchema,
  routes: [RouteSchema],
  commentable: CommentableSchema,
  photoable: PhotoableSchema
});

RouteSchema.define({
  boulder: BoulderSchema,
  commentable: CommentableSchema,
  photoable: PhotoableSchema
});

CommentableSchema.define({
  comments: [CommentSchema],
});

CommentSchema.define({
  commentable: CommentableSchema,
});

PhotoableSchema.define({
  photos: [PhotoSchema]
});

PhotoSchema.define({
  photoable: PhotoableSchema,
});
