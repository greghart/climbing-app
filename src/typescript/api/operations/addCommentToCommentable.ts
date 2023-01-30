import myDataSource from "../../db/myDataSource";
import Comment from "../../models/Comment";
import User from "../../models/User";
import Commentable from "../../models/Commentable";

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
