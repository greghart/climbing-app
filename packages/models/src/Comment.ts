import Commentable, { type ICommentable } from "./Commentable.js";
import Timestamps, { type ITimestamps } from "./Timestamps.js";

/**
 * Comment subtable
 * Each comment should belong to just one commentable, so we just model that easily.
 * Then each commentable can then be related to an actual entity (route, boulder, etc.)
 */
export type IComment = {
  id?: number;
  text: string;
  commentable?: ICommentable;
  // user: IUser; // TODO
} & ITimestamps;

interface Comment extends Omit<IComment, "commentable"> {
  commentable?: Commentable;
}

class Comment {
  constructor(data: IComment) {
    this.id = data.id;
    this.text = data.text;
    Timestamps.mix(this, data);
    if (data.commentable) {
      this.commentable = new Commentable(data.commentable);
    }
  }
}

export default Comment;
