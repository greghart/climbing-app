import { Commentable, getDataSource } from "@/db";
import CommentRepository, {
  CommentableEntity,
} from "@/db/repos/CommentRepository";
import { cache } from "react";
import "server-only";
import { EntitySchema } from "typeorm";

/**
 * getComments returns comments for given entity.
 * Curried for ease of use.
 */
function getComments(schema: EntitySchema<CommentableEntity>) {
  return cache(async (id: number) => {
    const ds = await getDataSource();
    const entity = await ds.getRepository(schema).findOne({
      where: { id },
    });
    if (!entity) return;

    const commentable = await ds.manager
      .withRepository(CommentRepository)
      .findOrGetCommentable(entity, schema);

    return ds.getRepository(Commentable).findOne({
      where: { id: commentable.id },
      relations: ["comments"], // TODO: add and get user relation
    });
  });
}

export default getComments;
