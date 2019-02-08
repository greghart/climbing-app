import { EntityRepository, Repository } from "typeorm";
import Comment from "../Comment";
import Commentable from "../Commentable";
import get = require("lodash/get");

// Base interface for a commentable entity
interface CommentableEntity {
  id: any,
  commentable?: Commentable
}

/**
 * A custom comment repository repository to help us abstract away the
 * polymorphic associations
 */
@EntityRepository(Comment)
export default class CommentRepository extends Repository<Comment> {

  /**
   * Find or get the commentable instance for an entity
   *
   * @returns a commentable that will be attached to the entity
   */
  async findOrGetCommentable(entity: CommentableEntity) {
    // Find an existing commentable, if any
    let commentable = entity.commentable ?
      entity.commentable :
      get(await
        this.manager.getRepository(entity.constructor)
        .createQueryBuilder('entity')
        .innerJoinAndSelect('entity.commentable', 'commentable')
        .whereInIds(entity.id)
        .getOne()
      , 'commentable');
    if (!commentable) {
      commentable = new Commentable();
      commentable.descriptor = `${entity.constructor.name}-${entity.id}`;
      await this.manager.save(commentable);
      entity.commentable = commentable;
      await this.manager.save(entity);
    }
    return commentable;
  }

  async commentOn(entity: CommentableEntity, comment: Comment) {
    comment.commentable = await this.findOrGetCommentable(entity);
    return this.manager.save(comment);
  }

}
