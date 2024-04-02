import { CommentableSchema } from "../../normalizr.js";
import Commentable from "../../../models/Commentable.js";
import buildWithChild from "../util/buildWithChild.js";

const withCommentable = buildWithChild<
  Commentable,
  { commentable?: Commentable }
>("commentable", CommentableSchema);

export default withCommentable;
