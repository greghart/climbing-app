import myDataSource from "../../db/myDataSource.js";
import Comment from "../../models/Comment.js";
import User from "../../models/User.js";
import Commentable from "../../models/Commentable.js";

const addCommentToCommentable = (
  commentable: Commentable,
  text: string,
  user: User
) => {
  const comment = new Comment();
  comment.text = text;
  comment.user = user;
  comment.commentable = commentable;
  return myDataSource.getRepository(Comment).save(comment);
};

export default addCommentToCommentable;
