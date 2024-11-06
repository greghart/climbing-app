import { Area, Commentable, getDataSource } from "@/db";
import CommentRepository from "@/db/repos/CommentRepository";
import { cache } from "react";
import "server-only";

const getAreaComments = cache(async (id: number) => {
  const ds = await getDataSource();
  const crag = await ds.getRepository(Area).findOne({
    where: { id },
  });
  if (!crag) return;

  const commentable = await ds.manager
    .withRepository(CommentRepository)
    .findOrGetCommentable(crag, Area);

  return ds.getRepository(Commentable).findOne({
    where: { id: commentable.id },
    relations: ["comments"], // TODO: add and get user relation
  });
});

export default getAreaComments;
