import Comment from "../Comment.js";
import Commentable from "../Commentable.js";
import { get } from "lodash-es";
import myDataSource from "../../db/myDataSource.js";

// Base interface for a commentable entity
interface CommentableEntity {
  id: any;
  commentable?: Commentable;
}

/**
 * A custom comment repository repository to help us abstract away the
 * polymorphic associations
 */
const CommentRepository = myDataSource.getRepository(Comment).extend({
  /**
   * Find or get the commentable instance for an entity
   *
   * @returns a commentable that will be attached to the entity
   */
  async findOrGetCommentable(entity: CommentableEntity) {
    // Find an existing commentable, if any
    let commentable = entity.commentable
      ? entity.commentable
      : get(
          await this.manager
            .getRepository(entity.constructor)
            .createQueryBuilder("entity")
            .innerJoinAndSelect("entity.commentable", "commentable")
            .whereInIds(entity.id)
            .getOne(),
          "commentable"
        );
    if (!commentable) {
      commentable = new Commentable();
      commentable.descriptor = `${entity.constructor.name}-${entity.id}`;
      await this.manager.save(commentable);
      entity.commentable = commentable;
      await this.manager.save(entity);
    }
    return commentable;
  },

  async commentOn(entity: CommentableEntity, comment: Comment) {
    comment.commentable = await this.findOrGetCommentable(entity);
    return this.manager.save(comment);
  },
});

export default CommentRepository;
