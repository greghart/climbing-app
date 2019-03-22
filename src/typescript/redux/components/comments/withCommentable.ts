import { CommentableSchema } from '../../normalizr';
import Commentable from '../../../models/Commentable';
import buildWithChild from '../util/buildWithChild';

const withCommentable = buildWithChild<Commentable, { commentable?: Commentable }>(
  'commentable',
  CommentableSchema
);

export default withCommentable;
