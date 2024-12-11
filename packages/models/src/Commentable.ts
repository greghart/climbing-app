import Comment, { type IComment } from "./Comment.js";

/**
 * Commentable supertable to model polymorphic comment associations
 */
export interface ICommentable {
  id?: number;

  // This column isn't necessary, but makes it slightly easier to track what
  // entities have been setup for comments
  descriptor: string;

  comments?: IComment[];
}

interface Commentable extends Omit<ICommentable, "comments"> {
  comments: Comment[];
}

class Commentable {
  constructor(data: ICommentable) {
    this.id = data.id;
    this.descriptor = data.descriptor;
    this.comments = (data.comments || []).map(
      (comment) => new Comment(comment)
    );
  }
}

export default Commentable;
