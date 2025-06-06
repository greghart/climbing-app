import * as db from "@/db";
import { dataSource } from "@/db/getDataSource";
import { get } from "lodash-es";
import * as models from "models";
import { EntitySchema } from "typeorm";

// Base interface for a commentable entity
export interface CommentableEntity {
  id?: number;
  commentable: models.ICommentable | undefined;
}

/**
 * A custom comment repository repository to help us abstract away the
 * polymorphic associations
 */
const CommentRepository = dataSource.getRepository(db.CommentSchema).extend({
  /**
   * Find or get the commentable instance for an entity
   *
   * @returns a commentable that will be attached to the entity
   */
  async findOrGetCommentable(
    entity: CommentableEntity,
    schema: EntitySchema<any>
  ) {
    // Find an existing commentable, if any
    let commentable = entity.commentable
      ? entity.commentable
      : get(
          await this.manager
            .getRepository(schema)
            .createQueryBuilder("entity")
            .innerJoinAndSelect("entity.commentable", "commentable")
            .whereInIds(entity.id)
            .getOne(),
          "commentable"
        );
    if (!commentable) {
      commentable = new models.Commentable({
        descriptor: `${schema.options.name}-${entity.id}`,
      });
      await this.manager.getRepository(db.CommentableSchema).save(commentable);
      entity.commentable = commentable;
      await this.manager.getRepository(schema).save(entity);
    }
    return commentable;
  },

  async commentOn(
    entity: CommentableEntity,
    schema: EntitySchema<any>,
    comment: models.IComment
  ) {
    comment.commentable = await this.findOrGetCommentable(entity, schema);
    return this.manager.getRepository(db.CommentSchema).save(comment);
  },
});

export default CommentRepository;
